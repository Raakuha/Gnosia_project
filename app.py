

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import joblib
import re
import numpy as np
import os
import warnings
warnings.filterwarnings("ignore")
import pandas as pd

# ─────────────────────────────────────────────
# App init
# ─────────────────────────────────────────────
app = FastAPI(
    title="Gnosia API",
    description="AI Symptom Checker — Disease Prediction from Symptoms",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Load Models
# ─────────────────────────────────────────────
MODEL_DIR = "models"

def load_model(filename):
    path = os.path.join(MODEL_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model tidak ditemukan: {path}")
    return joblib.load(path)

print("Loading models...")
try:
    tfidf_vectorizer = load_model("tfidf_vectorizer.pkl")
    lr_tfidf         = load_model("lr_tfidf.pkl")
    label_encoder    = load_model("label_encoder.pkl")
    print("LR TF-IDF model loaded!")
except Exception as e:
    print(f"Gagal load LR model: {e}")
    tfidf_vectorizer = lr_tfidf = label_encoder = None

# Load BERT (opsional)
try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch

    BERT_DIR = os.path.join(MODEL_DIR, "bert_model")
    if os.path.exists(BERT_DIR):
        bert_tokenizer = AutoTokenizer.from_pretrained(BERT_DIR)
        bert_model     = AutoModelForSequenceClassification.from_pretrained(BERT_DIR)
        bert_model.eval()
        BERT_AVAILABLE = True
        print("BERT model loaded!")
    else:
        BERT_AVAILABLE = False
        print("BERT model folder tidak ditemukan, BERT dinonaktifkan.")
except Exception as e:
    BERT_AVAILABLE = False
    print(f"BERT tidak bisa diload: {e}")


# ─────────────────────────────────────────────
# Text Preprocessing
# ─────────────────────────────────────────────
def preprocess(symptoms: List[str]) -> str:
    """Sama persis dengan pipeline training di notebook."""
    text = " ".join(symptoms)
    text = text.replace("_", " ").lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^a-z\s]", "", text)
    return text.strip()

def format_for_bert(symptoms: List[str]) -> str:
    """Format natural untuk input BERT."""
    joined = ", ".join([s.replace("_", " ") for s in symptoms])
    return f"Patient presents with the following symptoms: {joined}."


# ─────────────────────────────────────────────
# Schema
# ─────────────────────────────────────────────
class PredictRequest(BaseModel):
    symptoms: List[str]
    model: Optional[str] = "lr_tfidf"  # "lr_tfidf" | "bert"
    top_n: Optional[int] = 3

class Prediction(BaseModel):
    disease: str
    confidence: float

class PredictResponse(BaseModel):
    model_used: str
    input_symptoms: List[str]
    cleaned_text: str
    top_predictions: List[Prediction]


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "app": "Gnosia API",
        "status": "running",
        "models_available": {
            "lr_tfidf": lr_tfidf is not None,
            "bert": BERT_AVAILABLE
        }
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not req.symptoms:
        raise HTTPException(status_code=400, detail="symptoms tidak boleh kosong")

    model_choice = req.model.lower()

    # ── LR TF-IDF ──────────────────────────────
    if model_choice == "lr_tfidf":
        if lr_tfidf is None or tfidf_vectorizer is None:
            raise HTTPException(status_code=503, detail="LR model belum terload")

        cleaned     = preprocess(req.symptoms)
        X_input     = tfidf_vectorizer.transform([cleaned])
        probas      = lr_tfidf.predict_proba(X_input)[0]
        top_indices = probas.argsort()[::-1][: req.top_n]

        top_preds = [
            Prediction(
                disease=lr_tfidf.classes_[i],
                confidence=round(float(probas[i]) * 100, 2)
            )
            for i in top_indices
        ]

        return PredictResponse(
            model_used="Logistic Regression + TF-IDF",
            input_symptoms=req.symptoms,
            cleaned_text=cleaned,
            top_predictions=top_preds
        )

    # ── BERT ───────────────────────────────────
    elif model_choice == "bert":
        if not BERT_AVAILABLE:
            raise HTTPException(status_code=503, detail="BERT model tidak tersedia")

        import torch
        text   = format_for_bert(req.symptoms)
        inputs = bert_tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=128,
            padding=True
        )

        with torch.no_grad():
            outputs = bert_model(**inputs)
            probas  = torch.softmax(outputs.logits, dim=1)[0].numpy()

        top_indices = probas.argsort()[::-1][: req.top_n]
        classes     = label_encoder.classes_ if label_encoder else [str(i) for i in range(len(probas))]

        top_preds = [
            Prediction(
                disease=classes[i],
                confidence=round(float(probas[i]) * 100, 2)
            )
            for i in top_indices
        ]

        return PredictResponse(
            model_used="BERT (fine-tuned)",
            input_symptoms=req.symptoms,
            cleaned_text=text,
            top_predictions=top_preds
        )

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{model_choice}' tidak dikenal. Pilih: 'lr_tfidf' atau 'bert'"
        )

@app.get("/symptoms")
def list_symptoms():
    """Daftar semua gejala yang dikenali model (dari vocabulary TF-IDF)."""
    if tfidf_vectorizer is None:
        raise HTTPException(status_code=503, detail="Vectorizer belum terload")
    vocab = sorted(tfidf_vectorizer.vocabulary_.keys())
    return {"total": len(vocab), "symptoms": vocab}

@app.get("/diseases")
def list_diseases():
    """Daftar semua penyakit yang bisa diprediksi."""
    if lr_tfidf is None:
        raise HTTPException(status_code=503, detail="Model belum terload")
    diseases = sorted(lr_tfidf.classes_.tolist())
    return {"total": len(diseases), "diseases": diseases}

try:
    df_desc = pd.read_csv("data/symptom_Description.csv").set_index("Disease")
    df_prec = pd.read_csv("data/symptom_precaution.csv").set_index("Disease")
    df_sev  = pd.read_csv("data/Symptom-severity.csv").set_index("Symptom")
    RECOMMEND_AVAILABLE = True
    print("Recommendation tables loaded!")
except Exception as e:
    RECOMMEND_AVAILABLE = False
    print(f"Recommendation tables gagal load: {e}")


# ── Schema ──
class RecommendResponse(BaseModel):
    disease: str
    description: str
    precautions: List[str]
    severity_score: int
    severity_label: str


# ── Endpoint ──
@app.get("/recommend/{disease}", response_model=RecommendResponse)
def recommend(disease: str):
    if not RECOMMEND_AVAILABLE:
        raise HTTPException(status_code=503, detail="Recommendation data tidak tersedia")

    # Cari disease (case-insensitive)
    matches = [d for d in df_desc.index if d.lower() == disease.lower()]
    if not matches:
        raise HTTPException(status_code=404, detail=f"Penyakit '{disease}' tidak ditemukan")

    d = matches[0]

    description = df_desc.loc[d, "Description"]

    prec_cols = ["Precaution_1", "Precaution_2", "Precaution_3", "Precaution_4"]
    precautions = [str(df_prec.loc[d, c]) for c in prec_cols if pd.notna(df_prec.loc[d, c])]

    # Severity: ambil dari gejala yang match dengan nama penyakit
    # (pakai score rata-rata semua gejala di dataset sebagai fallback)
    avg_severity = int(df_sev["weight"].mean())
    label = "Mild" if avg_severity <= 3 else "Moderate" if avg_severity <= 5 else "Severe"

    return RecommendResponse(
        disease=d,
        description=description,
        precautions=precautions,
        severity_score=avg_severity,
        severity_label=label
    )
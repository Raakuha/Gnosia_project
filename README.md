# Gnosia - AI Symptom Checker

## Deskripsi Project

Gnosia adalah aplikasi kesehatan berbasis kecerdasan buatan yang dirancang untuk membantu pengguna melakukan pengecekan gejala penyakit secara mandiri dan cepat. Fokus utama aplikasi ini adalah memberikan prediksi penyakit berdasarkan gejala yang diinputkan pengguna dengan memanfaatkan model Machine Learning yang telah dilatih pada data medis. Dengan Gnosia, pengguna dapat memperoleh gambaran awal mengenai kondisi kesehatan mereka sebelum berkonsultasi lebih lanjut dengan tenaga medis profesional.

Model utama yang digunakan adalah **Logistic Regression dengan vektorisasi TF-IDF**, yang dibandingkan performanya terhadap model **BERT fine-tuned dengan augmentasi data** sebagai pendekatan deep learning. Perbandingan ini bertujuan untuk mengevaluasi trade-off antara model klasik yang ringan dan efisien dengan model berbasis transformer yang lebih kompleks.

Project ini dikembangkan sebagai bagian dari tugas dua mata kuliah sekaligus, yaitu **Machine Learning** dan **Software Engineering**.

---

## Penjelasan Fitur

Aplikasi ini memiliki beberapa fitur utama yang mendukung fungsionalitasnya:

- **AI Symptom Analyzer**: Pengguna dapat menginputkan gejala yang dirasakan, lalu sistem akan memprediksi penyakit yang paling mungkin beserta tingkat kepercayaan (confidence score) dari model.
- **Symptom Picker**: Fitur pop-up interaktif yang menampilkan daftar 132 gejala yang dikenali model, dilengkapi fitur pencarian agar pengguna mudah memilih gejala yang sesuai.
- **Top 3 Predictions**: Sistem menampilkan 3 kemungkinan penyakit teratas beserta persentase keyakinan model untuk masing-masing prediksi.
- **User Authentication**: Fitur registrasi dan login untuk memastikan data kesehatan hanya dapat diakses oleh pemilik akun.
- **Dashboard Monitoring**: Tampilan antarmuka yang memudahkan pengguna memantau riwayat analisis kesehatan mereka.
- **Gfit**: Halaman panduan gaya hidup sehat, mencakup panduan olahraga, nutrisi, dan mindfulness.
- **Health Store**: Halaman produk kesehatan yang direkomendasikan berdasarkan kebutuhan pengguna.

---

## Teknologi yang Digunakan

| Layer | Teknologi |
|---|---|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | Python, FastAPI, Uvicorn |
| Machine Learning | Scikit-learn, NLTK, Joblib |
| Model Utama | Logistic Regression + TF-IDF |
| Model Perbandingan | BERT (fine-tuned + augmentasi data) |
| Deep Learning | Transformers (HuggingFace), PyTorch |

---

## Performa Model

Berikut perbandingan performa antara model utama (Logistic Regression + TF-IDF) dan model pembanding (BERT fine-tuned dengan augmentasi data):

| Model | Pendekatan | Test Accuracy | F1 Score | Precision | Recall |
|---|---|---|---|---|---|
| Logistic Regression + TF-IDF | Classical ML | 100.00% | 1.0000 | 1.0000 | 1.0000 |
| BERT fine-tuned + Augmentasi | Deep Learning (Transformer) | 95.08% | 0.9344 | 0.9262 | 0.9508 |

> Model klasik dilatih pada dataset 304 sampel unik (41 kelas penyakit) setelah deduplikasi dari dataset sintetis. Model BERT (`bert-base-uncased`) dilatih selama 5 epoch menggunakan data training yang telah diaugmentasi dengan teknik permutasi gejala (15x per sampel) untuk meningkatkan generalisasi. Meskipun BERT adalah model yang lebih kompleks, Logistic Regression + TF-IDF unggul pada dataset ini karena pola gejala yang terstruktur dan deterministik.

---

## Daftar Penyakit yang Dapat Diprediksi

Model Gnosia dilatih untuk mengenali **41 kelas penyakit** berdasarkan kombinasi gejala yang diinputkan. Berikut daftar lengkapnya:

### 🫀 Kardiovaskular & Pembuluh Darah
| No | Nama Penyakit |
|---|---|
| 1 | Heart attack |
| 2 | Hypertension |
| 3 | Varicose veins |

### 🫁 Pernapasan
| No | Nama Penyakit |
|---|---|
| 4 | Bronchial Asthma |
| 5 | Common Cold |
| 6 | Pneumonia |
| 7 | Tuberculosis |

### 🧠 Saraf & Otak
| No | Nama Penyakit |
|---|---|
| 8 | (vertigo) Paroxysmal Positional Vertigo |
| 9 | Cervical spondylosis |
| 10 | Migraine |
| 11 | Paralysis (brain hemorrhage) |

### 🦠 Infeksi & Virus
| No | Nama Penyakit |
|---|---|
| 12 | AIDS |
| 13 | Chicken pox |
| 14 | Dengue |
| 15 | Fungal infection |
| 16 | Impetigo |
| 17 | Malaria |
| 18 | Typhoid |

### 🍺 Hati & Saluran Empedu
| No | Nama Penyakit |
|---|---|
| 19 | Alcoholic hepatitis |
| 20 | Chronic cholestasis |
| 21 | Hepatitis A |
| 22 | Hepatitis B |
| 23 | Hepatitis C |
| 24 | Hepatitis D |
| 25 | Hepatitis E |
| 26 | Jaundice |

### 🍽️ Pencernaan & Lambung
| No | Nama Penyakit |
|---|---|
| 27 | GERD |
| 28 | Gastroenteritis |
| 29 | Peptic ulcer disease |
| 30 | Dimorphic hemorrhoids (piles) |

### 🦴 Sendi & Muskuloskeletal
| No | Nama Penyakit |
|---|---|
| 31 | Arthritis |
| 32 | Osteoarthritis |

### 🩺 Metabolik & Endokrin
| No | Nama Penyakit |
|---|---|
| 33 | Diabetes |
| 34 | Hyperthyroidism |
| 35 | Hypothyroidism |
| 36 | Hypoglycemia |

### 🌿 Alergi & Reaksi Imun
| No | Nama Penyakit |
|---|---|
| 37 | Allergy |
| 38 | Drug Reaction |

### 🧴 Kulit
| No | Nama Penyakit |
|---|---|
| 39 | Acne |
| 40 | Psoriasis |

### 🚽 Saluran Kemih
| No | Nama Penyakit |
|---|---|
| 41 | Urinary tract infection |

> **Catatan:** Nama penyakit pada tabel di atas disesuaikan ejaannya untuk keterbacaan. Nama yang disimpan dalam model mengikuti format asli dari dataset pelatihan.

---

## Cara Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan project ini di perangkat lokal Anda:

### 1. Clone Repository
```bash
git clone https://github.com/Raakuha/Gnosia_project.git
cd Gnosia_project
```

### 2. Install Dependencies Backend
Pastikan Python 3.10+ sudah terinstall, lalu jalankan:
```bash
pip install -r requirements.txt
```

### 3. Jalankan Backend (FastAPI)
Buka terminal pertama dan jalankan:
```bash
python -m uvicorn app:app --reload --port 8000
```
Backend akan berjalan di `http://127.0.0.1:8000`

> Cek status API di `http://127.0.0.1:8000/docs` untuk melihat dokumentasi endpoint secara interaktif.

### 4. Jalankan Frontend
Buka terminal kedua dan jalankan:
```bash
python -m http.server 5500
```

### 5. Akses Aplikasi
Buka browser dan arahkan ke:
```
http://localhost:5500/index.html
```

---

## Struktur Project

```
GNOSIA_PROJECT/
├── Assets/
│   └── style.css               # Global stylesheet
├── models/
│   ├── tfidf_vectorizer.pkl     # TF-IDF vectorizer
│   ├── lr_tfidf.pkl             # Model Logistic Regression + TF-IDF (model utama)
│   ├── label_encoder.pkl        # Label encoder
│   └── bert/                   # Folder model BERT fine-tuned
│       ├── config.json          # Konfigurasi model BERT
│       ├── pytorch_model.bin    # Bobot model BERT
│       └── tokenizer/           # Tokenizer BERT
├── script/
│   └── script.js               # Frontend logic & API integration
├── app.py                      # FastAPI backend
├── requirements.txt            # Python dependencies
├── index.html                  # Halaman utama
├── dashboard.html              # Dashboard pengguna
├── loqin.html                  # Halaman login
├── register.html               # Halaman registrasi
├── forgot-password.html        # Halaman lupa password
├── gfit.html                   # Halaman Gfit (gaya hidup sehat)
└── health-store.html           # Halaman Health Store
```

---

## Endpoint API

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/` | Status server & model |
| GET | `/health` | Health check |
| POST | `/predict` | Prediksi penyakit dari gejala |
| GET | `/symptoms` | Daftar semua gejala yang dikenali |
| GET | `/diseases` | Daftar semua penyakit yang dapat diprediksi |

### Contoh Request `/predict`

Gunakan model Logistic Regression (default):
```json
{
  "symptoms": ["itching", "skin_rash", "nodal_skin_eruptions"],
  "model": "lr_tfidf",
  "top_n": 3
}
```

Atau gunakan model BERT untuk perbandingan:
```json
{
  "symptoms": ["itching", "skin_rash", "nodal_skin_eruptions"],
  "model": "bert",
  "top_n": 3
}
```

### Contoh Response
```json
{
  "model_used": "Logistic Regression + TF-IDF",
  "input_symptoms": ["itching", "skin_rash", "nodal_skin_eruptions"],
  "top_predictions": [
    { "disease": "Fungal infection", "confidence": 92.5 },
    { "disease": "Chicken pox", "confidence": 4.3 },
    { "disease": "Impetigo", "confidence": 3.2 }
  ]
}
```

---

## Disclaimer

> Gnosia adalah alat bantu berbasis AI dan **bukan pengganti diagnosis medis profesional**. Hasil prediksi bersifat indikatif dan hanya berdasarkan dataset sintetis. Selalu konsultasikan kondisi kesehatan Anda kepada dokter atau tenaga medis yang berkompeten.

---

## Tim Pengembang

Dikembangkan oleh mahasiswa untuk memenuhi tugas mata kuliah **Machine Learning** dan **Software Engineering**.

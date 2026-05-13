# Gnosia - AI Symptom Checker

## Deskripsi Project

Gnosia adalah aplikasi kesehatan berbasis kecerdasan buatan yang dirancang untuk membantu pengguna melakukan pengecekan gejala penyakit secara mandiri dan cepat. Fokus utama aplikasi ini adalah memberikan prediksi penyakit berdasarkan gejala yang diinputkan pengguna dengan memanfaatkan model Machine Learning yang telah dilatih pada data medis. Dengan Gnosia, pengguna dapat memperoleh gambaran awal mengenai kondisi kesehatan mereka sebelum berkonsultasi lebih lanjut dengan tenaga medis profesional.

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
| Model | Logistic Regression + TF-IDF, Naive Bayes + BoW/TF-IDF |
| Deep Learning | BERT (fine-tuned, opsional) |

---

## Performa Model

| Model | Test Accuracy | F1 Score |
|---|---|---|
| Naive Bayes + BoW | 96.72% | 0.9596 |
| Naive Bayes + TF-IDF | 98.36% | 0.9825 |
| Logistic Regression + TF-IDF | 100.00% | 1.0000 |

> Model dilatih pada dataset 304 sampel unik (41 kelas penyakit) setelah deduplikasi dari dataset sintetis.

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
│   ├── bow_vectorizer.pkl       # Bag of Words vectorizer
│   ├── tfidf_vectorizer.pkl     # TF-IDF vectorizer
│   ├── nb_bow.pkl               # Model Naive Bayes + BoW
│   ├── nb_tfidf.pkl             # Model Naive Bayes + TF-IDF
│   ├── lr_bow.pkl               # Model Logistic Regression + BoW
│   ├── lr_tfidf.pkl             # Model Logistic Regression + TF-IDF
│   └── label_encoder.pkl        # Label encoder
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
```json
{
  "symptoms": ["itching", "skin_rash", "nodal_skin_eruptions"],
  "model": "lr_tfidf",
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

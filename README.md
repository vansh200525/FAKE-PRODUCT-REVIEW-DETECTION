# FAKE-PRODUCT-REVIEW-DETECTION

## Project Overview

Fake Product Review Detection is a full-stack Machine Learning web application designed to identify whether a product review is genuine or fake.

The project combines:

* Frontend using React + Vite
* Backend using FastAPI
* Machine Learning models using Scikit-learn, XGBoost, TF-IDF Vectorizer
* Multiple model comparison with accuracy graphs, ROC curves, and confusion matrices

This system helps users analyze product reviews and determine review authenticity using trained ML models.

---

## Features

* Product review authenticity prediction
* Multiple ML model comparison
* Accuracy comparison of:

  * Logistic Regression
  * Random Forest
  * Support Vector Machine (SVM)
  * XGBoost
  * Ensemble Model
* ROC Curve visualization
* Confusion Matrix reports
* Interactive frontend dashboard
* FastAPI backend integration
* Real-time prediction pipeline

---

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS

### Backend

* FastAPI
* Python
* Uvicorn

### Machine Learning

* Scikit-learn
* XGBoost
* Pandas
* NumPy
* TF-IDF Vectorizer
* Pickle

---

## Project Structure

```text
FAKE-PRODUCT-REVIEW-DETECTION
│
├── backend
│   ├── main.py
│   ├── scraper.py
│   ├── feedback.json
│   └── requirements.txt
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── ml
│   ├── data
│   ├── models
│   ├── notebooks
│   ├── reports
│   ├── src
│   └── requirements.txt
│
├── package.json
├── package-lock.json
└── README.md
```

---

## Installation Setup

## Step 1: Clone Repository

```bash
git clone https://github.com/vansh200525/FAKE-PRODUCT-REVIEW-DETECTION.git
cd FAKE-PRODUCT-REVIEW-DETECTION
```

---

## Step 2: Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

## Step 3: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Step 4: ML Setup

```bash
cd ml
pip install -r requirements.txt
python src/train.py
python src/predict.py
```

---

## Machine Learning Models Used

* Logistic Regression
* Random Forest Classifier
* Support Vector Machine (SVM)
* XGBoost Classifier
* Ensemble Learning Model

---

## Reports Generated

Located inside:

```text
ml/reports/
```

Includes:

* ROC Curves
* Confusion Matrices
* Model Accuracy Comparison

---

## Future Improvements

* Live Amazon review scraping
* Real-time sentiment analysis
* Deep Learning model integration
* Deployment using Vercel + Render
* Admin dashboard
* User authentication system

---

## Deployment

### Frontend Deployment

* Vercel

### Backend Deployment

* Render / Railway

---

## Author

### Vansh 

BCA Student
Graphic Era Hill University
Dehradun, Uttarakhand, India

---

## Disclaimer

This project is developed for educational and research purposes only. We have used publicly available product reviews from Flipkart to analyze and detect fake reviews. No part of this project is intended for commercial use or to infringe on Flipkart’s rights. All trademarks and product information belong to their respective owners. If required, we are willing to remove any data or content upon request.


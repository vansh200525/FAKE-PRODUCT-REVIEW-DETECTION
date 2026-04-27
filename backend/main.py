# backend/main.py
# FastAPI Backend
# HOW TO RUN:
# uvicorn main:app --reload --port 8000

import json
import os
import sys
import pickle
import sqlite3
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from scraper import is_url, scrape_reviews_from_url

sys.path.append(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "ml",
        "src"
    )
)

from predict import predict as ml_predict


app = FastAPI(
    title="Fake Review Detection API",
    description="Detects fake product reviews using ML.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# DATABASE
# =========================

DB = "history.db"


def init_db():
    conn = sqlite3.connect(DB)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            review TEXT NOT NULL,
            label TEXT NOT NULL,
            confidence REAL NOT NULL,
            sentiment TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


init_db()


# =========================
# MODEL PATHS
# =========================

MODEL_PATH = os.path.join(
    "..",
    "ml",
    "models",
    "svm_model.pkl"
)

VEC_PATH = os.path.join(
    "..",
    "ml",
    "models",
    "tfidf_vectorizer.pkl"
)

_model = None
_vec = None


def load_models():
    global _model, _vec

    if _model is None:
        with open(MODEL_PATH, "rb") as f:
            _model = pickle.load(f)

        with open(VEC_PATH, "rb") as f:
            _vec = pickle.load(f)

    return _model, _vec


# =========================
# REQUEST MODELS
# =========================

class ReviewRequest(BaseModel):
    review_text: str


class FeedbackRequest(BaseModel):
    name: str
    email: str
    message: str


# =========================
# BASIC ROUTES
# =========================

@app.get("/")
def root():
    return {
        "message": "Fake Review Detection API is running!",
        "docs": "/docs"
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }


# =========================
# PREDICTION API
# =========================

@app.post("/api/predict")
def predict_review(req: ReviewRequest):
    text = req.review_text.strip()

    if not text:
        raise HTTPException(
            status_code=400,
            detail="Input cannot be empty."
        )

    try:
        model, vec = load_models()

        # CASE 1 → Product URL
        if is_url(text):
            reviews = scrape_reviews_from_url(text)

            if not reviews:
                raise HTTPException(
                    status_code=400,
                    detail="Could not extract reviews from this product link."
                )

            results = []

            for review in reviews:
                pred = ml_predict(review, model, vec)
                results.append(pred)

            fake_count = sum(
                1 for r in results
                if r["label"] == "FAKE"
            )

            genuine_count = len(results) - fake_count

            fake_percentage = round(
                (fake_count / len(results)) * 100,
                1
            )
            
            genuine_percentage = round(100.0 - fake_percentage, 1)

            final_label = (
                "FAKE"
                if fake_percentage >= 50
                else "GENUINE"
            )

            return {
                "label": final_label,
                "total_reviews": len(results),
                "fake_count": fake_count,
                "genuine_count": genuine_count,
                "fake_percentage": fake_percentage,
                "genuine_percentage": genuine_percentage,
                "reviews_analyzed": results
            }

        # CASE 2 → Direct Review Text
        else:
            if len(text) < 10:
                raise HTTPException(
                    status_code=400,
                    detail="Review is too short."
                )

            result = ml_predict(text, model, vec)

            # save prediction history
            conn = sqlite3.connect(DB)

            conn.execute(
                """
                INSERT INTO predictions
                (review, label, confidence, sentiment, timestamp)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    text[:500],
                    result["label"],
                    result["confidence"],
                    result["sentiment"],
                    datetime.now().isoformat()
                )
            )

            conn.commit()
            conn.close()

            return result

    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Model not found — run training first."
        )

    except HTTPException as e:
        raise e

    except Exception as e:
        print("FULL ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )


# =========================
# FEEDBACK API
# =========================

@app.post("/api/feedback")
def save_feedback(req: FeedbackRequest):
    feedback_file = "feedback.json"

    new_feedback = {
        "name": req.name,
        "email": req.email,
        "message": req.message,
        "timestamp": datetime.now().isoformat()
    }

    if os.path.exists(feedback_file):
        with open(
            feedback_file,
            "r",
            encoding="utf-8"
        ) as f:
            try:
                all_feedback = json.load(f)
            except:
                all_feedback = []
    else:
        all_feedback = []

    all_feedback.append(new_feedback)

    with open(
        feedback_file,
        "w",
        encoding="utf-8"
    ) as f:
        json.dump(
            all_feedback,
            f,
            indent=4,
            ensure_ascii=False
        )

    return {
        "success": True,
        "message": "Feedback saved successfully"
    }


# =========================
# HISTORY API
# =========================

@app.get("/api/history")
def history(limit: int = 20):
    conn = sqlite3.connect(DB)

    rows = conn.execute(
        """
        SELECT
            id,
            review,
            label,
            confidence,
            sentiment,
            timestamp
        FROM predictions
        ORDER BY id DESC
        LIMIT ?
        """,
        (limit,)
    ).fetchall()

    conn.close()

    return [
        {
            "id": r[0],
            "review": r[1],
            "label": r[2],
            "confidence": r[3],
            "sentiment": r[4],
            "timestamp": r[5]
        }
        for r in rows
    ]


# =========================
# STATS API
# =========================

@app.get("/api/stats")
def stats():
    conn = sqlite3.connect(DB)

    total = conn.execute(
        "SELECT COUNT(*) FROM predictions"
    ).fetchone()[0]

    fake = conn.execute(
        "SELECT COUNT(*) FROM predictions WHERE label='FAKE'"
    ).fetchone()[0]

    real = conn.execute(
        "SELECT COUNT(*) FROM predictions WHERE label='GENUINE'"
    ).fetchone()[0]

    avg = conn.execute(
        "SELECT AVG(confidence) FROM predictions"
    ).fetchone()[0]

    conn.close()

    return {
        "total_predictions": total,
        "fake_count": fake,
        "genuine_count": real,
        "fake_percentage": round(
            fake / max(total, 1) * 100,
            1
        ),
        "avg_confidence": round(avg or 0, 3)
    }

"We used traditional"
" machine learning models which do not require epochs."
" Training is done in a single fit operation unlike deep learning models."

import pandas as pd
import numpy as np
import pickle, os, mlflow, mlflow.sklearn
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, VotingClassifier

from sklearn.metrics import (
    accuracy_score, f1_score, precision_score,
    recall_score, roc_auc_score, classification_report
)
from xgboost import XGBClassifier
import warnings
warnings.filterwarnings("ignore")

# ── Config ────────────────────────────────────────────────────
#  CORRECT: read features_engineered.csv (output of feature_engineering.py)
DATA_PATH    = "../data/processed/features_engineered.csv"
MODEL_DIR    = "../models"
MAX_FEATURES = 10000   
MAX_LEN      = 200     
EMBED_DIM    = 64
BATCH_SIZE   = 64
EPOCHS       = 10
RS           = 42

os.makedirs(MODEL_DIR, exist_ok=True)



# ── Load Data ─────────────────────────────────────────────────
def load_data():
    df = pd.read_csv(DATA_PATH)
    print(f" Loaded features_engineered.csv — {len(df)} rows, {len(df.columns)} columns")

    X_text = df["cleaned_text"].astype(str)
    y = df["label_encoded"].astype(int)

    print(f"   Using cleaned_text only (TF-IDF)")
    print(f"   Label distribution: {dict(y.value_counts())}")

    return X_text, y


# ── Build Combined Feature Matrix ─────────────────────────────
def build_features(X_train, X_val, X_test):
    print("\n Building TF-IDF vectorizer...")

    vec = TfidfVectorizer(max_features=MAX_FEATURES, ngram_range=(1,2))
    
    X_tr = vec.fit_transform(X_train)
    X_va = vec.transform(X_val)
    X_te = vec.transform(X_test)

    with open(f"{MODEL_DIR}/tfidf_vectorizer.pkl", "wb") as f:
        pickle.dump(vec, f)

    print("   TF-IDF vectorizer saved.")
    return X_tr, X_va, X_te


# ── Evaluate ──────────────────────────────────────────────────
def evaluate(name, model, X_test, y_test):
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    metrics = {
        "accuracy":  round(accuracy_score(y_test, y_pred), 4),
        "f1":        round(f1_score(y_test, y_pred),       4),
        "precision": round(precision_score(y_test, y_pred),4),
        "recall":    round(recall_score(y_test, y_pred),   4),
        "auc":       round(roc_auc_score(y_test, y_prob),  4),
    }
    print(f"\n {name}:")
    for k, v in metrics.items():
        print(f"   {k:10s}: {v}")
    print(classification_report(y_test, y_pred, target_names=["Genuine", "Fake"]))
    return metrics


# ── Train Sklearn Models ───────────────────────────────────────
def train_sklearn_models(X_tr, y_tr, X_te, y_te):
    lr  = LogisticRegression(max_iter=1000, class_weight="balanced", random_state=RS)
    rf  = RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=RS)
    xgb = XGBClassifier(n_estimators=200, xgb = XGBClassifier(n_estimators=200,eval_metric="logloss",random_state=RS),
                         eval_metric="logloss", random_state=RS)
    svm = SVC(probability=True, class_weight="balanced")

    for name, model in [("LogisticRegression", lr),
                    ("RandomForest", rf),
                    ("XGBoost", xgb),
                    ("SVM", svm)]:

        with mlflow.start_run(run_name=name):
            model.fit(X_tr, y_tr)
            m = evaluate(name, model, X_te, y_te)

            #  SAVE EACH MODEL
            filename = name.lower() + "_model.pkl"
            with open(f"{MODEL_DIR}/{filename}", "wb") as f:
                pickle.dump(model, f)

            print(f"   {filename} saved ")

            mlflow.log_params({"model": name})
            mlflow.log_metrics(m)
            mlflow.sklearn.log_model(model, "model")

    # Voting Ensemble — combines all three
    ensemble = VotingClassifier(
        estimators=[("lr", lr), ("rf", rf), ("xgb", xgb),("svm", svm)],
        voting="soft"
    )
    with mlflow.start_run(run_name="VotingEnsemble"):
        ensemble.fit(X_tr, y_tr)
        m = evaluate("VotingEnsemble", ensemble, X_te, y_te)
        mlflow.log_params({"model": "VotingEnsemble"})
        mlflow.log_metrics(m)

    with open(f"{MODEL_DIR}/ensemble_model.pkl", "wb") as f:
       pickle.dump(ensemble, f)

    print("\n ensemble_model.pkl saved ")
    print("\n ensemble_model.pkl saved (Voting Ensemble of LR + RF + XGB + SVM)")
    return ensemble

# ── Main ──────────────────────────────────────────────────────
if __name__ == "__main__":
    mlflow.set_experiment("Fake-Review-Detection")

    # 1. Load  (reads features_engineered.csv )
    X_text, y = load_data()

    # 2. Split — 70% train / 15% val / 15% test
    X_train, X_temp, y_train, y_temp = train_test_split(
    X_text, y, test_size=0.30, stratify=y, random_state=RS)

    X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.50, stratify=y_temp, random_state=RS)


    print(f"\n Split — Train: {len(y_train)}  Val: {len(y_val)}  Test: {len(y_test)}")



    # 4. Train sklearn models (LR, RF, XGB, Ensemble)
    X_tr, X_va, X_te = build_features(X_train, X_val, X_test)
    train_sklearn_models(X_tr, y_train, X_te, y_test)

    print("\n" + "="*55)
    print("  ALL MODELS TRAINED & SAVED in ml/models/")
    print("  Files created:")
    print("    ensemble_model.pkl   ← sklearn ensemble")
    print("    tfidf_vectorizer.pkl ← TF-IDF vectorizer")
    print("="*55)



















    # ml/src/train.py
# TEAM MEMBER 2 — Model Training
# ============================================================
# CORRECT INPUT FLOW:
#
#   preprocess.py
#       → ../data/processed/cleaned_reviews.csv
#
#   feature_engineering.py   (run this BEFORE train.py)
#       → ../data/processed/features_engineered.csv
#
#   train.py   ← reads features_engineered.csv   
#       → ../models/best_model.pkl
#       → ../models/tfidf_vectorizer.pkl
#       → ../models/tokenizer.pkl
#
# WHY features_engineered.csv and NOT cleaned_reviews.csv?
# ─────────────────────────────────────────────────────────
# cleaned_reviews.csv has:
#   - cleaned text, lemmatized text, basic stats (word count, sentiment…)
#
# features_engineered.csv has EVERYTHING above PLUS:
#   - 50 SVD/TF-IDF dense columns (svd_0 … svd_49)
#     → these capture topic/semantic info as numbers
#
# We combine TWO types of features for the sklearn models:
#   1. TF-IDF vectors  (built fresh from lemmatized_text inside this script)
#   2. Handcrafted numerical columns (sentiment, word count, exclamation…)
#      already sitting as columns in features_engineered.csv
#
# This hybrid approach gives ~2–3% better accuracy than TF-IDF alone.

# “How many epochs did you train?”
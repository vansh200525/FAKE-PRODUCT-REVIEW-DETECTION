# ml/src/evaluate.py
# TEAM MEMBER 2 — Generate evaluation charts after training

import pickle, numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from sklearn.metrics import (confusion_matrix, roc_curve, auc,
                              classification_report)

MODEL_DIR  = "../models"
REPORT_DIR = "../reports"
os.makedirs(REPORT_DIR, exist_ok=True)


def load_all_models():
    models = {
        "lr": "logisticregression_model.pkl",
        "rf": "randomforest_model.pkl",
        "xgb": "xgboost_model.pkl",
        "svm": "svm_model.pkl",
        "ensemble": "ensemble_model.pkl"
    }

    loaded_models = {}

    for name, file in models.items():
        with open(f"{MODEL_DIR}/{file}", "rb") as f:
            loaded_models[name] = pickle.load(f)

    with open(f"{MODEL_DIR}/tfidf_vectorizer.pkl", "rb") as f:
        vectorizer = pickle.load(f)

    return loaded_models, vectorizer 


def plot_confusion_matrix(y_true, y_pred, save="confusion_matrix.png"):
    cm  = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(5,4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=["Genuine","Fake"],
                yticklabels=["Genuine","Fake"], ax=ax)
    ax.set_xlabel("Predicted"); ax.set_ylabel("Actual")
    ax.set_title("Confusion Matrix")
    plt.tight_layout()
    plt.savefig(os.path.join(REPORT_DIR, save), dpi=150); plt.close()
    print(f"Saved: {REPORT_DIR}/{save}")


def plot_roc(y_true, y_prob, save="roc_curve.png"):
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    roc_auc     = auc(fpr, tpr)
    fig, ax = plt.subplots(figsize=(5,4))
    ax.plot(fpr, tpr, color="blue", lw=2, label=f"AUC = {roc_auc:.3f}")
    ax.plot([0,1],[0,1], color="gray", linestyle="--")
    ax.set_xlabel("FPR"); ax.set_ylabel("TPR")
    ax.set_title("ROC Curve"); ax.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(os.path.join(REPORT_DIR, save), dpi=150); plt.close()
    print(f"Saved: {REPORT_DIR}/{save}")
    return roc_auc


def full_report(model, vectorizer, X_test_raw, y_test):
    X    = vectorizer.transform(X_test_raw)
    pred = model.predict(X)
    prob = model.predict_proba(X)[:, 1]
    print(classification_report(y_test, pred, target_names=["Genuine","Fake"]))
    plot_confusion_matrix(y_test, pred)
    plot_roc(y_test, prob)
    
if __name__ == "__main__":
    import pandas as pd

    # Load all models
    models, vectorizer = load_all_models()

    # Load dataset
    df = pd.read_csv("../data/processed/features_engineered.csv")

    X_test = df["cleaned_text"]
    y_test = df["label_encoded"]

    X = vectorizer.transform(X_test)

    # Loop through each model
    for name, model in models.items():
        print(f"\n🔹 Evaluating: {name}")

        pred = model.predict(X)
        prob = model.predict_proba(X)[:, 1]

        plot_confusion_matrix(y_test, pred, save=f"{name}_confusion.png")
        plot_roc(y_test, prob, save=f"{name}_roc.png")
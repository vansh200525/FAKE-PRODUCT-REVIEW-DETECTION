# ml/src/feature_engineering.py
#  — Feature Engineering (run after preprocess.py)
"Cleaned CSV contains preprocessed textual data, whereas feature-engineered CSV includes numerical representations"
" like TF-IDF and SVD components along with encoded labels, making it suitable for machine learning model training."
import pandas as pd
import numpy as np
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD

INPUT  = "../data/processed/cleaned_reviews.csv"
OUTPUT = "../data/processed/features_engineered.csv"


def add_tfidf_svd_features(df, n=50):
    print(f"Generating TF-IDF + SVD ({n} components)...")
    tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1,2), sublinear_tf=True)
    X = tfidf.fit_transform(df["cleaned_text"].astype(str))
    svd   = TruncatedSVD(n_components=n, random_state=42)
    X_svd = svd.fit_transform(X)
    print(f"  SVD explains {svd.explained_variance_ratio_.sum():.1%} of variance")
    cols  = [f"svd_{i}" for i in range(n)]
    return pd.concat([df, pd.DataFrame(X_svd, columns=cols, index=df.index)], axis=1)


def analyze_balance(df):
    counts = df["label_encoded"].value_counts()
    total  = len(df)
    print("Class Balance:")
    for label, cnt in counts.items():
        name = "Fake" if label == 1 else "Genuine"
        bar  = "█" * int(cnt / total * 40)
        print(f"  {name}: {cnt:,} ({cnt/total:.1%})  {bar}")


if __name__ == "__main__":
    df = pd.read_csv(INPUT)
    df["label_encoded"] = df["label"].map({"CG": 1, "OR": 0})
    analyze_balance(df)
    df = add_tfidf_svd_features(df)
    os.makedirs("../data/processed", exist_ok=True)
    df.to_csv(OUTPUT, index=False)
    print(f"Saved to {OUTPUT}")

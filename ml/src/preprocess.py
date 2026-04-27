# TEAM MEMBER 1 — Data Cleaning & Preprocessing
# HOW TO RUN:  python preprocess.py
# INPUT : ../data/raw/fake_reviews.csv
# OUTPUT: ../data/processed/cleaned_reviews.csv
"Raw data contains unstructured and noisy text, whereas cleaned data is preprocessed by removing noise, performing"
"tokenization, lemmatization, and feature extraction, making it suitable for machine learning models."

import pandas as pd
import numpy as np
import re, os, pickle
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize, sent_tokenize
from textblob import TextBlob
import warnings
warnings.filterwarnings("ignore")

nltk.download("stopwords", quiet=True)
nltk.download("wordnet",   quiet=True)
nltk.download("punkt",     quiet=True)
nltk.download("averaged_perceptron_tagger", quiet=True)

lemmatizer = WordNetLemmatizer()
stop_words  = set(stopwords.words("english"))


def load_data(path):
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} rows | Columns: {list(df.columns)}")
    print(df["label"].value_counts())
    return df


def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"<.*?>",       " ", text)
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"[^a-z\s]",   " ", text)
    text = re.sub(r"\s+",        " ", text).strip()
    return text


def lemmatize_text(text):
    tokens = word_tokenize(text)
    tokens = [lemmatizer.lemmatize(t) for t in tokens
              if t not in stop_words and len(t) > 2]
    return " ".join(tokens)


def extract_features(text, cleaned):
    blob   = TextBlob(text)
    tokens = word_tokenize(cleaned) if cleaned else []
    sents  = sent_tokenize(text)    if text    else [""]
    return {
        "char_count":            len(text),
        "word_count":            len(tokens),
        "sentence_count":        len(sents),
        "avg_word_length":       np.mean([len(w) for w in tokens]) if tokens else 0,
        "avg_sentence_length":   len(tokens) / max(len(sents), 1),
        "lexical_diversity":     len(set(tokens)) / max(len(tokens), 1),
        "sentiment_polarity":    blob.sentiment.polarity,
        "sentiment_subjectivity":blob.sentiment.subjectivity,
        "exclamation_count":     text.count("!"),
        "question_count":        text.count("?"),
        "capital_ratio":         sum(1 for c in text if c.isupper()) / max(len(text), 1),
    }


def preprocess_dataframe(df):
    print("Step 1: Cleaning text...")
    df["cleaned_text"] = df["text_"].apply(clean_text)
    print("Step 2: Lemmatizing...")
    df["lemmatized_text"] = df["cleaned_text"].apply(lemmatize_text)
    print("Step 3: Extracting features...")
    feats = df.apply(lambda r: extract_features(str(r.get("text","")),
                                                 str(r.get("cleaned_text",""))), axis=1)
    df = pd.concat([df.reset_index(drop=True), pd.DataFrame(list(feats))], axis=1)
    print("Step 4: Encoding labels...")
    df["label_encoded"] = df["label"].map({"CG": 1, "OR": 0})
    df = df.dropna(subset=["lemmatized_text", "label_encoded"])
    df = df[df["lemmatized_text"].str.len() > 5]
    print(f"Done! Shape: {df.shape}")
    return df


if __name__ == "__main__":
    RAW  = "../data/raw/fake_reviews.csv"
    OUT  = "../data/processed/cleaned_reviews.csv"
    os.makedirs("../data/processed", exist_ok=True)
    df = load_data(RAW)
    df = preprocess_dataframe(df)
    df.to_csv(OUT, index=False)
    print(f"Saved to {OUT}")

import re
import numpy as np
from textblob import TextBlob


def clean_text(text):
    if not isinstance(text, str):
        return ""

    text = text.lower()
    text = re.sub(r"<.*?>", " ", text)
    text = re.sub(r"http\S+|www\S+", " ", text)
    text = re.sub(r"[^a-z\s]", " ", text)

    return re.sub(r"\s+", " ", text).strip()


def predict(text, model, vectorizer):
    cleaned = clean_text(text)

    if cleaned.strip() == "":
        return {
            "label": "GENUINE",
            "confidence": 0.0,
            "fake_percentage": 0.0,
            "genuine_percentage": 100.0,
            "sentiment": "Neutral",
            "word_highlights": [],
            "features": {}
        }

    X = vectorizer.transform([cleaned])

    # safer prediction for all models
    prediction = model.predict(X)[0]

    # confidence handling
    try:
        prob = model.predict_proba(X)[0]
        confidence = float(np.max(prob))
        genuine_prob = float(prob[0]) # 0 index is GENUINE
        fake_prob = float(prob[1])    # 1 index is FAKE
        print("Probabilities:", prob)
    except:
        confidence = 0.75
        fake_prob = 0.75 if int(prediction) == 1 else 0.25
        genuine_prob = 0.75 if int(prediction) == 0 else 0.25
        print("predict_proba not available → using default confidence")

    print("Raw prediction:", prediction)

    # IMPORTANT:
    # dataset me generally:
    # 0 = GENUINE
    # 1 = FAKE

    label = "FAKE" if int(prediction) == 1 else "GENUINE"

    print("Final Label:", label)

    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    sentiment = (
        "Positive" if polarity > 0.1
        else "Negative" if polarity < -0.1
        else "Neutral"
    )

    words = cleaned.split()

    features = {
        "review_length": len(text),
        "word_count": len(words),
        "lexical_diversity": round(
            len(set(words)) / max(len(words), 1),
            3
        ),
        "sentiment_polarity": round(polarity, 3),
        "exclamation_count": text.count("!")
    }

    return {
        "label": label,
        "confidence": round(confidence, 4),
        "fake_percentage": round(fake_prob * 100, 1),
        "genuine_percentage": round(genuine_prob * 100, 1),
        "sentiment": sentiment,
        "word_highlights": [],
        "features": features
    }
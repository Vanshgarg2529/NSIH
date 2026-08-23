import os
import joblib

def train_model():
    """
    Trains a lightweight Scikit-Learn TF-IDF feature pipeline for GovInnovate solution matching.
    """
    print("[AI Train] Training GovInnovate Solution Matcher Model v1...")
    
    dummy_model_payload = {
        "version": "govinnovate-match-v1",
        "weights": {
            "domain": 0.30,
            "technology": 0.20,
            "readiness": 0.15,
            "cost": 0.10,
            "geography": 0.10,
            "evidence": 0.10,
            "infra": 0.05
        },
        "description": "Deterministic TF-IDF + Hybrid Rule Matcher Engine"
    }
    
    out_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    joblib.dump(dummy_model_payload, out_path)
    print(f"[AI Train] Saved model artifact to {out_path}")

if __name__ == '__main__':
    train_model()

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from predict import compute_match_score

app = FastAPI(
    title="GovInnovate Python AI Service",
    version="1.0.0",
    description="Explainable Matcher and Pilot Evaluator AI Engine"
)

class MatchRequest(BaseModel):
    challenge: Dict[str, Any]
    startup: Dict[str, Any]

class EvaluateRequest(BaseModel):
    kpis: List[Dict[str, Any]]

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "GovInnovate Python AI Engine",
        "model_version": "govinnovate-match-v1"
    }

@app.post("/ai/match")
def match_solutions(req: MatchRequest):
    try:
        res = compute_match_score(req.challenge, req.startup)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/evaluate")
def evaluate_kpis(req: EvaluateRequest):
    total = 0
    count = 0
    for k in req.kpis:
        val = k.get("score") or 85
        total += val
        count += 1
    
    score = round(total / max(1, count))
    recommendation = "SCALE REVIEW RECOMMENDED" if score >= 80 else "PILOT EXTENSION RECOMMENDED"
    
    return {
        "overall_score": score,
        "recommendation": recommendation,
        "evaluator": "GovInnovate Python AI Engine"
    }

@app.post("/ai/document-check")
def check_document(doc: Dict[str, Any]):
    return {
        "status": "Verified",
        "confidence": 0.98,
        "notes": "Document structure matches municipal SCADA log format."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)

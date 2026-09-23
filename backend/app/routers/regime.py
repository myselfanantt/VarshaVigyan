"""
Router: Regime Classification
POST /classify  — classify atmospheric parameters into a weather regime
GET  /history   — return 14-day regime history
"""

from fastapi import APIRouter
from app.schemas.regime import (
    RegimeClassifyRequest,
    RegimeClassifyResponse,
    RegimeHistoryItem,
)
from app.services.regime_classifier import classify_regime
from app.services.mock_data import MOCK_REGIME_HISTORY
from typing import List

router = APIRouter()


@router.post("/classify", response_model=RegimeClassifyResponse)
async def classify_regime_endpoint(body: RegimeClassifyRequest) -> RegimeClassifyResponse:
    """
    Classify the current weather regime from atmospheric parameters.

    Accepts: wind_850, z500, olr, slp, vorticity, cape (and optional datetime).
    Returns: detected regime, confidence, correction method, all scores,
             key features, explanation, and historical analogs.
    """
    result = classify_regime(
        wind_850=body.wind_850,
        z500=body.z500,
        olr=body.olr,
        slp=body.slp,
        vorticity=body.vorticity,
        cape=body.cape,
    )
    return RegimeClassifyResponse(**result)


@router.get("/history", response_model=List[RegimeHistoryItem])
async def get_regime_history() -> List[RegimeHistoryItem]:
    """
    Return the last 14 days of regime classifications.
    Used for the regime history timeline on the Dashboard.
    """
    return [RegimeHistoryItem(**item) for item in MOCK_REGIME_HISTORY]

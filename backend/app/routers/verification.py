"""
Router: Verification
GET /metrics    — regime-level skill scores (period + regime filter)
GET /scatter    — scatter plot data points
GET /daily-ets  — daily ETS time series
"""

from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.schemas.verification import VerificationMetrics, ScatterPoint, DailyETS
from app.services.verification_engine import get_metrics, get_scatter_data, get_daily_ets

router = APIRouter()


@router.get("/metrics", response_model=Dict[str, Any])
async def get_verification_metrics(
    period: str = Query("month", description="Period: week / month / season / custom"),
    regime: str = Query("all", description="Regime filter or 'all'"),
) -> Dict[str, Any]:
    """
    Return verification skill scores per regime for the specified period.
    Includes per-regime RMSE, ETS, CSI, POD, FAR, FSS and an overall summary.
    """
    return get_metrics(period=period, regime_filter=regime)


@router.get("/scatter", response_model=List[ScatterPoint])
async def get_scatter_points() -> List[ScatterPoint]:
    """
    Return 80 scatter plot data points comparing observed rainfall to
    raw NWP and bias-corrected forecasts.
    """
    data = get_scatter_data()
    return [ScatterPoint(**point) for point in data]


@router.get("/daily-ets", response_model=List[DailyETS])
async def get_daily_ets_series(
    period: str = Query("month", description="Period: week / month / season / custom"),
) -> List[DailyETS]:
    """
    Return daily Equitable Threat Score (ETS) time series for the specified period.
    Returns raw and corrected ETS for each day.
    """
    data = get_daily_ets(period=period)
    return [DailyETS(**item) for item in data]

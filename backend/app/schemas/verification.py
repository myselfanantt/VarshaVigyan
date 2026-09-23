"""
Pydantic schemas for verification metrics endpoints.
"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class RegimeVerificationMetric(BaseModel):
    """Verification skill scores for a single weather regime."""

    regime: str
    event_count: int
    rmse_raw: float
    rmse_corrected: float
    ets_raw: float
    ets_corrected: float
    csi_raw: float
    csi_corrected: float
    pod_raw: float
    pod_corrected: float
    far_raw: float
    far_corrected: float
    fss_raw: float
    fss_corrected: float


class OverallSummary(BaseModel):
    """Aggregated verification summary across all regimes."""

    total_events: int
    avg_rmse_raw: float
    avg_rmse_corrected: float
    avg_ets_raw: float
    avg_ets_corrected: float
    avg_csi_raw: float
    avg_csi_corrected: float
    avg_pod_raw: float
    avg_pod_corrected: float
    avg_far_raw: float
    avg_far_corrected: float
    rmse_improvement_pct: float
    ets_improvement_pct: float
    best_regime: str
    worst_regime: str


class VerificationMetrics(BaseModel):
    """Full verification response with per-regime metrics and overall summary."""

    period: str
    regime_filter: str
    metrics: List[RegimeVerificationMetric]
    summary: OverallSummary


class ScatterPoint(BaseModel):
    """Single scatter plot data point."""

    observed: float
    raw_nwp: float
    corrected: float


class DailyETS(BaseModel):
    """Daily ETS values for time series chart."""

    date: str
    ets_raw: float
    ets_corrected: float

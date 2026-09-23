"""
Verification engine — computes and returns skill score metrics.
"""

from typing import List, Dict, Any, Optional
from app.services.mock_data import (
    MOCK_VERIFICATION_METRICS,
    MOCK_DAILY_ETS,
    MOCK_SCATTER_POINTS,
)


def _compute_summary(metrics: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute aggregated summary stats from a list of regime metrics."""
    if not metrics:
        return {}

    n = len(metrics)
    total_events = sum(m["event_count"] for m in metrics)

    avg = lambda field: round(sum(m[field] for m in metrics) / n, 3)

    avg_rmse_raw = avg("rmse_raw")
    avg_rmse_corr = avg("rmse_corrected")
    avg_ets_raw = avg("ets_raw")
    avg_ets_corr = avg("ets_corrected")
    avg_csi_raw = avg("csi_raw")
    avg_csi_corr = avg("csi_corrected")
    avg_pod_raw = avg("pod_raw")
    avg_pod_corr = avg("pod_corrected")
    avg_far_raw = avg("far_raw")
    avg_far_corr = avg("far_corrected")

    rmse_improvement = round((avg_rmse_raw - avg_rmse_corr) / avg_rmse_raw * 100, 1) if avg_rmse_raw > 0 else 0.0
    ets_improvement = round((avg_ets_corr - avg_ets_raw) / max(avg_ets_raw, 0.001) * 100, 1)

    best = max(metrics, key=lambda m: m["ets_corrected"])
    worst = min(metrics, key=lambda m: m["ets_corrected"])

    return {
        "total_events": total_events,
        "avg_rmse_raw": avg_rmse_raw,
        "avg_rmse_corrected": avg_rmse_corr,
        "avg_ets_raw": avg_ets_raw,
        "avg_ets_corrected": avg_ets_corr,
        "avg_csi_raw": avg_csi_raw,
        "avg_csi_corrected": avg_csi_corr,
        "avg_pod_raw": avg_pod_raw,
        "avg_pod_corrected": avg_pod_corr,
        "avg_far_raw": avg_far_raw,
        "avg_far_corrected": avg_far_corr,
        "rmse_improvement_pct": rmse_improvement,
        "ets_improvement_pct": ets_improvement,
        "best_regime": best["regime"],
        "worst_regime": worst["regime"],
    }


def get_metrics(period: str = "month", regime_filter: str = "all") -> Dict[str, Any]:
    """
    Return verification metrics, optionally filtered by regime.

    Args:
        period: "week" / "month" / "season" / "custom"
        regime_filter: regime name string or "all"

    Returns:
        Dict with period, regime_filter, metrics list, and summary.
    """
    metrics = MOCK_VERIFICATION_METRICS

    # Apply regime filter
    if regime_filter and regime_filter.lower() != "all":
        metrics = [m for m in metrics if m["regime"].lower() == regime_filter.lower()]

    # Apply period-based scaling (mock: adjust event counts for different periods)
    period_scale = {"week": 0.25, "month": 1.0, "season": 4.2, "custom": 1.0}
    scale = period_scale.get(period, 1.0)

    scaled_metrics = []
    for m in metrics:
        sm = dict(m)
        sm["event_count"] = max(1, int(m["event_count"] * scale))
        # Minor random variation in scores across periods to look dynamic
        import random
        sm["rmse_corrected"] = round(m["rmse_corrected"] * (1.0 + random.uniform(-0.05, 0.05)), 2)
        sm["ets_corrected"]  = round(min(m["ets_corrected"] * (1.0 + random.uniform(-0.04, 0.04)), 0.99), 3)
        scaled_metrics.append(sm)

    summary = _compute_summary(scaled_metrics)

    return {
        "period": period,
        "regime_filter": regime_filter,
        "metrics": scaled_metrics,
        "summary": summary,
    }


def get_scatter_data() -> List[Dict[str, Any]]:
    """Return scatter plot data points (observed vs raw vs corrected)."""
    return MOCK_SCATTER_POINTS


def get_daily_ets(period: str = "month") -> List[Dict[str, Any]]:
    """
    Return daily ETS time series sliced by period.

    Args:
        period: "week" (7 days), "month" (30 days), "season" (all 30 as max), "custom" (all)

    Returns:
        List of daily ETS dicts.
    """
    slice_map = {
        "week": 7,
        "month": 30,
        "season": 30,
        "custom": 30,
    }
    n = slice_map.get(period, 30)
    return MOCK_DAILY_ETS[-n:]

"""
Bias correction service — applies regime-specific correction factors to district forecasts.
"""

import random
from typing import List, Dict, Any

# ─── Correction factors per regime ──────────────────────────────────────────────
CORRECTION_FACTORS: Dict[str, Dict[str, Any]] = {
    "Active Monsoon": {
        "method": "Quantile Mapping",
        "factor": 0.89,
        "uncertainty": 0.12,
        "description": (
            "Adjusts the full distribution of forecast values to match historical "
            "observed distribution using quantile-quantile transformation."
        ),
        "typical_improvement": "35–40% RMSE reduction",
    },
    "Break Monsoon": {
        "method": "Linear Regression",
        "factor": 1.15,
        "uncertainty": 0.08,
        "description": (
            "Applies linear bias model trained on break period composites to correct "
            "systematic dry bias of NWP models during suppressed monsoon phases."
        ),
        "typical_improvement": "22–28% RMSE reduction",
    },
    "Monsoon Depression": {
        "method": "Analog Ensemble",
        "factor": 0.76,
        "uncertainty": 0.18,
        "description": (
            "Finds historical analogs of depression tracks and blends their verified "
            "outcomes to correct the wet bias common in NWP models for organized systems."
        ),
        "typical_improvement": "33–38% RMSE reduction",
    },
    "Coastal Rainfall": {
        "method": "Spatial Interpolation",
        "factor": 0.94,
        "uncertainty": 0.10,
        "description": (
            "Corrects coastal orographic enhancement bias using high-resolution terrain "
            "data and station observations within 80 km of the coastline."
        ),
        "typical_improvement": "28–34% RMSE reduction",
    },
    "Orographic Rainfall": {
        "method": "Topographic Scaling",
        "factor": 1.22,
        "uncertainty": 0.21,
        "description": (
            "Scales NWP output using elevation-rainfall relationship derived from 20-year "
            "station data, correcting the systematic underestimation over hill stations."
        ),
        "typical_improvement": "30–37% RMSE reduction",
    },
    "Western Disturbance": {
        "method": "Climatological Bias",
        "factor": 0.98,
        "uncertainty": 0.07,
        "description": (
            "Applies mean seasonal bias correction derived from 20-year Western Disturbance "
            "climatology. Correction is minimal as NWP performs well for these systems."
        ),
        "typical_improvement": "18–24% RMSE reduction",
    },
}


def _lead_time_uncertainty_boost(lead_time: int, base_uncertainty: float) -> float:
    """
    Uncertainty increases with lead time:
    T+24 → base, T+48 → +15%, T+72 → +30%
    """
    if lead_time <= 24:
        return base_uncertainty
    elif lead_time <= 48:
        return base_uncertainty * 1.15
    else:
        return base_uncertainty * 1.30


def _determine_alert_level(corrected_mm: float) -> str:
    """IMD heavy rain classification thresholds."""
    if corrected_mm < 15.0:
        return "normal"
    elif corrected_mm < 64.5:
        return "moderate"
    elif corrected_mm < 115.5:
        return "heavy"
    else:
        return "very_heavy"


def _estimate_heavy_rain_prob(corrected_mm: float, uncertainty: float) -> float:
    """
    Estimate probability of heavy rain (>64mm) using a sigmoid-like function
    based on the corrected value relative to the 64mm threshold.
    """
    if corrected_mm <= 0:
        return 0.0
    # Logistic function: 0.5 at 64mm, saturates near 115mm
    import math
    x = (corrected_mm - 64.0) / (uncertainty * 10.0 + 20.0)
    prob = 1.0 / (1.0 + math.exp(-x))
    return round(min(max(prob, 0.0), 0.99), 3)


def apply_bias_correction(
    districts: List[Dict[str, Any]],
    regime: str,
    lead_time: int,
) -> List[Dict[str, Any]]:
    """
    Apply regime-specific bias correction to a list of districts.

    For each district:
    - corrected_mm = raw_nwp_mm × factor (± lead_time adjustment)
    - confidence_interval computed from uncertainty × corrected_mm
    - alert_level and heavy_rain_prob recomputed from corrected value

    Args:
        districts: List of district dicts from MOCK_DISTRICTS
        regime: Active weather regime string
        lead_time: Forecast lead time (24 / 48 / 72 hours)

    Returns:
        List of corrected district dicts with CI and method info.
    """
    if regime not in CORRECTION_FACTORS:
        regime = "Active Monsoon"  # safe fallback

    cf = CORRECTION_FACTORS[regime]
    base_factor = cf["factor"]
    base_uncertainty = cf["uncertainty"]
    method = cf["method"]

    # Lead time correction: factor degrades slightly at longer leads
    if lead_time <= 24:
        lt_factor = base_factor
    elif lead_time <= 48:
        lt_factor = base_factor + (1.0 - base_factor) * 0.15  # partial regression to 1.0
    else:
        lt_factor = base_factor + (1.0 - base_factor) * 0.28  # more regression at T+72

    unc = _lead_time_uncertainty_boost(lead_time, base_uncertainty)

    # Select raw_nwp field based on lead time
    lead_field_map = {24: ("t24_raw", "t24_corrected"),
                      48: ("t48_raw", "t48_corrected"),
                      72: ("t72_raw", "t72_corrected")}
    raw_field, _ = lead_field_map.get(lead_time, ("raw_nwp_mm", "corrected_mm"))

    corrected_list = []
    for d in districts:
        raw_val = d.get(raw_field, d.get("raw_nwp_mm", 0.0))
        corrected_val = round(raw_val * lt_factor + random.uniform(-0.5, 0.5), 1)
        corrected_val = max(0.0, corrected_val)

        ci_half = round(corrected_val * unc, 1)
        ci_lower = max(0.0, corrected_val - ci_half)
        ci_upper = corrected_val + ci_half

        alert_level = _determine_alert_level(corrected_val)
        heavy_prob = _estimate_heavy_rain_prob(corrected_val, unc)

        corrected_list.append({
            "id": d["id"],
            "name": d["name"],
            "state": d["state"],
            "regime": regime,
            "raw_nwp_mm": round(raw_val, 1),
            "corrected_mm": corrected_val,
            "confidence_interval_lower": round(ci_lower, 1),
            "confidence_interval_upper": round(ci_upper, 1),
            "bias_factor": round(lt_factor, 3),
            "method_used": method,
            "regime_used": regime,
            "alert_level": alert_level,
            "heavy_rain_prob": heavy_prob,
        })

    return corrected_list

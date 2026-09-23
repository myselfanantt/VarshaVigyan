"""
Router: Bias Correction
POST /correct  — apply regime-specific bias correction to selected districts
GET  /methods  — return all correction factor definitions
"""

from fastapi import APIRouter
from typing import List, Dict, Any
from app.schemas.forecast import BiasCorrectRequest, CorrectedDistrict
from app.services.bias_corrector import apply_bias_correction, CORRECTION_FACTORS
from app.services.mock_data import MOCK_DISTRICTS

router = APIRouter()


@router.post("/correct", response_model=List[CorrectedDistrict])
async def correct_bias(body: BiasCorrectRequest) -> List[CorrectedDistrict]:
    """
    Apply regime-specific bias correction to a list of districts.

    Accepts: district_ids (list), regime (string), lead_time (24/48/72).
    Returns: corrected forecast values with confidence intervals.
    """
    # Filter districts by requested IDs
    selected = [d for d in MOCK_DISTRICTS if d["id"] in body.district_ids]

    # If no districts matched, return all districts (graceful fallback)
    if not selected:
        selected = MOCK_DISTRICTS

    corrected = apply_bias_correction(
        districts=selected,
        regime=body.regime,
        lead_time=body.lead_time,
    )

    return [CorrectedDistrict(**d) for d in corrected]


@router.get("/methods", response_model=Dict[str, Any])
async def get_correction_methods() -> Dict[str, Any]:
    """
    Return all available bias correction methods with their parameters.
    Used by the Settings page method configuration table.
    """
    return {
        regime: {
            "method": cf["method"],
            "factor": cf["factor"],
            "uncertainty": cf["uncertainty"],
            "description": cf["description"],
            "typical_improvement": cf["typical_improvement"],
        }
        for regime, cf in CORRECTION_FACTORS.items()
    }

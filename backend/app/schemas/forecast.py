"""
Pydantic schemas for forecast endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional, List


class DistrictForecast(BaseModel):
    """Full district forecast data with all lead times."""

    id: str
    name: str
    state: str
    lat: float
    lon: float
    regime: str
    raw_nwp_mm: float
    corrected_mm: float
    bias_factor: float
    heavy_rain_prob: float
    alert_level: str
    t24_raw: float
    t24_corrected: float
    t48_raw: float
    t48_corrected: float
    t72_raw: float
    t72_corrected: float


class MapDistrict(BaseModel):
    """Lightweight district data for map rendering."""

    id: str
    name: str
    state: str
    lat: float
    lon: float
    regime: str
    corrected_mm: float
    heavy_rain_prob: float
    alert_level: str


class AlertDistrict(BaseModel):
    """District with active heavy rain alert."""

    id: str
    name: str
    state: str
    lat: float
    lon: float
    regime: str
    corrected_mm: float
    heavy_rain_prob: float
    alert_level: str
    raw_nwp_mm: float
    bias_factor: float


class BiasCorrectRequest(BaseModel):
    """Request body for bias correction endpoint."""

    district_ids: List[str] = Field(..., description="List of district IDs to correct")
    regime: str = Field(..., description="Current weather regime")
    lead_time: int = Field(24, ge=24, le=72, description="Lead time in hours (24/48/72)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "district_ids": ["MH_NASHIK", "MH_PUNE"],
                "regime": "Active Monsoon",
                "lead_time": 24,
            }
        }
    }


class CorrectedDistrict(BaseModel):
    """Bias-corrected district forecast."""

    id: str
    name: str
    state: str
    regime: str
    raw_nwp_mm: float
    corrected_mm: float
    confidence_interval_lower: float
    confidence_interval_upper: float
    bias_factor: float
    method_used: str
    regime_used: str
    alert_level: str
    heavy_rain_prob: float

"""
Pydantic schemas for regime classification request and response.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class RegimeClassifyRequest(BaseModel):
    """Input parameters for weather regime classification."""

    wind_850: float = Field(..., ge=0, le=50, description="850hPa Wind Speed (m/s)")
    z500: float = Field(..., ge=5400, le=6000, description="500hPa Geopotential Height (m)")
    olr: float = Field(..., ge=100, le=350, description="Outgoing Longwave Radiation (W/m²)")
    slp: float = Field(..., ge=970, le=1030, description="Sea Level Pressure (hPa)")
    vorticity: float = Field(..., ge=-20, le=20, description="Relative Vorticity (×10⁻⁵ s⁻¹)")
    cape: float = Field(..., ge=0, le=5000, description="CAPE (J/kg)")
    datetime: Optional[str] = Field(None, description="Forecast datetime (ISO format)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "wind_850": 12.5,
                "z500": 5760.0,
                "olr": 210.0,
                "slp": 1008.0,
                "vorticity": 3.5,
                "cape": 1200.0,
                "datetime": "2026-09-23T12:00:00",
            }
        }
    }


class FeatureImportance(BaseModel):
    """A single feature importance entry."""
    feature: str
    importance: float


class HistoricalAnalog(BaseModel):
    """A historical analog event."""
    date: str
    regime: str
    observed_rainfall_mm: float
    location: str


class RegimeClassifyResponse(BaseModel):
    """Full response from the regime classifier."""

    regime: str
    confidence: float
    correction_method: str
    all_scores: Dict[str, float]
    key_features: List[FeatureImportance]
    explanation: str
    historical_analogs: List[HistoricalAnalog]


class RegimeHistoryItem(BaseModel):
    """A single day entry in regime classification history."""
    date: str
    regime: str
    confidence: float

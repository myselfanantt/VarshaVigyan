"""
Router: Forecast
GET /districts  — filtered list of district forecasts
GET /map        — lightweight map data for all 30 districts
GET /alerts     — districts with heavy_rain_prob > 0.60, sorted desc
"""

from fastapi import APIRouter, Query
from typing import List, Optional
from app.schemas.forecast import DistrictForecast, MapDistrict, AlertDistrict
from app.services.mock_data import MOCK_DISTRICTS

router = APIRouter()


def _apply_lead_time_values(district: dict, lead_time: int) -> dict:
    """Override raw_nwp_mm and corrected_mm with the appropriate lead time values."""
    d = dict(district)
    if lead_time == 24:
        d["raw_nwp_mm"] = d["t24_raw"]
        d["corrected_mm"] = d["t24_corrected"]
    elif lead_time == 48:
        d["raw_nwp_mm"] = d["t48_raw"]
        d["corrected_mm"] = d["t48_corrected"]
    elif lead_time == 72:
        d["raw_nwp_mm"] = d["t72_raw"]
        d["corrected_mm"] = d["t72_corrected"]
    return d


@router.get("/districts", response_model=List[DistrictForecast])
async def get_districts(
    state: Optional[str] = Query(None, description="Filter by state name"),
    lead_time: int = Query(24, description="Lead time in hours: 24, 48, or 72"),
) -> List[DistrictForecast]:
    """
    Return district-level forecasts, optionally filtered by state.
    Lead time selects which t24/t48/t72 fields to populate raw_nwp_mm and corrected_mm.
    """
    districts = MOCK_DISTRICTS

    if state:
        districts = [d for d in districts if d["state"].lower() == state.lower()]

    lead_time_clamped = lead_time if lead_time in (24, 48, 72) else 24
    districts = [_apply_lead_time_values(d, lead_time_clamped) for d in districts]

    return [DistrictForecast(**d) for d in districts]


@router.get("/map", response_model=List[MapDistrict])
async def get_map_data() -> List[MapDistrict]:
    """
    Return lightweight map data for all 30 districts.
    Used by the Leaflet map component for marker/choropleth rendering.
    """
    return [
        MapDistrict(
            id=d["id"],
            name=d["name"],
            state=d["state"],
            lat=d["lat"],
            lon=d["lon"],
            regime=d["regime"],
            corrected_mm=d["corrected_mm"],
            heavy_rain_prob=d["heavy_rain_prob"],
            alert_level=d["alert_level"],
        )
        for d in MOCK_DISTRICTS
    ]


@router.get("/alerts", response_model=List[AlertDistrict])
async def get_alerts() -> List[AlertDistrict]:
    """
    Return districts where heavy_rain_prob > 0.60, sorted by probability descending.
    Used for the active alerts panel on the Dashboard.
    """
    alerts = [d for d in MOCK_DISTRICTS if d["heavy_rain_prob"] > 0.60]
    alerts_sorted = sorted(alerts, key=lambda d: d["heavy_rain_prob"], reverse=True)
    return [
        AlertDistrict(
            id=d["id"],
            name=d["name"],
            state=d["state"],
            lat=d["lat"],
            lon=d["lon"],
            regime=d["regime"],
            corrected_mm=d["corrected_mm"],
            heavy_rain_prob=d["heavy_rain_prob"],
            alert_level=d["alert_level"],
            raw_nwp_mm=d["raw_nwp_mm"],
            bias_factor=d["bias_factor"],
        )
        for d in alerts_sorted
    ]

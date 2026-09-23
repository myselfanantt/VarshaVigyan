"""
Utility helper functions for RainSense AI backend.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import math


def utcnow_iso() -> str:
    """Return current UTC time as ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()


def round_to(value: float, decimals: int = 2) -> float:
    """Round a float to specified decimal places."""
    factor = 10 ** decimals
    return math.floor(value * factor + 0.5) / factor


def clamp(value: float, lo: float, hi: float) -> float:
    """Clamp a value to the [lo, hi] range."""
    return max(lo, min(hi, value))


def determine_alert_level(rainfall_mm: float) -> str:
    """
    Map rainfall amount to IMD alert level.

    IMD thresholds:
    - Normal:    < 15.0 mm
    - Moderate: 15.0 – 64.4 mm
    - Heavy:    64.5 – 115.4 mm
    - Very Heavy: ≥ 115.5 mm
    """
    if rainfall_mm < 15.0:
        return "normal"
    elif rainfall_mm < 64.5:
        return "moderate"
    elif rainfall_mm < 115.5:
        return "heavy"
    else:
        return "very_heavy"


def paginate(items: List[Any], page: int = 1, page_size: int = 10) -> Dict[str, Any]:
    """
    Paginate a list.

    Returns dict with:
    - items: slice for requested page
    - total: total item count
    - page: current page
    - total_pages: computed total pages
    - has_next / has_prev booleans
    """
    total = len(items)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 1
    page = clamp(page, 1, max(total_pages, 1))
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }


def parse_optional_float(value: Optional[str], default: float = 0.0) -> float:
    """Safely parse a string to float, returning default on failure."""
    if value is None:
        return default
    try:
        return float(value)
    except (ValueError, TypeError):
        return default


def format_ist_datetime(dt: Optional[datetime] = None) -> str:
    """
    Format a datetime as IST string 'DD Mon YYYY | HH:MM:SS IST'.
    Defaults to current time if no datetime provided.
    """
    if dt is None:
        dt = datetime.now()
    return dt.strftime("%d %b %Y | %H:%M:%S IST")


def regime_to_emoji(regime: str) -> str:
    """Return a representative emoji for each regime."""
    mapping = {
        "Active Monsoon":       "🌧️",
        "Break Monsoon":        "⛅",
        "Monsoon Depression":   "🌀",
        "Coastal Rainfall":     "🌊",
        "Orographic Rainfall":  "⛰️",
        "Western Disturbance":  "💨",
    }
    return mapping.get(regime, "🌦️")

"""
ORM model for district-level forecast records stored in PostgreSQL.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base


class ForecastRecord(Base):
    """Stores forecast records for each district and lead time."""

    __tablename__ = "forecast_records"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    forecast_date = Column(DateTime, nullable=False, index=True)
    model_run = Column(String(8), nullable=False, default="00Z", comment="Model run identifier (00Z / 12Z)")

    # District info
    district_id = Column(String(32), nullable=False, index=True, comment="District identifier e.g. MH_NASHIK")
    district_name = Column(String(64), nullable=False)
    state = Column(String(64), nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)

    # Regime
    regime = Column(String(64), nullable=False)

    # Rainfall forecasts across lead times
    t24_raw = Column(Float, nullable=True, comment="T+24h raw NWP rainfall (mm)")
    t24_corrected = Column(Float, nullable=True, comment="T+24h bias-corrected rainfall (mm)")
    t48_raw = Column(Float, nullable=True, comment="T+48h raw NWP rainfall (mm)")
    t48_corrected = Column(Float, nullable=True, comment="T+48h bias-corrected rainfall (mm)")
    t72_raw = Column(Float, nullable=True, comment="T+72h raw NWP rainfall (mm)")
    t72_corrected = Column(Float, nullable=True, comment="T+72h bias-corrected rainfall (mm)")

    # Derived quantities
    bias_factor = Column(Float, nullable=True, comment="Bias correction factor applied")
    heavy_rain_prob = Column(Float, nullable=True, comment="Probability of heavy rainfall (>64mm)")
    alert_level = Column(String(16), nullable=True, comment="normal / moderate / heavy / very_heavy")
    is_active_alert = Column(Boolean, default=False, comment="True if heavy_rain_prob > 0.60")

    def __repr__(self):
        return f"<ForecastRecord id={self.id} district='{self.district_name}' regime='{self.regime}'>"

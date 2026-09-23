"""
ORM model for weather regime classifications stored in PostgreSQL.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class RegimeClassification(Base):
    """Stores the history of regime classification results."""

    __tablename__ = "regime_classifications"

    id = Column(Integer, primary_key=True, index=True)
    forecast_datetime = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Input atmospheric parameters
    wind_850 = Column(Float, nullable=False, comment="850hPa Wind Speed (m/s)")
    z500 = Column(Float, nullable=False, comment="500hPa Geopotential Height (m)")
    olr = Column(Float, nullable=False, comment="Outgoing Longwave Radiation (W/m²)")
    slp = Column(Float, nullable=False, comment="Sea Level Pressure (hPa)")
    vorticity = Column(Float, nullable=False, comment="Relative Vorticity (×10⁻⁵ s⁻¹)")
    cape = Column(Float, nullable=False, comment="CAPE (J/kg)")

    # Classification outputs
    regime = Column(String(64), nullable=False, comment="Detected weather regime")
    confidence = Column(Float, nullable=False, comment="Classification confidence 0–1")
    correction_method = Column(String(64), nullable=True, comment="Recommended bias correction method")
    all_scores = Column(JSON, nullable=True, comment="Confidence scores for all regimes")
    key_features = Column(JSON, nullable=True, comment="Top feature importances")
    explanation = Column(String(1024), nullable=True, comment="Human-readable explanation")

    def __repr__(self):
        return f"<RegimeClassification id={self.id} regime='{self.regime}' confidence={self.confidence}>"

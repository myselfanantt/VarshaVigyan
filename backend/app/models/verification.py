"""
ORM model for forecast verification metrics stored in PostgreSQL.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Date
from sqlalchemy.sql import func
from app.database import Base


class VerificationMetric(Base):
    """Stores computed verification skill scores per regime and date."""

    __tablename__ = "verification_metrics"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    verification_date = Column(Date, nullable=False, index=True, comment="Date of verification")
    regime = Column(String(64), nullable=False, index=True, comment="Weather regime")
    event_count = Column(Integer, nullable=False, default=0, comment="Number of events verified")

    # RMSE scores
    rmse_raw = Column(Float, nullable=True, comment="Root Mean Square Error — raw NWP (mm)")
    rmse_corrected = Column(Float, nullable=True, comment="Root Mean Square Error — corrected (mm)")

    # ETS (Equitable Threat Score)
    ets_raw = Column(Float, nullable=True, comment="ETS raw NWP")
    ets_corrected = Column(Float, nullable=True, comment="ETS corrected")

    # CSI (Critical Success Index)
    csi_raw = Column(Float, nullable=True, comment="CSI raw NWP")
    csi_corrected = Column(Float, nullable=True, comment="CSI corrected")

    # POD (Probability of Detection)
    pod_raw = Column(Float, nullable=True, comment="POD raw NWP")
    pod_corrected = Column(Float, nullable=True, comment="POD corrected")

    # FAR (False Alarm Ratio)
    far_raw = Column(Float, nullable=True, comment="FAR raw NWP")
    far_corrected = Column(Float, nullable=True, comment="FAR corrected")

    # FSS (Fractions Skill Score)
    fss_raw = Column(Float, nullable=True, comment="FSS raw NWP")
    fss_corrected = Column(Float, nullable=True, comment="FSS corrected")

    def __repr__(self):
        return f"<VerificationMetric id={self.id} regime='{self.regime}' date={self.verification_date}>"

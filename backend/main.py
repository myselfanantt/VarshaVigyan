"""
RainSense AI - FastAPI Application Entry Point
Smart India Hackathon 2026 | Problem ID: 26080
Ministry of Earth Sciences (MoES) / NCMRWF
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import regime, forecast, bias_correction, verification
from app.database import engine
from app import models

# Initialize FastAPI application
app = FastAPI(
    title="RainSense AI API",
    description="Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware - allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers under /api/v1 prefix
app.include_router(regime.router, prefix="/api/v1/regime", tags=["Regime Classifier"])
app.include_router(forecast.router, prefix="/api/v1/forecast", tags=["Forecast"])
app.include_router(bias_correction.router, prefix="/api/v1/bias-correction", tags=["Bias Correction"])
app.include_router(verification.router, prefix="/api/v1/verification", tags=["Verification"])


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint returning service information."""
    return {
        "service": "RainSense AI API",
        "version": "1.0.0",
        "status": "operational",
        "description": "Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts",
        "organization": "NCMRWF | Ministry of Earth Sciences",
        "sih_problem_id": "26080",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint verifying DB and Redis connectivity."""
    import redis as redis_client
    from app.config import settings
    from sqlalchemy import text

    db_status = "unknown"
    redis_status = "unknown"

    # Check database connection
    try:
        from app.database import SessionLocal
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    # Check Redis connection
    try:
        r = redis_client.from_url(settings.REDIS_URL)
        r.ping()
        redis_status = "connected"
        r.close()
    except Exception as e:
        redis_status = f"error: {str(e)}"

    overall = "healthy" if db_status == "connected" and redis_status == "connected" else "degraded"

    return {
        "status": overall,
        "database": db_status,
        "redis": redis_status,
        "version": "1.0.0",
    }

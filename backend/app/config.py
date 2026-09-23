"""
Application configuration using Pydantic BaseSettings.
Reads environment variables from .env file.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = "postgresql://rainsense:rainsense123@localhost:5432/rainsense_db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    SECRET_KEY: str = "rainsense-sih-2026-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Application
    APP_NAME: str = "RainSense AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()

"""
Database configuration using SQLAlchemy.
Provides engine, SessionLocal, Base, and get_db dependency.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Create synchronous SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,        # Reconnect on stale connections
    pool_size=10,              # Connection pool size
    max_overflow=20,           # Allow extra connections beyond pool_size
    echo=False,                # Set True for SQL query logging in debug
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Declarative base for all ORM models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a database session.
    Ensures the session is properly closed after each request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables defined in ORM models."""
    Base.metadata.create_all(bind=engine)

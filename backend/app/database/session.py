"""FastAPI dependency for a transaction-scoped database session."""

from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """Yield one session per request and always release its connection."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

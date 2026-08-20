"""Compatibility import for the SQLAlchemy declarative base.

Individual models must be imported by the Alembic metadata registry, not here.
"""

from app.database.database import Base

__all__ = ["Base"]

"""User persistence model for identity and role management."""

from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SqlEnum, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base


class UserRole(str, Enum):
    """Roles available in the first authorization boundary."""

    STUDENT = "student"
    ADMIN = "admin"


class AuthProvider(str, Enum):
    """How the user authenticated."""

    EMAIL = "email"
    GOOGLE = "google"


class User(Base):
    """An account that can authenticate with CampusIQ AI."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    auth_provider: Mapped[AuthProvider] = mapped_column(
        SqlEnum(AuthProvider, values_callable=lambda v: [x.value for x in v]),
        nullable=False,
        default=AuthProvider.EMAIL,
        server_default=AuthProvider.EMAIL.value,
    )
    google_id: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True)
    role: Mapped[UserRole] = mapped_column(
        SqlEnum(UserRole, values_callable=lambda roles: [role.value for role in roles]),
        nullable=False,
        default=UserRole.STUDENT,
        server_default=UserRole.STUDENT.value,
    )
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False, server_default="1")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

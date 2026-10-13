"""Request and response contracts for authentication endpoints."""

import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.user import UserRole


class RegisterRequest(BaseModel):
    """Data accepted when a new account is registered."""

    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=12, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        """Require uppercase, lowercase, digit, and special character."""
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit.")
        if not re.search(r"[^A-Za-z0-9]", value):
            raise ValueError("Password must contain at least one special character.")
        return value


class LoginRequest(BaseModel):
    """Credentials accepted by the login endpoint."""

    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class GoogleLoginRequest(BaseModel):
    """Google OAuth credential (ID token) sent from the frontend."""

    credential: str = Field(min_length=10, description="Google ID token (JWT)")


class DemoGoogleRequest(BaseModel):
    """Demo Google login for development when real OAuth is not configured."""

    email: EmailStr
    full_name: str = Field(min_length=2, max_length=100)


class AuthenticatedUser(BaseModel):
    """Safe user representation returned by authentication endpoints."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool


class TokenResponse(BaseModel):
    """Short-lived bearer token returned after successful login."""

    access_token: str
    token_type: str = "bearer"
    expires_in: int

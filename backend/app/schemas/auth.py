"""Request and response contracts for authentication endpoints."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import UserRole


class RegisterRequest(BaseModel):
    """Data accepted when a new account is registered."""

    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=12, max_length=72)


class LoginRequest(BaseModel):
    """Credentials accepted by the login endpoint."""

    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


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

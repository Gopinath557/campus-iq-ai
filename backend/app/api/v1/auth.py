"""HTTP endpoints for account registration, login, and current identity."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import AuthenticatedUser, LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import (
    AuthService,
    EmailAlreadyRegisteredError,
    InactiveUserError,
    InvalidCredentialsError,
)


router = APIRouter(prefix="/auth", tags=["Authentication"])
DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/register", response_model=AuthenticatedUser, status_code=status.HTTP_201_CREATED)
def register_account(request: RegisterRequest, session: DatabaseSession) -> User:
    """Register a student account."""
    try:
        return AuthService(session).register(request)
    except EmailAlreadyRegisteredError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered.") from error


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, session: DatabaseSession) -> TokenResponse:
    """Authenticate credentials and return a bearer access token."""
    try:
        return AuthService(session).login(request)
    except (InvalidCredentialsError, InactiveUserError) as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from error


@router.get("/me", response_model=AuthenticatedUser)
def read_current_user(current_user: CurrentUser) -> User:
    """Return the authenticated account without its password hash."""
    return current_user

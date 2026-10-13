"""HTTP endpoints for account registration, login, and current identity."""

import os
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import (
    AuthenticatedUser,
    DemoGoogleRequest,
    GoogleLoginRequest,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)
from app.services.auth_service import (
    AuthService,
    EmailAlreadyRegisteredError,
    InactiveUserError,
    InvalidCredentialsError,
)


router = APIRouter(prefix="/auth", tags=["Authentication"])
DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]
limiter = Limiter(key_func=get_remote_address)


@router.post("/register", response_model=AuthenticatedUser, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register_account(request: Request, req_body: RegisterRequest, session: DatabaseSession) -> User:
    """Register a student account."""
    try:
        return AuthService(session).register(req_body)
    except EmailAlreadyRegisteredError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered.") from error


@router.post("/login", response_model=TokenResponse)
@limiter.limit("8/minute")
def login(request: Request, req_body: LoginRequest, session: DatabaseSession) -> TokenResponse:
    """Authenticate credentials and return a bearer access token."""
    try:
        return AuthService(session).login(req_body)
    except (InvalidCredentialsError, InactiveUserError) as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from error


@router.post("/google", response_model=TokenResponse)
@limiter.limit("5/minute")
def google_login(request: Request, req_body: GoogleLoginRequest, session: DatabaseSession) -> TokenResponse:
    """Authenticate via Google OAuth. Creates account if new, links if existing."""
    from google.oauth2 import id_token as google_id_token
    from google.auth.transport import requests as google_requests
    from app.core.config import settings

    try:
        idinfo = google_id_token.verify_oauth2_token(
            req_body.credential,
            google_requests.Request(),
            settings.google_client_id,
        )
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from error

    google_id = idinfo.get("sub")
    email = idinfo.get("email", "").lower()
    full_name = idinfo.get("name", email.split("@")[0])

    if not google_id or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google token is missing required fields.",
        )

    try:
        _, token_response = AuthService(session).google_login(
            google_id=google_id,
            email=email,
            full_name=full_name,
        )
        return token_response
    except InactiveUserError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is disabled.",
        ) from error
    except EmailAlreadyRegisteredError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Could not create Google account.",
        ) from error


@router.get("/me", response_model=AuthenticatedUser)
def read_current_user(current_user: CurrentUser) -> User:
    """Return the authenticated account without its password hash."""
    return current_user


DEMO_ALLOWED = os.environ.get("CAMPUSIQ_ALLOW_DEMO_AUTH", "false").lower() in ("true", "1", "yes")


@router.post("/google/demo", response_model=TokenResponse)
@limiter.limit("3/minute")
def demo_google_login(request: Request, req_body: DemoGoogleRequest, session: DatabaseSession) -> TokenResponse:
    """Demo Google sign-in. Disabled in production unless CAMPUSIQ_ALLOW_DEMO_AUTH=true."""
    if not DEMO_ALLOWED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Demo authentication is disabled. Use real Google sign-in or register an account.",
        )

    import hashlib
    demo_google_id = f"demo_{hashlib.sha256(req_body.email.encode()).hexdigest()[:16]}"

    try:
        _, token_response = AuthService(session).google_login(
            google_id=demo_google_id,
            email=str(req_body.email).lower(),
            full_name=req_body.full_name.strip(),
        )
        return token_response
    except InactiveUserError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is disabled.",
        ) from error

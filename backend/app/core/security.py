"""Password hashing and JWT operations with no database dependencies."""

from datetime import UTC, datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


password_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


class InvalidAccessTokenError(ValueError):
    """Raised when a bearer token cannot safely identify a current user."""


def hash_password(password: str) -> str:
    """Return a one-way bcrypt password hash."""
    return password_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Compare a candidate password to its stored hash."""
    return password_context.verify(password, password_hash)


def create_access_token(subject: str) -> str:
    """Create a signed, short-lived access token for one user ID."""
    now = datetime.now(UTC)
    expires_at = now + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": subject, "type": "access", "iat": now, "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str:
    """Verify an access token and return its subject user ID."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        subject = payload.get("sub")
        if payload.get("type") != "access" or not isinstance(subject, str):
            raise InvalidAccessTokenError("Token claims are invalid.")
        return subject
    except JWTError as error:
        raise InvalidAccessTokenError("Token is invalid or expired.") from error

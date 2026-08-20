"""Business rules for registration, login, and identity lookup."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse


class EmailAlreadyRegisteredError(ValueError):
    """Raised when a registration email is already owned by an account."""


class InvalidCredentialsError(ValueError):
    """Raised for every failed login, without leaking account existence."""


class InactiveUserError(ValueError):
    """Raised when a disabled account attempts to authenticate."""


class AuthService:
    """Coordinates authentication use cases and database transactions."""

    def __init__(self, session: Session) -> None:
        self._session = session
        self._users = UserRepository(session)

    def register(self, request: RegisterRequest) -> User:
        """Create a student account with a one-way password hash."""
        email = str(request.email).lower()
        if self._users.get_by_email(email) is not None:
            raise EmailAlreadyRegisteredError

        try:
            user = self._users.create(
                full_name=request.full_name.strip(),
                email=email,
                password_hash=hash_password(request.password),
            )
            self._session.commit()
            self._session.refresh(user)
            return user
        except IntegrityError as error:
            self._session.rollback()
            raise EmailAlreadyRegisteredError from error

    def login(self, request: LoginRequest) -> TokenResponse:
        """Verify credentials and issue a short-lived bearer token."""
        user = self._users.get_by_email(str(request.email).lower())
        if user is None or not verify_password(request.password, user.password_hash):
            raise InvalidCredentialsError
        if not user.is_active:
            raise InactiveUserError

        return TokenResponse(
            access_token=create_access_token(str(user.id)),
            expires_in=self._access_token_lifetime_seconds,
        )

    @property
    def _access_token_lifetime_seconds(self) -> int:
        """Keep the API's explicit expiry response aligned with configuration."""
        from app.core.config import settings

        return settings.access_token_expire_minutes * 60

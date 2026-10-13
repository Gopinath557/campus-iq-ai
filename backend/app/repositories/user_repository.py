"""Database operations for User entities."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import AuthProvider, User, UserRole


class UserRepository:
    """Encapsulates all User persistence operations."""

    def __init__(self, session: Session) -> None:
        self._session = session

    def get_by_email(self, email: str) -> User | None:
        """Return one user by normalized email, if it exists."""
        statement = select(User).where(User.email == email)
        return self._session.scalar(statement)

    def get_by_google_id(self, google_id: str) -> User | None:
        """Return one user by Google ID, if it exists."""
        statement = select(User).where(User.google_id == google_id)
        return self._session.scalar(statement)

    def get_by_id(self, user_id: int) -> User | None:
        """Return one user by primary key, if it exists."""
        return self._session.get(User, user_id)

    def create(self, *, full_name: str, email: str, password_hash: str) -> User:
        """Persist a newly registered student account."""
        user = User(
            full_name=full_name,
            email=email,
            password_hash=password_hash,
            auth_provider=AuthProvider.EMAIL,
            role=UserRole.STUDENT,
        )
        self._session.add(user)
        self._session.flush()
        return user

    def create_google(
        self, *, full_name: str, email: str, google_id: str
    ) -> User:
        """Persist a user who signed up via Google OAuth."""
        user = User(
            full_name=full_name,
            email=email,
            password_hash=None,
            auth_provider=AuthProvider.GOOGLE,
            google_id=google_id,
            role=UserRole.STUDENT,
        )
        self._session.add(user)
        self._session.flush()
        return user

    def link_google(self, user: User, *, google_id: str) -> User:
        """Link an existing email account to a Google ID."""
        user.google_id = google_id
        user.auth_provider = AuthProvider.GOOGLE
        self._session.flush()
        return user

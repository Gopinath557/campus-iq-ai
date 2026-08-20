"""Database operations for User entities."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User, UserRole


class UserRepository:
    """Encapsulates all User persistence operations."""

    def __init__(self, session: Session) -> None:
        self._session = session

    def get_by_email(self, email: str) -> User | None:
        """Return one user by normalized email, if it exists."""
        statement = select(User).where(User.email == email)
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
            role=UserRole.STUDENT,
        )
        self._session.add(user)
        self._session.flush()
        return user

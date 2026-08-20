"""Database operations for student profiles."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.student import Student


class StudentRepository:
    """Encapsulate persistence operations for :class:`Student`."""

    def __init__(self, session: Session) -> None:
        self._session = session

    def create(self, values: dict[str, object]) -> Student:
        """Add and flush a new student record."""
        student = Student(**values)
        self._session.add(student)
        self._session.flush()
        return student

    def get_by_id(self, student_id: int) -> Student | None:
        """Return a student by primary key, if present."""
        return self._session.get(Student, student_id)

    def get_by_register_number(self, register_number: str) -> Student | None:
        """Return a student by registration number, if present."""
        return self._session.scalar(select(Student).where(Student.register_number == register_number))

    def get_by_email(self, email: str) -> Student | None:
        """Return a student by email address, if present."""
        return self._session.scalar(select(Student).where(Student.email == email))

    def list(self, *, offset: int, limit: int) -> list[Student]:
        """Return a stable, paginated list of students."""
        statement = select(Student).order_by(Student.id).offset(offset).limit(limit)
        return list(self._session.scalars(statement))

    def delete(self, student: Student) -> None:
        """Mark a student record for deletion."""
        self._session.delete(student)

"""Business rules for student profile management."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.student import Student
from app.repositories.student_repository import StudentRepository
from app.schemas.student import StudentCreate, StudentUpdate


class StudentNotFoundError(LookupError):
    """Raised when a requested student does not exist."""


class StudentAlreadyExistsError(ValueError):
    """Raised when a registration number or email is already in use."""


class StudentService:
    """Coordinate validated student-profile use cases."""

    def __init__(self, session: Session) -> None:
        self._session = session
        self._students = StudentRepository(session)

    def create(self, request: StudentCreate) -> Student:
        """Create a student after enforcing unique identity fields."""
        values = self._normalise_values(request.model_dump())
        self._ensure_unique(values)
        return self._save_new(values)

    def get(self, student_id: int) -> Student:
        """Return a student or signal that it was not found."""
        student = self._students.get_by_id(student_id)
        if student is None:
            raise StudentNotFoundError
        return student

    def list(self, *, offset: int, limit: int) -> list[Student]:
        """Return a page of student records."""
        return self._students.list(offset=offset, limit=limit)

    def update(self, student_id: int, request: StudentUpdate) -> Student:
        """Update one student while preserving unique identity fields."""
        student = self.get(student_id)
        values = self._normalise_values(request.model_dump(exclude_unset=True))
        self._ensure_unique(values, excluding_student_id=student.id)
        for field, value in values.items():
            setattr(student, field, value)

        try:
            self._session.commit()
            self._session.refresh(student)
            return student
        except IntegrityError as error:
            self._session.rollback()
            raise StudentAlreadyExistsError from error

    def delete(self, student_id: int) -> None:
        """Delete one student record."""
        student = self.get(student_id)
        self._students.delete(student)
        self._session.commit()

    def _save_new(self, values: dict[str, object]) -> Student:
        try:
            student = self._students.create(values)
            self._session.commit()
            self._session.refresh(student)
            return student
        except IntegrityError as error:
            self._session.rollback()
            raise StudentAlreadyExistsError from error

    def _ensure_unique(
        self,
        values: dict[str, object],
        *,
        excluding_student_id: int | None = None,
    ) -> None:
        register_number = values.get("register_number")
        if isinstance(register_number, str):
            student = self._students.get_by_register_number(register_number)
            if student is not None and student.id != excluding_student_id:
                raise StudentAlreadyExistsError

        email = values.get("email")
        if isinstance(email, str):
            student = self._students.get_by_email(email)
            if student is not None and student.id != excluding_student_id:
                raise StudentAlreadyExistsError

    @staticmethod
    def _normalise_values(values: dict[str, object]) -> dict[str, object]:
        """Trim names and normalise unique identity values before storage."""
        normalised = values.copy()
        for field in ("full_name", "phone", "department"):
            value = normalised.get(field)
            if isinstance(value, str):
                normalised[field] = value.strip()

        register_number = normalised.get("register_number")
        if isinstance(register_number, str):
            normalised["register_number"] = register_number.strip().upper()

        email = normalised.get("email")
        if email is not None:
            normalised["email"] = str(email).strip().lower()

        return normalised

"""Business logic for Experience management."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.experience import Experience
from app.repositories.experience_repository import ExperienceRepository
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceUpdate,
)


class ExperienceNotFoundError(Exception):
    """Raised when an experience is not found."""


class ExperienceService:
    """Service layer for Experience."""

    def __init__(self, session: Session):
        self.session = session
        self.repository = ExperienceRepository(session)

    def create(self, request: ExperienceCreate) -> Experience:
        experience = Experience(**request.model_dump())

        try:
            self.repository.create(experience)
            self.session.commit()
            self.session.refresh(experience)
            return experience
        except IntegrityError:
            self.session.rollback()
            raise

    def get(self, experience_id: int) -> Experience:
        experience = self.repository.get_by_id(experience_id)

        if experience is None:
            raise ExperienceNotFoundError

        return experience

    def get_all(self, offset: int = 0, limit: int = 100) -> list[Experience]:
        return self.repository.get_all(offset=offset, limit=limit)

    def list_by_student(self, student_id: int) -> list[Experience]:
        return self.repository.list_by_student(student_id)

    def update(
        self,
        experience_id: int,
        request: ExperienceUpdate,
    ) -> Experience:
        experience = self.get(experience_id)

        update_data = request.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(experience, field, value)

        self.repository.update(experience)
        self.session.commit()
        self.session.refresh(experience)

        return experience

    def delete(self, experience_id: int) -> None:
        experience = self.get(experience_id)

        self.repository.delete(experience)
        self.session.commit()
"""Repository for Experience database operations."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.experience import Experience


class ExperienceRepository:
    """Repository for Experience CRUD operations."""

    def __init__(self, session: Session):
        self.session = session

    def create(self, experience: Experience) -> Experience:
        self.session.add(experience)
        self.session.flush()
        self.session.refresh(experience)
        return experience

    def get_by_id(self, experience_id: int) -> Experience | None:
        return self.session.get(Experience, experience_id)

    def get_all(self, offset: int = 0, limit: int = 100) -> list[Experience]:
        stmt = (
            select(Experience)
            .offset(offset)
            .limit(limit)
            .order_by(Experience.id)
        )
        return list(self.session.scalars(stmt).all())

    def list_by_student(self, student_id: int) -> list[Experience]:
        stmt = (
            select(Experience)
            .where(Experience.student_id == student_id)
            .order_by(Experience.id)
        )
        return list(self.session.scalars(stmt).all())

    def update(self, experience: Experience) -> Experience:
        self.session.add(experience)
        self.session.flush()
        self.session.refresh(experience)
        return experience

    def delete(self, experience: Experience) -> None:
        self.session.delete(experience)
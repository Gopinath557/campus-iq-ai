"""Database operations for student skills."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.skill import Skill


class SkillRepository:
    """Encapsulate persistence operations for :class:`Skill`."""

    def __init__(self, session: Session) -> None:
        self._session = session

    def create(self, *, student_id: int, name: str) -> Skill:
        """Add and flush a skill owned by a student."""
        skill = Skill(student_id=student_id, name=name)
        self._session.add(skill)
        self._session.flush()
        return skill

    def get_by_id(self, *, student_id: int, skill_id: int) -> Skill | None:
        """Return a skill only when it belongs to the requested student."""
        statement = select(Skill).where(Skill.id == skill_id, Skill.student_id == student_id)
        return self._session.scalar(statement)

    def get_by_name(self, *, student_id: int, name: str) -> Skill | None:
        """Return a student's skill by name, if it exists."""
        statement = select(Skill).where(Skill.student_id == student_id, Skill.name == name)
        return self._session.scalar(statement)

    def list_by_student_id(self, student_id: int) -> list[Skill]:
        """Return a student's skills in a stable order."""
        statement = select(Skill).where(Skill.student_id == student_id).order_by(Skill.id)
        return list(self._session.scalars(statement))

    def delete(self, skill: Skill) -> None:
        """Mark a skill for deletion."""
        self._session.delete(skill)

"""Business rules for skills owned by student profiles."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.skill import Skill
from app.repositories.skill_repository import SkillRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.skill import SkillCreate, SkillUpdate


class SkillNotFoundError(LookupError):
    """Raised when a requested skill does not belong to the student."""


class SkillAlreadyExistsError(ValueError):
    """Raised when a student has the same skill more than once."""


class StudentNotFoundError(LookupError):
    """Raised when skills are requested for a student that does not exist."""


class SkillService:
    """Coordinate skill CRUD operations scoped to a student."""

    def __init__(self, session: Session) -> None:
        self._session = session
        self._students = StudentRepository(session)
        self._skills = SkillRepository(session)

    def create(self, student_id: int, request: SkillCreate) -> Skill:
        """Add one unique skill to a student profile."""
        self._ensure_student_exists(student_id)
        name = request.name
        if self._skills.get_by_name(student_id=student_id, name=name) is not None:
            raise SkillAlreadyExistsError

        try:
            skill = self._skills.create(student_id=student_id, name=name)
            self._session.commit()
            self._session.refresh(skill)
            return skill
        except IntegrityError as error:
            self._session.rollback()
            raise SkillAlreadyExistsError from error

    def get(self, student_id: int, skill_id: int) -> Skill:
        """Return one skill belonging to a student."""
        self._ensure_student_exists(student_id)
        skill = self._skills.get_by_id(student_id=student_id, skill_id=skill_id)
        if skill is None:
            raise SkillNotFoundError
        return skill

    def list(self, student_id: int) -> list[Skill]:
        """Return all skills belonging to a student."""
        self._ensure_student_exists(student_id)
        return self._skills.list_by_student_id(student_id)

    def update(self, student_id: int, skill_id: int, request: SkillUpdate) -> Skill:
        """Rename a skill without allowing duplicate names per student."""
        skill = self.get(student_id, skill_id)
        duplicate = self._skills.get_by_name(student_id=student_id, name=request.name)
        if duplicate is not None and duplicate.id != skill.id:
            raise SkillAlreadyExistsError

        try:
            skill.name = request.name
            self._session.commit()
            self._session.refresh(skill)
            return skill
        except IntegrityError as error:
            self._session.rollback()
            raise SkillAlreadyExistsError from error

    def delete(self, student_id: int, skill_id: int) -> None:
        """Delete one skill belonging to a student."""
        skill = self.get(student_id, skill_id)
        self._skills.delete(skill)
        self._session.commit()

    def _ensure_student_exists(self, student_id: int) -> None:
        if self._students.get_by_id(student_id) is None:
            raise StudentNotFoundError

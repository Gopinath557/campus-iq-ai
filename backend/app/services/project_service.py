"""Business logic for project management."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.project import Project
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectNotFoundError(Exception):
    """Raised when a project is not found."""


class ProjectService:
    """Service layer for Project."""

    def __init__(self, session: Session):
        self.session = session
        self.repository = ProjectRepository(session)

    def create(self, request: ProjectCreate) -> Project:
        project = Project(**request.model_dump())

        try:
            self.repository.create(project)
            self.session.commit()
            self.session.refresh(project)
            return project
        except IntegrityError:
            self.session.rollback()
            raise

    def get(self, project_id: int) -> Project:
        project = self.repository.get_by_id(project_id)

        if project is None:
            raise ProjectNotFoundError

        return project

    def get_all(self, offset: int = 0, limit: int = 100) -> list[Project]:
        return self.repository.get_all(offset=offset, limit=limit)

    def list_by_student(self, student_id: int) -> list[Project]:
        return self.repository.list_by_student(student_id)

    def update(self, project_id: int, request: ProjectUpdate) -> Project:
        project = self.get(project_id)

        update_data = request.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(project, field, value)

        self.repository.update(project)
        self.session.commit()
        self.session.refresh(project)

        return project

    def delete(self, project_id: int) -> None:
        project = self.get(project_id)

        self.repository.delete(project)
        self.session.commit()
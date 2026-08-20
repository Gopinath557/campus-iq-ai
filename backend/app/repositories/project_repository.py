"""Repository for Project CRUD operations."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project


class ProjectRepository:
    """Repository for project database operations."""

    def __init__(self, session: Session):
        self.session = session

    def create(self, project: Project) -> Project:
        self.session.add(project)
        self.session.flush()
        self.session.refresh(project)
        return project

    def get_by_id(self, project_id: int) -> Project | None:
        return self.session.get(Project, project_id)

    def get_all(self, offset: int = 0, limit: int = 100) -> list[Project]:
        stmt = (
            select(Project)
            .offset(offset)
            .limit(limit)
            .order_by(Project.id)
        )
        return list(self.session.scalars(stmt).all())

    def list_by_student(self, student_id: int) -> list[Project]:
        stmt = (
            select(Project)
            .where(Project.student_id == student_id)
            .order_by(Project.id)
        )
        return list(self.session.scalars(stmt).all())

    def update(self, project: Project) -> Project:
        self.session.add(project)
        self.session.flush()
        self.session.refresh(project)
        return project

    def delete(self, project: Project) -> None:
        self.session.delete(project)
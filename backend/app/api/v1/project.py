"""Protected HTTP endpoints for student projects."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)
from app.services.project_service import (
    ProjectNotFoundError,
    ProjectService,
)

router = APIRouter(prefix="/projects", tags=["Projects"])

DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    request: ProjectCreate,
    session: DatabaseSession,
    _: CurrentUser,
) -> ProjectResponse:
    return ProjectService(session).create(request)


@router.get("", response_model=list[ProjectResponse])
def list_projects(
    session: DatabaseSession,
    _: CurrentUser,
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
) -> list[ProjectResponse]:
    return ProjectService(session).list(offset=offset, limit=limit)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    session: DatabaseSession,
    _: CurrentUser,
) -> ProjectResponse:
    try:
        return ProjectService(session).get(project_id)
    except ProjectNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        ) from error


@router.get("/student/{student_id}", response_model=list[ProjectResponse])
def list_student_projects(
    student_id: int,
    session: DatabaseSession,
    _: CurrentUser,
) -> list[ProjectResponse]:
    return ProjectService(session).list_by_student(student_id)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    request: ProjectUpdate,
    session: DatabaseSession,
    _: CurrentUser,
) -> ProjectResponse:
    try:
        return ProjectService(session).update(project_id, request)
    except ProjectNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        ) from error


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    session: DatabaseSession,
    _: CurrentUser,
) -> Response:
    try:
        ProjectService(session).delete(project_id)
    except ProjectNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        ) from error

    return Response(status_code=status.HTTP_204_NO_CONTENT)
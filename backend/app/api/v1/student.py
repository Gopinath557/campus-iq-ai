"""Protected HTTP endpoints for student profiles."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.student import StudentCreate, StudentResponse, StudentUpdate
from app.services.student_service import (
    StudentAlreadyExistsError,
    StudentNotFoundError,
    StudentService,
)


router = APIRouter(prefix="/students", tags=["Students"])
DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    request: StudentCreate,
    session: DatabaseSession,
    _: CurrentUser,
) -> StudentResponse:
    """Create a student profile."""
    try:
        return StudentService(session).create(request)
    except StudentAlreadyExistsError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A student with this register number or email already exists.",
        ) from error


@router.get("", response_model=list[StudentResponse])
def list_students(
    session: DatabaseSession,
    _: CurrentUser,
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
) -> list[StudentResponse]:
    """List student profiles using offset pagination."""
    return StudentService(session).list(offset=offset, limit=limit)


@router.get("/{id}", response_model=StudentResponse)
def get_student(id: int, session: DatabaseSession, _: CurrentUser) -> StudentResponse:
    """Return one student profile."""
    try:
        return StudentService(session).get(id)
    except StudentNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.") from error


@router.put("/{id}", response_model=StudentResponse)
def update_student(
    id: int,
    request: StudentUpdate,
    session: DatabaseSession,
    _: CurrentUser,
) -> StudentResponse:
    """Update one student profile."""
    try:
        return StudentService(session).update(id, request)
    except StudentNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.") from error
    except StudentAlreadyExistsError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A student with this register number or email already exists.",
        ) from error


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(id: int, session: DatabaseSession, _: CurrentUser) -> Response:
    """Delete one student profile."""
    try:
        StudentService(session).delete(id)
    except StudentNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.") from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)


"""Protected HTTP endpoints for skills owned by students."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.skill import SkillCreate, SkillResponse, SkillUpdate
from app.services.skill_service import (
    SkillAlreadyExistsError,
    SkillNotFoundError,
    SkillService,
    StudentNotFoundError,
)


router = APIRouter(prefix="/students/{student_id}/skills", tags=["Skills"])
DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    student_id: int,
    request: SkillCreate,
    session: DatabaseSession,
    _: CurrentUser,
) -> SkillResponse:
    """Add a skill to a student profile."""
    try:
        return SkillService(session).create(student_id, request)
    except StudentNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.") from error
    except SkillAlreadyExistsError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Skill already exists for this student.") from error


@router.get("", response_model=list[SkillResponse])
def list_skills(student_id: int, session: DatabaseSession, _: CurrentUser) -> list[SkillResponse]:
    """List every skill owned by one student."""
    try:
        return SkillService(session).list(student_id)
    except StudentNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.") from error


@router.get("/{skill_id}", response_model=SkillResponse)
def get_skill(student_id: int, skill_id: int, session: DatabaseSession, _: CurrentUser) -> SkillResponse:
    """Return one skill owned by a student."""
    try:
        return SkillService(session).get(student_id, skill_id)
    except StudentNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.") from error
    except SkillNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found.") from error


@router.put("/{skill_id}", response_model=SkillResponse)
def update_skill(
    student_id: int,
    skill_id: int,
    request: SkillUpdate,
    session: DatabaseSession,
    _: CurrentUser,
) -> SkillResponse:
    """Rename one student skill."""
    try:
        return SkillService(session).update(student_id, skill_id, request)
    except StudentNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.") from error
    except SkillNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found.") from error
    except SkillAlreadyExistsError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Skill already exists for this student.") from error


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(student_id: int, skill_id: int, session: DatabaseSession, _: CurrentUser) -> Response:
    """Delete one student skill."""
    try:
        SkillService(session).delete(student_id, skill_id)
    except StudentNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found.") from error
    except SkillNotFoundError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found.") from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)

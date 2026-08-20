"""Protected HTTP endpoints for student experiences."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
)
from app.services.experience_service import (
    ExperienceNotFoundError,
    ExperienceService,
)

router = APIRouter(
    prefix="/experiences",
    tags=["Experiences"],
)

DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post(
    "",
    response_model=ExperienceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_experience(
    request: ExperienceCreate,
    session: DatabaseSession,
    _: CurrentUser,
):
    return ExperienceService(session).create(request)


@router.get(
    "",
    response_model=list[ExperienceResponse],
)
def list_experiences(
    session: DatabaseSession,
    _: CurrentUser,
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    return ExperienceService(session).list(offset=offset, limit=limit)


@router.get(
    "/{experience_id}",
    response_model=ExperienceResponse,
)
def get_experience(
    experience_id: int,
    session: DatabaseSession,
    _: CurrentUser,
):
    try:
        return ExperienceService(session).get(experience_id)
    except ExperienceNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found.",
        )


@router.get(
    "/student/{student_id}",
    response_model=list[ExperienceResponse],
)
def list_student_experiences(
    student_id: int,
    session: DatabaseSession,
    _: CurrentUser,
):
    return ExperienceService(session).list_by_student(student_id)


@router.put(
    "/{experience_id}",
    response_model=ExperienceResponse,
)
def update_experience(
    experience_id: int,
    request: ExperienceUpdate,
    session: DatabaseSession,
    _: CurrentUser,
):
    try:
        return ExperienceService(session).update(
            experience_id,
            request,
        )
    except ExperienceNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found.",
        )


@router.delete(
    "/{experience_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_experience(
    experience_id: int,
    session: DatabaseSession,
    _: CurrentUser,
):
    try:
        ExperienceService(session).delete(experience_id)
    except ExperienceNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found.",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
"""Protected HTTP endpoints for student achievements."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.achievement import (
    AchievementCreate,
    AchievementResponse,
    AchievementUpdate,
)
from app.services.achievement_service import AchievementService

router = APIRouter(
    prefix="/achievements",
    tags=["Achievements"],
)

DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post(
    "",
    response_model=AchievementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_achievement(
    achievement: AchievementCreate,
    session: DatabaseSession,
    _: CurrentUser,
):
    return AchievementService.create_achievement(session, achievement)


@router.get(
    "",
    response_model=list[AchievementResponse],
)
def get_all_achievements(
    session: DatabaseSession,
    _: CurrentUser,
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    return AchievementService.get_all_achievements(session)


@router.get(
    "/{achievement_id}",
    response_model=AchievementResponse,
)
def get_achievement(
    achievement_id: int,
    session: DatabaseSession,
    _: CurrentUser,
):
    achievement = AchievementService.get_achievement_by_id(session, achievement_id)
    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found.",
        )
    return achievement


@router.get(
    "/student/{student_id}",
    response_model=list[AchievementResponse],
)
def list_student_achievements(
    student_id: int,
    session: DatabaseSession,
    _: CurrentUser,
):
    return AchievementService.get_achievements_by_student(session, student_id)


@router.put(
    "/{achievement_id}",
    response_model=AchievementResponse,
)
def update_achievement(
    achievement_id: int,
    achievement: AchievementUpdate,
    session: DatabaseSession,
    _: CurrentUser,
):
    db_achievement = AchievementService.get_achievement_by_id(session, achievement_id)
    if not db_achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found.",
        )
    return AchievementService.update_achievement(session, achievement_id, achievement)


@router.delete(
    "/{achievement_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_achievement(
    achievement_id: int,
    session: DatabaseSession,
    _: CurrentUser,
):
    db_achievement = AchievementService.get_achievement_by_id(session, achievement_id)
    if not db_achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found.",
        )
    AchievementService.delete_achievement(session, achievement_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

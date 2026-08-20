from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.achievement import (
    AchievementCreate,
    AchievementUpdate,
    AchievementResponse,
)
from app.services.achievement_service import AchievementService

router = APIRouter(
    prefix="/achievements",
    tags=["Achievements"],
)


@router.post(
    "/",
    response_model=AchievementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_achievement(
    achievement: AchievementCreate,
    db: Session = Depends(get_db),
):
    return AchievementService.create_achievement(db, achievement)


@router.get(
    "/",
    response_model=list[AchievementResponse],
)
def get_all_achievements(
    db: Session = Depends(get_db),
):
    return AchievementService.get_all_achievements(db)


@router.get(
    "/{achievement_id}",
    response_model=AchievementResponse,
)
def get_achievement(
    achievement_id: int,
    db: Session = Depends(get_db),
):
    return AchievementService.get_achievement_by_id(db, achievement_id)


@router.put(
    "/{achievement_id}",
    response_model=AchievementResponse,
)
def update_achievement(
    achievement_id: int,
    achievement: AchievementUpdate,
    db: Session = Depends(get_db),
):
    return AchievementService.update_achievement(
        db,
        achievement_id,
        achievement,
    )


@router.delete(
    "/{achievement_id}",
)
def delete_achievement(
    achievement_id: int,
    db: Session = Depends(get_db),
):
    return AchievementService.delete_achievement(
        db,
        achievement_id,
    )
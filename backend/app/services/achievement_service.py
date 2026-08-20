from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repositories.achievement_repository import AchievementRepository
from app.schemas.achievement import AchievementCreate, AchievementUpdate


class AchievementService:

    @staticmethod
    def create_achievement(db: Session, achievement: AchievementCreate):
        return AchievementRepository.create(db, achievement)

    @staticmethod
    def get_all_achievements(db: Session):
        return AchievementRepository.get_all(db)

    @staticmethod
    def get_achievement_by_id(db: Session, achievement_id: int):
        achievement = AchievementRepository.get_by_id(db, achievement_id)

        if not achievement:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Achievement not found",
            )

        return achievement

    @staticmethod
    def update_achievement(
        db: Session,
        achievement_id: int,
        achievement: AchievementUpdate,
    ):
        db_achievement = AchievementRepository.get_by_id(db, achievement_id)

        if not db_achievement:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Achievement not found",
            )

        return AchievementRepository.update(
            db,
            db_achievement,
            achievement,
        )

    @staticmethod
    def delete_achievement(db: Session, achievement_id: int):
        db_achievement = AchievementRepository.get_by_id(db, achievement_id)

        if not db_achievement:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Achievement not found",
            )

        AchievementRepository.delete(db, db_achievement)

        return {"message": "Achievement deleted successfully"}
from sqlalchemy.orm import Session

from app.models.achievement import Achievement
from app.schemas.achievement import AchievementCreate, AchievementUpdate


class AchievementRepository:

    @staticmethod
    def create(db: Session, achievement: AchievementCreate) -> Achievement:
        db_achievement = Achievement(**achievement.model_dump())
        db.add(db_achievement)
        db.commit()
        db.refresh(db_achievement)
        return db_achievement

    @staticmethod
    def get_all(db: Session):
        return db.query(Achievement).all()

    @staticmethod
    def get_by_id(db: Session, achievement_id: int):
        return (
            db.query(Achievement)
            .filter(Achievement.id == achievement_id)
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        db_achievement: Achievement,
        achievement: AchievementUpdate,
    ) -> Achievement:

        update_data = achievement.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_achievement, key, value)

        db.commit()
        db.refresh(db_achievement)
        return db_achievement

    @staticmethod
    def delete(db: Session, db_achievement: Achievement):
        db.delete(db_achievement)
        db.commit()
        
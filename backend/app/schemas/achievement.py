from datetime import date
from pydantic import BaseModel, ConfigDict


class AchievementBase(BaseModel):
    title: str
    description: str
    organization: str
    achieved_date: date
    student_id: int


class AchievementCreate(AchievementBase):
    pass


class AchievementUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    organization: str | None = None
    achieved_date: date | None = None


class AchievementResponse(AchievementBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
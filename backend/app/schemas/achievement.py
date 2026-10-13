from pydantic import BaseModel, ConfigDict, Field


class AchievementBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: str | None = Field(None, max_length=5000)
    organization: str = Field(..., max_length=200)
    achievement_date: str | None = Field(None, max_length=50)
    student_id: int


class AchievementCreate(AchievementBase):
    pass


class AchievementUpdate(BaseModel):
    title: str | None = Field(None, max_length=200)
    description: str | None = Field(None, max_length=5000)
    organization: str | None = Field(None, max_length=200)
    achievement_date: str | None = Field(None, max_length=50)


class AchievementResponse(AchievementBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

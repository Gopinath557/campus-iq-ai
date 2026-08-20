"""Request and response contracts for student skills."""

from pydantic import BaseModel, ConfigDict, Field, field_validator


class SkillCreate(BaseModel):
    """Data required to add a skill to a student profile."""

    name: str = Field(min_length=1, max_length=100)

    @field_validator("name")
    @classmethod
    def normalise_name(cls, value: str) -> str:
        """Reject whitespace-only skill names."""
        value = value.strip()
        if not value:
            raise ValueError("Skill name cannot be blank.")
        return value


class SkillUpdate(BaseModel):
    """Data accepted when renaming a skill."""

    name: str = Field(min_length=1, max_length=100)

    @field_validator("name")
    @classmethod
    def normalise_name(cls, value: str) -> str:
        """Reject whitespace-only skill names."""
        value = value.strip()
        if not value:
            raise ValueError("Skill name cannot be blank.")
        return value


class SkillResponse(BaseModel):
    """Public representation of one student skill."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    name: str

"""Request and response contracts for student records."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class StudentCreate(BaseModel):
    """Data required to create a student profile."""

    register_number: str = Field(min_length=1, max_length=20)
    full_name: str = Field(min_length=2, max_length=200)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=15)
    department: str = Field(min_length=2, max_length=100)
    year: int = Field(ge=1, le=8)
    cgpa: float = Field(ge=0, le=10)

    @field_validator("register_number", "full_name", "phone", "department")
    @classmethod
    def reject_blank_values(cls, value: str) -> str:
        """Store text fields without accidental leading or trailing whitespace."""
        value = value.strip()
        if not value:
            raise ValueError("Value cannot be blank.")
        return value


class StudentUpdate(BaseModel):
    """Fields that may be changed on an existing student profile."""

    register_number: str | None = Field(default=None, min_length=1, max_length=20)
    full_name: str | None = Field(default=None, min_length=2, max_length=200)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, min_length=7, max_length=15)
    department: str | None = Field(default=None, min_length=2, max_length=100)
    year: int | None = Field(default=None, ge=1, le=8)
    cgpa: float | None = Field(default=None, ge=0, le=10)

    @field_validator("register_number", "full_name", "phone", "department")
    @classmethod
    def reject_blank_values(cls, value: str | None) -> str | None:
        """Reject whitespace-only updates while allowing omitted values."""
        if value is None:
            return None
        value = value.strip()
        if not value:
            raise ValueError("Value cannot be blank.")
        return value


class StudentResponse(BaseModel):
    """Public representation of a student profile."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    register_number: str
    full_name: str
    email: EmailStr
    phone: str
    department: str
    year: int
    cgpa: float
    created_at: datetime
    updated_at: datetime

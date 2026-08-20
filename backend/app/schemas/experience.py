"""Pydantic schemas for Experience."""

from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class ExperienceBase(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=150)
    job_title: str = Field(..., min_length=2, max_length=150)
    description: str | None = None
    start_date: date
    end_date: date | None = None


class ExperienceCreate(ExperienceBase):
    student_id: int


class ExperienceUpdate(BaseModel):
    company_name: str | None = None
    job_title: str | None = None
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None


class ExperienceResponse(ExperienceBase):
    id: int
    student_id: int

    model_config = ConfigDict(from_attributes=True)
"""Pydantic schemas for project APIs."""

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class ProjectBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    technologies: str = Field(..., min_length=2, max_length=255)
    github_url: HttpUrl | None = None
    live_demo_url: HttpUrl | None = None


class ProjectCreate(ProjectBase):
    student_id: int


class ProjectUpdate(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=200)
    description: str | None = Field(None, min_length=10)
    technologies: str | None = Field(None, min_length=2, max_length=255)
    github_url: HttpUrl | None = None
    live_demo_url: HttpUrl | None = None


class ProjectResponse(ProjectBase):
    id: int
    student_id: int

    model_config = ConfigDict(from_attributes=True)
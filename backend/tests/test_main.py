"""Smoke tests for the application entry point."""

from fastapi.testclient import TestClient

from app.main import app
from app.models.skill import Skill
from app.models.student import Student


def test_health_check() -> None:
    """The API starts and exposes its unauthenticated liveness endpoint."""
    response = TestClient(app).get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_student_routes_are_exposed_in_openapi() -> None:
    """Student management endpoints are available through the versioned API."""
    schema = app.openapi()

    assert "/api/v1/students" in schema["paths"]
    assert "/api/v1/students/{id}" in schema["paths"]
    assert "/api/v1/students/{student_id}/skills" in schema["paths"]
    assert "/api/v1/students/{student_id}/skills/{skill_id}" in schema["paths"]


def test_student_has_many_skills() -> None:
    """The ORM exposes both directions of the student-to-skills relationship."""
    assert Student.skills.property.mapper.class_ is Skill
    assert Skill.student.property.mapper.class_ is Student

"""FastAPI application entry point."""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.api.v1.student import router as student_router
from app.api.v1.skill import router as skill_router
from app.api.v1.project import router as project_router
from app.api.v1.certificate import router as certificate_router
from app.api.v1.experience import router as experience_router
from app.api.v1.achievement import router as achievement_router
from app.core.config import settings


def create_app() -> FastAPI:
    """Compose the API without performing database schema mutations at startup."""
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_cors_origins,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Authentication
    app.include_router(auth_router, prefix=settings.api_v1_prefix)

    # Student Management
    app.include_router(student_router, prefix=settings.api_v1_prefix)

    # Skill Management
    app.include_router(skill_router, prefix=settings.api_v1_prefix)

    # Project Management
    app.include_router(project_router, prefix=settings.api_v1_prefix)

    @app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
    def health_check() -> dict[str, str]:
        """Liveness endpoint."""
        return {
            "status": "ok",
            "version": settings.app_version,
        }

    return app


app = create_app()

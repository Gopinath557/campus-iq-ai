"""FastAPI application entry point."""

from pathlib import Path

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.staticfiles import StaticFiles

import swagger_ui_bundle

from app.api.v1.auth import router as auth_router
from app.api.v1.student import router as student_router
from app.api.v1.skill import router as skill_router
from app.api.v1.project import router as project_router
from app.api.v1.certificate import router as certificate_router
from app.api.v1.experience import router as experience_router
from app.api.v1.achievement import router as achievement_router
from app.core.config import settings


_SWAGGER_UI_DIR = Path(swagger_ui_bundle.__file__).parent / "vendor" / "swagger-ui-4.15.5"

limiter = Limiter(key_func=get_remote_address)


def create_app() -> FastAPI:
    """Compose the API without performing database schema mutations at startup."""
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url=None,
        redoc_url=None,
    )

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    _original_openapi = app.openapi

    def _patched_openapi():
        schema = _original_openapi()
        schema["openapi"] = "3.0.3"
        return schema

    app.openapi = _patched_openapi
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_cors_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )

    MAX_BODY_BYTES = 1_048_576  # 1 MB

    @app.middleware("http")
    async def limit_body_size(request: Request, call_next):
        if request.method in ("POST", "PUT", "PATCH"):
            content_length = request.headers.get("content-length")
            if content_length and int(content_length) > MAX_BODY_BYTES:
                return JSONResponse(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="Request body too large. Maximum size is 1 MB.",
                )
        return await call_next(request)

    @app.middleware("http")
    async def security_headers(request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        return response

    app.mount("/swagger-ui", StaticFiles(directory=str(_SWAGGER_UI_DIR)), name="swagger-ui")

    @app.get("/docs", include_in_schema=False)
    async def custom_swagger_ui():
        return get_swagger_ui_html(
            openapi_url=app.openapi_url,
            title=f"{settings.app_name} - Swagger UI",
            swagger_js_url="/swagger-ui/swagger-ui-bundle.js",
            swagger_css_url="/swagger-ui/swagger-ui.css",
            swagger_favicon_url="/swagger-ui/favicon-32x32.png",
        )

    # Authentication
    app.include_router(auth_router, prefix=settings.api_v1_prefix)

    # Student Management
    app.include_router(student_router, prefix=settings.api_v1_prefix)

    # Skill Management
    app.include_router(skill_router, prefix=settings.api_v1_prefix)

    # Project Management
    app.include_router(project_router, prefix=settings.api_v1_prefix)

    # Certificate Management
    app.include_router(certificate_router, prefix=settings.api_v1_prefix)

    # Experience Management
    app.include_router(experience_router, prefix=settings.api_v1_prefix)

    # Achievement Management
    app.include_router(achievement_router, prefix=settings.api_v1_prefix)

    @app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
    def health_check() -> dict[str, str]:
        """Liveness endpoint."""
        return {
            "status": "ok",
            "version": settings.app_version,
        }

    return app


app = create_app()

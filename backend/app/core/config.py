"""Application configuration loaded from environment variables."""

from functools import lru_cache
import os
from pathlib import Path
from urllib.parse import quote_plus

from dotenv import load_dotenv
from pydantic import BaseModel, Field, SecretStr


load_dotenv(Path(__file__).resolve().parents[2] / ".env")


class Settings(BaseModel):
    """Typed, validated configuration for the CampusIQ API."""

    app_name: str = Field(default="CampusIQ AI", validation_alias="APP_NAME")
    app_version: str = Field(default="0.1.0", validation_alias="APP_VERSION")
    api_v1_prefix: str = Field(default="/api/v1", validation_alias="API_V1_PREFIX")
    jwt_secret_key: SecretStr | None = Field(default=None, validation_alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", validation_alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=15,
        validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )
    cors_origins: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000",
        validation_alias="CORS_ORIGINS",
    )
    db_host: str | None = Field(default=None, validation_alias="DB_HOST")
    db_port: int = Field(default=3306, validation_alias="DB_PORT")
    db_name: str | None = Field(default=None, validation_alias="DB_NAME")
    db_user: str | None = Field(default=None, validation_alias="DB_USER")
    db_password: str | None = Field(default=None, validation_alias="DB_PASSWORD")
    db_echo: bool = Field(default=False, validation_alias="DB_ECHO")

    @property
    def database_url(self) -> str:
        """Build a safely encoded MySQL URL only when all values are supplied."""
        required_values = (self.db_host, self.db_name, self.db_user, self.db_password)
        if not all(required_values):
            raise RuntimeError("Database settings are incomplete. Configure backend/.env.")

        return (
            f"mysql+pymysql://{quote_plus(self.db_user)}:{quote_plus(self.db_password)}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}?charset=utf8mb4"
        )

    @property
    def jwt_secret(self) -> str:
        """Return the signing key only when authentication is configured."""
        if self.jwt_secret_key is None:
            raise RuntimeError("JWT_SECRET_KEY must be configured before using authentication.")
        return self.jwt_secret_key.get_secret_value()

    @property
    def allowed_cors_origins(self) -> list[str]:
        """Return configured browser origins, omitting empty values."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return one immutable settings instance per process."""
    return Settings.model_validate(dict(os.environ))


settings = get_settings()

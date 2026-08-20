"""Unit tests for authentication primitives without a database dependency."""

from pydantic import SecretStr

from app.core.config import settings
from app.core.security import (
    InvalidAccessTokenError,
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_hash_cannot_be_used_as_plaintext() -> None:
    """A correct password verifies, while an incorrect one does not."""
    password_hash = hash_password("a-safe-password")

    assert password_hash != "a-safe-password"
    assert verify_password("a-safe-password", password_hash)
    assert not verify_password("incorrect-password", password_hash)


def test_access_token_round_trip(monkeypatch) -> None:
    """A token created by the API resolves to its original user ID."""
    monkeypatch.setattr(settings, "jwt_secret_key", SecretStr("test-secret-key-not-for-production"))

    token = create_access_token("42")

    assert decode_access_token(token) == "42"


def test_tampered_access_token_is_rejected(monkeypatch) -> None:
    """Changing a signed token invalidates its signature."""
    monkeypatch.setattr(settings, "jwt_secret_key", SecretStr("test-secret-key-not-for-production"))
    token = create_access_token("42")

    try:
        decode_access_token(f"{token}tampered")
    except InvalidAccessTokenError:
        pass
    else:
        raise AssertionError("A tampered token must be rejected.")

"""Add auth_provider, google_id, and nullable password_hash for OAuth users.

Revision ID: 20260820_01
Revises: 20260722_03
Create Date: 2026-08-20
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260820_01"
down_revision: str | None = "20260722_03"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Add Google OAuth support columns and make password_hash optional."""
    op.add_column(
        "users",
        sa.Column(
            "auth_provider",
            sa.Enum("email", "google", name="authprovider"),
            nullable=False,
            server_default="email",
        ),
    )
    op.add_column(
        "users",
        sa.Column("google_id", sa.String(length=100), nullable=True),
    )
    op.alter_column(
        "users",
        "password_hash",
        type_=sa.String(length=255),
        nullable=True,
    )
    op.create_unique_constraint("uq_users_google_id", "users", ["google_id"])


def downgrade() -> None:
    """Remove Google OAuth support columns."""
    op.drop_constraint("uq_users_google_id", "users", type_="unique")
    op.alter_column(
        "users",
        "password_hash",
        type_=sa.String(length=255),
        nullable=False,
    )
    op.drop_column("users", "google_id")
    op.drop_column("users", "auth_provider")

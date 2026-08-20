"""Create the student profiles table.

Revision ID: 20260722_01
Revises: 20260720_01
Create Date: 2026-07-22
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260722_01"
down_revision: str | None = "20260720_01"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Create student profiles and their unique identity indexes."""
    op.create_table(
        "students",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("register_no", sa.String(length=20), nullable=False),
        sa.Column("first_name", sa.String(length=100), nullable=False),
        sa.Column("last_name", sa.String(length=100), nullable=True),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("phone", sa.String(length=15), nullable=True),
        sa.Column("department", sa.String(length=100), nullable=True),
        sa.Column("cgpa", sa.Float(), nullable=True),
        sa.Column("profile_image", sa.String(length=255), nullable=True),
    )
    op.create_index("ix_students_register_no", "students", ["register_no"], unique=True)
    op.create_index("ix_students_email", "students", ["email"], unique=True)


def downgrade() -> None:
    """Remove the student profiles table for a development rollback only."""
    op.drop_index("ix_students_email", table_name="students")
    op.drop_index("ix_students_register_no", table_name="students")
    op.drop_table("students")

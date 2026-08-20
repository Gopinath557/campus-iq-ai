"""Align student profiles with the required college-record schema.

Revision ID: 20260722_02
Revises: 20260722_01
Create Date: 2026-07-22
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260722_02"
down_revision: str | None = "20260722_01"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Replace the earlier student fields with the college-record schema."""
    op.drop_index("ix_students_register_no", table_name="students")
    op.alter_column(
        "students",
        "register_no",
        new_column_name="register_number",
        existing_type=sa.String(length=20),
        existing_nullable=False,
    )
    op.create_index("ix_students_register_number", "students", ["register_number"], unique=True)

    op.add_column("students", sa.Column("full_name", sa.String(length=200), nullable=True))
    op.execute("UPDATE students SET full_name = TRIM(CONCAT_WS(' ', first_name, last_name))")
    op.alter_column(
        "students",
        "full_name",
        existing_type=sa.String(length=200),
        nullable=False,
    )

    op.add_column(
        "students",
        sa.Column("year", sa.Integer(), nullable=False, server_default=sa.text("'1'")),
    )
    op.add_column(
        "students",
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    op.add_column(
        "students",
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    op.execute("UPDATE students SET phone = '' WHERE phone IS NULL")
    op.execute("UPDATE students SET department = '' WHERE department IS NULL")
    op.execute("UPDATE students SET cgpa = 0 WHERE cgpa IS NULL")
    op.alter_column("students", "phone", existing_type=sa.String(length=15), nullable=False)
    op.alter_column("students", "department", existing_type=sa.String(length=100), nullable=False)
    op.alter_column("students", "cgpa", existing_type=sa.Float(), nullable=False)

    op.drop_column("students", "profile_image")
    op.drop_column("students", "last_name")
    op.drop_column("students", "first_name")


def downgrade() -> None:
    """Restore the prior development-only student schema."""
    op.add_column("students", sa.Column("first_name", sa.String(length=100), nullable=True))
    op.add_column("students", sa.Column("last_name", sa.String(length=100), nullable=True))
    op.add_column("students", sa.Column("profile_image", sa.String(length=255), nullable=True))
    op.execute("UPDATE students SET first_name = full_name")
    op.alter_column("students", "first_name", existing_type=sa.String(length=100), nullable=False)

    op.alter_column("students", "phone", existing_type=sa.String(length=15), nullable=True)
    op.alter_column("students", "department", existing_type=sa.String(length=100), nullable=True)
    op.alter_column("students", "cgpa", existing_type=sa.Float(), nullable=True)
    op.drop_column("students", "updated_at")
    op.drop_column("students", "created_at")
    op.drop_column("students", "year")
    op.drop_column("students", "full_name")

    op.drop_index("ix_students_register_number", table_name="students")
    op.alter_column(
        "students",
        "register_number",
        new_column_name="register_no",
        existing_type=sa.String(length=20),
        existing_nullable=False,
    )
    op.create_index("ix_students_register_no", "students", ["register_no"], unique=True)

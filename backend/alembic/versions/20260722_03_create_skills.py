"""Create skills owned by student profiles.

Revision ID: 20260722_03
Revises: 20260722_02
Create Date: 2026-07-22
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op


revision: str = "20260722_03"
down_revision: str | None = "20260722_02"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Create the many-side skills table and its student relationship."""
    op.create_table(
        "skills",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.ForeignKeyConstraint(["student_id"], ["students.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("student_id", "name", name="uq_skills_student_name"),
    )
    op.create_index("ix_skills_student_id", "skills", ["student_id"], unique=False)


def downgrade() -> None:
    """Remove skills for a development rollback only."""
    op.drop_index("ix_skills_student_id", table_name="skills")
    op.drop_table("skills")

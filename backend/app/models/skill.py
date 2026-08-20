"""Skill persistence model owned by a student."""

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base

if TYPE_CHECKING:
    from app.models.student import Student


class Skill(Base):
    """One named skill associated with one student profile."""

    __tablename__ = "skills"
    __table_args__ = (UniqueConstraint("student_id", "name", name="uq_skills_student_name"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    student: Mapped["Student"] = relationship(back_populates="skills")

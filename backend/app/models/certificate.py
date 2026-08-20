from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base

if TYPE_CHECKING:
    from app.models.student import Student


class Certificate(Base):
    """Student certificate model."""

    __tablename__ = "certificates"

    id: Mapped[int] = mapped_column(primary_key=True)

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
    )

    certificate_name: Mapped[str] = mapped_column(String(200), nullable=False)

    issuer: Mapped[str] = mapped_column(String(150), nullable=False)

    issue_date: Mapped[datetime] = mapped_column(Date)

    credential_id: Mapped[str | None] = mapped_column(String(100))

    credential_url: Mapped[str | None] = mapped_column(String(255))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    student: Mapped["Student"] = relationship(back_populates="certificates")


from app.models.student import Student
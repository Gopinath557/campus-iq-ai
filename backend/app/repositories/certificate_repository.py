"""Repository for certificate database operations."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.certificate import Certificate


class CertificateRepository:
    """Repository for Certificate CRUD operations."""

    def __init__(self, session: Session):
        self.session = session

    def create(self, certificate: Certificate) -> Certificate:
        self.session.add(certificate)
        self.session.flush()
        self.session.refresh(certificate)
        return certificate

    def get_by_id(self, certificate_id: int) -> Certificate | None:
        return self.session.get(Certificate, certificate_id)

    def get_all(self, offset: int = 0, limit: int = 100) -> list[Certificate]:
        stmt = (
            select(Certificate)
            .offset(offset)
            .limit(limit)
            .order_by(Certificate.id)
        )
        return list(self.session.scalars(stmt).all())

    def list_by_student(self, student_id: int) -> list[Certificate]:
        stmt = (
            select(Certificate)
            .where(Certificate.student_id == student_id)
            .order_by(Certificate.id)
        )
        return list(self.session.scalars(stmt).all())

    def update(self, certificate: Certificate) -> Certificate:
        self.session.add(certificate)
        self.session.flush()
        self.session.refresh(certificate)
        return certificate

    def delete(self, certificate: Certificate) -> None:
        self.session.delete(certificate)
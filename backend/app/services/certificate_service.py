"""Business logic for certificate management."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.certificate import Certificate
from app.repositories.certificate_repository import CertificateRepository
from app.schemas.certificate import (
    CertificateCreate,
    CertificateUpdate,
)


class CertificateNotFoundError(Exception):
    """Raised when a certificate is not found."""


class CertificateService:
    """Service layer for Certificate."""

    def __init__(self, session: Session):
        self.session = session
        self.repository = CertificateRepository(session)

    def create(self, request: CertificateCreate) -> Certificate:
        certificate = Certificate(**request.model_dump())

        try:
            self.repository.create(certificate)
            self.session.commit()
            self.session.refresh(certificate)
            return certificate
        except IntegrityError:
            self.session.rollback()
            raise

    def get(self, certificate_id: int) -> Certificate:
        certificate = self.repository.get_by_id(certificate_id)

        if certificate is None:
            raise CertificateNotFoundError

        return certificate

    def get_all(self, offset: int = 0, limit: int = 100) -> list[Certificate]:
        return self.repository.get_all(offset=offset, limit=limit)

    def list_by_student(self, student_id: int) -> list[Certificate]:
        return self.repository.list_by_student(student_id)

    def update(
        self,
        certificate_id: int,
        request: CertificateUpdate,
    ) -> Certificate:
        certificate = self.get(certificate_id)

        update_data = request.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(certificate, field, value)

        self.repository.update(certificate)
        self.session.commit()
        self.session.refresh(certificate)

        return certificate

    def delete(self, certificate_id: int) -> None:
        certificate = self.get(certificate_id)

        self.repository.delete(certificate)
        self.session.commit()
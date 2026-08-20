from datetime import date

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class CertificateBase(BaseModel):
    certificate_name: str = Field(..., min_length=3, max_length=200)
    issuer: str = Field(..., min_length=2, max_length=150)
    issue_date: date
    credential_id: str | None = None
    credential_url: HttpUrl | None = None


class CertificateCreate(CertificateBase):
    student_id: int


class CertificateUpdate(BaseModel):
    certificate_name: str | None = None
    issuer: str | None = None
    issue_date: date | None = None
    credential_id: str | None = None
    credential_url: HttpUrl | None = None


class CertificateResponse(CertificateBase):
    id: int
    student_id: int

    model_config = ConfigDict(from_attributes=True)
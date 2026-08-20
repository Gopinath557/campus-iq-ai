"""Protected HTTP endpoints for student certificates."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.certificate import (
    CertificateCreate,
    CertificateResponse,
    CertificateUpdate,
)
from app.services.certificate_service import (
    CertificateNotFoundError,
    CertificateService,
)

router = APIRouter(
    prefix="/certificates",
    tags=["Certificates"],
)

DatabaseSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post(
    "",
    response_model=CertificateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_certificate(
    request: CertificateCreate,
    session: DatabaseSession,
    _: CurrentUser,
):
    return CertificateService(session).create(request)


@router.get(
    "",
    response_model=list[CertificateResponse],
)
def list_certificates(
    session: DatabaseSession,
    _: CurrentUser,
    offset: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    return CertificateService(session).get_all(
        offset=offset,
        limit=limit,
    )


@router.get(
    "/{certificate_id}",
    response_model=CertificateResponse,
)
def get_certificate(
    certificate_id: int,
    session: DatabaseSession,
    _: CurrentUser,
):
    try:
        return CertificateService(session).get(certificate_id)
    except CertificateNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found.",
        )


@router.get(
    "/student/{student_id}",
    response_model=list[CertificateResponse],
)
def list_student_certificates(
    student_id: int,
    session: DatabaseSession,
    _: CurrentUser,
):
    return CertificateService(session).list_by_student(student_id)


@router.put(
    "/{certificate_id}",
    response_model=CertificateResponse,
)
def update_certificate(
    certificate_id: int,
    request: CertificateUpdate,
    session: DatabaseSession,
    _: CurrentUser,
):
    try:
        return CertificateService(session).update(
            certificate_id,
            request,
        )
    except CertificateNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found.",
        )


@router.delete(
    "/{certificate_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_certificate(
    certificate_id: int,
    session: DatabaseSession,
    _: CurrentUser,
):
    try:
        CertificateService(session).delete(certificate_id)
    except CertificateNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found.",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
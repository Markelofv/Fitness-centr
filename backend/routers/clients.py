from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from core import require_role
from database import get_db
from models.user import User
from models.role import Role
from schemas.admin import ClientRead, ClientDetail

router = APIRouter(prefix="/api/clients", tags=["clients"])

@router.get("", response_model=List[ClientRead])
def list_clients(
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    """Список всех клиентов клуба."""
    return (
        db.query(User)
        .join(Role)
        .filter(Role.name == "client")
        .order_by(User.created_at.desc())
        .all()
    )

@router.get("/{client_id}", response_model=ClientDetail)
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    """Детальная карточка клиента с абонементами и историей."""
    client = (
        db.query(User)
        .options(
            joinedload(User.memberships),
            joinedload(User.payments),
            joinedload(User.bookings).joinedload(Booking.fitness_class)
        )
        .filter(User.id == client_id, User.role.has(name="client"))
        .first()
    )
    if not client:
        raise HTTPException(404, "Клиент не найден")
    return client

@router.patch("/{client_id}/block", response_model=ClientRead)
def toggle_block(
    client_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    """Блокировка/разблокировка клиента."""
    client = db.query(User).filter(User.id == client_id, User.role.has(name="client")).first()
    if not client:
        raise HTTPException(404, "Клиент не найден")
    client.is_active = not client.is_active
    db.commit()
    db.refresh(client)
    return client
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core import get_current_user, require_role
from database import get_db
from models.membership import Membership
from models.user import User
from schemas.membership import MembershipCreate, MembershipRead

router = APIRouter(prefix="/api/memberships", tags=["memberships"])


@router.get("/me", response_model=MembershipRead)
def my_membership(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Возвращает активный абонемент текущего пользователя."""
    membership = (
        db.query(Membership)
        .filter(Membership.user_id == user.id, Membership.status == "active")
        .order_by(Membership.end_date.desc())
        .first()
    )
    if not membership:
        raise HTTPException(404, "Активного абонемента нет")
    return membership


@router.get("", response_model=list[MembershipRead])
def list_memberships(
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    """Все абонементы. Только для админа."""
    return db.query(Membership).order_by(Membership.created_at.desc()).all()


@router.post("", response_model=MembershipRead, status_code=status.HTTP_201_CREATED)
def create_membership(
    data: MembershipCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    """Создать абонемент вручную. Только админ."""
    from datetime import date, timedelta

    target_user = db.query(User).filter(User.id == data.user_id).first()
    if not target_user:
        raise HTTPException(404, "Пользователь не найден")

    membership = Membership(
        user_id=data.user_id,
        type=data.type,
        start_date=date.today(),
        end_date=date.today() + timedelta(days=data.days),
        visits_left=None if data.type != "single" else 1,
        status="active",
    )
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return membership
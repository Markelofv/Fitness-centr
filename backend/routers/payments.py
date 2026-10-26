from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from core import get_current_user, require_role
from database import get_db
from models.payment import Payment
from models.user import User
from schemas.payment import PaymentCreate, PaymentRead, PaymentResult
from services.payment_service import process_mock_payment

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.post(
    "/mock",
    response_model=PaymentResult,
    status_code=status.HTTP_201_CREATED,
)
def mock_payment(
    data: PaymentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Мок-оплата: сразу помечает платёж как оплаченный и выдаёт абонемент."""
    payment, membership = process_mock_payment(
        db=db,
        user=user,
        membership_type=data.membership_type,
    )
    return {"payment": payment, "membership": membership}


@router.get("/me", response_model=list[PaymentRead])
def my_payments(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """История платежей текущего пользователя."""
    return (
        db.query(Payment)
        .filter(Payment.user_id == user.id)
        .order_by(Payment.created_at.desc())
        .all()
    )


@router.get("", response_model=list[PaymentRead])
def all_payments(
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    """Все платежи. Только для админа."""
    return db.query(Payment).order_by(Payment.created_at.desc()).all()
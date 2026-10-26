from datetime import date, timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.membership import Membership
from models.payment import Payment
from models.user import User

PRICES = {
    "month": 3000,
    "year": 30000,
    "single": 500,
}

DURATIONS = {
    "month": 30,
    "year": 365,
    "single": 1,
}


def process_mock_payment(
    db: Session,
    user: User,
    membership_type: str,
) -> tuple[Payment, Membership]:
    """Мок-оплата: создаёт платёж и сразу выдаёт абонемент."""
    if membership_type not in PRICES:
        raise HTTPException(400, "Неизвестный тип абонемента")

    amount = PRICES[membership_type]
    days = DURATIONS[membership_type]

    payment = Payment(
        user_id=user.id,
        amount=amount,
        status="paid",
        method="mock",
        membership_type=membership_type,
    )
    db.add(payment)
    db.flush()

    membership = Membership(
        user_id=user.id,
        type=membership_type,
        start_date=date.today(),
        end_date=date.today() + timedelta(days=days),
        visits_left=1 if membership_type == "single" else None,
        status="active",
    )
    db.add(membership)
    db.commit()
    db.refresh(payment)
    db.refresh(membership)

    return payment, membership
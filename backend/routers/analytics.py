from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List

from core import require_role
from database import get_db
from models.user import User
from models.role import Role
from models.membership import Membership
from models.payment import Payment
from models.booking import Booking
from models.fitness_class import FitnessClass
from schemas.admin import AnalyticsSummary, PopularClass

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def get_summary(
        db: Session = Depends(get_db),
        _: User = Depends(require_role("admin")),
):
    """Сводная аналитика для дашборда владельца."""
    total_clients = db.query(User).join(Role).filter(Role.name == "client").count()
    active_memberships = db.query(Membership).filter(Membership.status == "active").count()

    revenue = db.query(func.sum(Payment.amount)).filter(Payment.status == "paid").scalar()
    total_revenue = revenue if revenue else 0.00

    week_ago = datetime.now() - timedelta(days=7)
    bookings_this_week = db.query(Booking).filter(Booking.created_at >= week_ago).count()

    return AnalyticsSummary(
        total_clients=total_clients,
        active_memberships=active_memberships,
        total_revenue=total_revenue,
        bookings_this_week=bookings_this_week
    )


@router.get("/popular-classes", response_model=List[PopularClass])
def get_popular_classes(
        db: Session = Depends(get_db),
        _: User = Depends(require_role("admin")),
):
    """Топ-5 популярных занятий."""
    results = (
        db.query(FitnessClass.id, FitnessClass.title, func.count(Booking.id).label("bookings_count"))
        .join(Booking, FitnessClass.id == Booking.class_id)
        .filter(Booking.status.in_(["booked", "attended"]))
        .group_by(FitnessClass.id, FitnessClass.title)
        .order_by(func.count(Booking.id).desc())
        .limit(5)
        .all()
    )
    return [PopularClass(class_id=r.id, title=r.title, bookings_count=r.bookings_count) for r in results]
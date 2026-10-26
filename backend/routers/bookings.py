from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from core import get_current_user, require_role
from database import get_db
from models.booking import Booking
from models.user import User
from schemas.booking import BookingCreate, BookingRead, BookingWithClass
from backend.services import book_class, cancel_booking
from models.membership import Membership
from datetime import datetime

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return book_class(db=db, user=user, class_id=data.class_id)


@router.get("/me", response_model=list[BookingWithClass])
def my_bookings(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    rows = (
        db.query(Booking)
        .filter(Booking.user_id == user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [
        {
            "id": b.id,
            "user_id": b.user_id,
            "class_id": b.class_id,
            "status": b.status,
            "created_at": b.created_at,
            "class_title": b.fitness_class.title,
            "class_start_time": b.fitness_class.start_time,
            "class_hall": b.fitness_class.hall,
        }
        for b in rows
    ]


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel(
    booking_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cancel_booking(db=db, user=user, booking_id=booking_id)


@router.get("/class/{class_id}", response_model=list[BookingRead])
def class_bookings(
    class_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin", "trainer")),
):
    return (
        db.query(Booking)
        .filter(Booking.class_id == class_id, Booking.status == "booked")
        .all()
    )


@router.patch("/{booking_id}/attend", response_model=BookingRead)
def mark_attendance(
        booking_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(require_role("trainer", "admin")),
):
    """Тренер отмечает клиента как посетившего занятие."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Запись не найдена")

    # Тренер может отмечать только свои занятия
    if current_user.role.name == "trainer" and booking.fitness_class.trainer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Это не ваше занятие")

    if booking.status == "attended":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Клиент уже отмечен")
    if booking.status == "cancelled":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Запись отменена")

    # 1. Меняем статус записи
    booking.status = "attended"

    # 2. Списываем визит с абонемента (если он не безлимитный)
    membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == booking.user_id,
            Membership.status == "active",
        )
        .order_by(Membership.end_date.desc())
        .first()
    )

    if membership and membership.visits_left is not None:
        if membership.visits_left > 0:
            membership.visits_left -= 1

    db.commit()
    db.refresh(booking)
    return booking
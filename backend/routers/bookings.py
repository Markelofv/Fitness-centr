from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from core import get_current_user, require_role
from database import get_db
from models.booking import Booking
from models.user import User
from schemas.booking import BookingCreate, BookingRead, BookingWithClass
from backend.services import book_class, cancel_booking

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
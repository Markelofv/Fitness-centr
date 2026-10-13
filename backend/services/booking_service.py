from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from models.booking import Booking
from models.fitness_class import FitnessClass
from models.user import User


def book_class(db: Session, user: User, class_id: int) -> Booking:
    fc = db.query(FitnessClass).filter(FitnessClass.id == class_id).first()
    if not fc:
        raise HTTPException(404, "Занятие не найдено")

    existing = (
        db.query(Booking)
        .filter(
            Booking.user_id == user.id,
            Booking.class_id == class_id,
            Booking.status == "booked",
        )
        .first()
    )
    if existing:
        raise HTTPException(409, "Вы уже записаны на это занятие")

    booked_count = (
        db.query(Booking)
        .filter(Booking.class_id == class_id, Booking.status == "booked")
        .count()
    )
    if booked_count >= fc.capacity:
        raise HTTPException(409, "Свободных мест нет")

    booking = Booking(user_id=user.id, class_id=class_id, status="booked")
    db.add(booking)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Запись уже существует")
    db.refresh(booking)
    return booking


def cancel_booking(db: Session, user: User, booking_id: int) -> None:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(404, "Запись не найдена")

    if booking.user_id != user.id and user.role != "admin":
        raise HTTPException(403, "Нельзя отменить чужую запись")

    if booking.status == "cancelled":
        raise HTTPException(409, "Запись уже отменена")

    booking.status = "cancelled"
    db.commit()
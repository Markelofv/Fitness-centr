from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from models.booking import Booking
from models.fitness_class import FitnessClass
from models.membership import Membership
from models.user import User


def get_active_membership(db: Session, user_id: int) -> Membership:
    """Возвращает активный абонемент пользователя."""
    return (
        db.query(Membership)
        .filter(
            Membership.user_id == user_id,
            Membership.status == "active",
        )
        .order_by(Membership.end_date.desc())
        .first()
    )


def book_class(db: Session, user: User, class_id: int) -> Booking:
    fc = db.query(FitnessClass).filter(FitnessClass.id == class_id).first()
    if not fc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Занятие не найдено")

    # 1. Проверка абонемента
    membership = get_active_membership(db, user.id)
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет активного абонемента",
        )

    # Если абонемент не безлимитный (visits_left не None) и визиты кончились
    if membership.visits_left is not None and membership.visits_left <= 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="На абонементе закончились занятия",
        )

    # 2. Проверка дублей
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
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Вы уже записаны на это занятие")

    # 3. Проверка свободных мест
    booked_count = (
        db.query(Booking)
        .filter(Booking.class_id == class_id, Booking.status == "booked")
        .count()
    )
    if booked_count >= fc.capacity:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Свободных мест нет")

    # 4. Создание записи
    booking = Booking(user_id=user.id, class_id=class_id, status="booked")
    db.add(booking)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Запись уже существует")

    db.refresh(booking)
    return booking


def cancel_booking(db: Session, user: User, booking_id: int) -> None:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Запись не найдена")

    # Проверка прав
    if booking.user_id != user.id and user.role.name != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нельзя отменить чужую запись")

    if booking.status == "cancelled":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Запись уже отменена")

    # 1. Проверка правила 2 часов (только для клиентов, админ может отменять всегда)
    if user.role.name == "client":
        time_left = booking.fitness_class.start_time - datetime.now()
        if time_left < timedelta(hours=2):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Отмена записи возможна не позднее чем за 2 часа до начала",
            )

    # 2. Возврат визита на абонемент (если абонемент не безлимитный)

    membership = get_active_membership(db, booking.user_id)
    if membership and membership.visits_left is not None:
        membership.visits_left += 1

    # 3. Отмена брони
    booking.status = "cancelled"
    db.commit()
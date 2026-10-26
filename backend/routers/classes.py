from datetime import date, datetime, time

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from services.class_service import check_schedule_conflicts
from core import get_current_user, require_role
from database import get_db
from schemas import ClassCreate, ClassRead, ClassUpdate
from models import FitnessClass, User

router = APIRouter(prefix="/api/classes", tags=["classes"])


@router.get("", response_model=list[ClassRead])
def list_classes(
    date_from: date | None = Query(None, description="Фильтр: с какой даты"),
    date_to: date | None = Query(None, description="Фильтр: по какую дату"),
    hall: str | None = Query(None, description="Фильтр по залу"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Список занятий с фильтрами. Доступен любому авторизованному."""
    query = db.query(FitnessClass)

    if date_from:
        query = query.filter(FitnessClass.start_time >= datetime.combine(date_from, time.min))
    if date_to:
        query = query.filter(FitnessClass.start_time <= datetime.combine(date_to, time.max))
    if hall:
        query = query.filter(FitnessClass.hall == hall)

    return query.order_by(FitnessClass.start_time).all()


@router.get("/{class_id}", response_model=ClassRead)
def get_class(
    class_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Детали занятия."""
    fc = db.query(FitnessClass).filter(FitnessClass.id == class_id).first()
    if not fc:
        raise HTTPException(404, "Занятие не найдено")
    return fc


@router.post("", response_model=ClassRead, status_code=status.HTTP_201_CREATED)
def create_class(
    data: ClassCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin", "trainer")),
):
    # Проверка, что пользователь-тренер существует
    trainer = db.query(User).filter(User.id == data.trainer_id).first()
    if not trainer:
        raise HTTPException(404, "Тренер не найден")

    # ПРОВЕРКА КОНФЛИКТОВ
    check_schedule_conflicts(
        db=db,
        hall=data.hall,
        trainer_id=data.trainer_id,
        start_time=data.start_time,
        duration_min=data.duration_min,
    )

    fc = FitnessClass(**data.model_dump())
    db.add(fc)
    db.commit()
    db.refresh(fc)
    return fc


@router.patch("/{class_id}", response_model=ClassRead)
def update_class(
    class_id: int,
    data: ClassUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin", "trainer")),
):
    fc = db.query(FitnessClass).filter(FitnessClass.id == class_id).first()
    if not fc:
        raise HTTPException(404, "Занятие не найдено")

    update_data = data.model_dump(exclude_unset=True)

    # Если меняется время, зал или тренер — проверяем конфликты
    new_hall = update_data.get("hall", fc.hall)
    new_trainer = update_data.get("trainer_id", fc.trainer_id)
    new_time = update_data.get("start_time", fc.start_time)
    new_duration = update_data.get("duration_min", fc.duration_min)

    if any(k in update_data for k in ["hall", "trainer_id", "start_time", "duration_min"]):
        check_schedule_conflicts(
            db=db,
            hall=new_hall,
            trainer_id=new_trainer,
            start_time=new_time,
            duration_min=new_duration,
            exclude_class_id=fc.id, # <-- важно! исключаем текущее занятие
        )

    for field, value in update_data.items():
        setattr(fc, field, value)

    db.commit()
    db.refresh(fc)
    return fc


@router.delete("/{class_id}", status_code=204)
def delete_class(
    class_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin")),
):
    """Удалить занятие. Только admin."""
    fc = db.query(FitnessClass).filter(FitnessClass.id == class_id).first()
    if not fc:
        raise HTTPException(404, "Занятие не найдено")

    db.delete(fc)
    db.commit()

@router.get("/trainer/me", response_model=list[ClassRead])
def trainer_classes(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("trainer", "admin")),
):
    """Возвращает расписание занятий текущего тренера."""
    return (
        db.query(FitnessClass)
        .filter(FitnessClass.trainer_id == current_user.id)
        .order_by(FitnessClass.start_time)
        .all()
    )
from datetime import date, datetime, time

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

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


@router.post("", response_model=ClassRead, status_code=201)
def create_class(
    data: ClassCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin", "trainer")),
):
    """Создать занятие. Только admin или trainer."""
    # Проверка, что тренер существует и является тренером/админом
    trainer = db.query(User).filter(User.id == data.trainer_id).first()
    if not trainer:
        raise HTTPException(404, "Тренер не найден")
    if trainer.role not in ("trainer", "admin"):
        raise HTTPException(400, "Указанный пользователь не является тренером")

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
    user: User = Depends(require_role("admin", "trainer")),
):
    """Изменить занятие. Только admin или trainer."""
    fc = db.query(FitnessClass).filter(FitnessClass.id == class_id).first()
    if not fc:
        raise HTTPException(404, "Занятие не найдено")

    update_data = data.model_dump(exclude_unset=True)
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
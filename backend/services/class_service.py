from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models.fitness_class import FitnessClass
from fastapi import HTTPException, status

def check_schedule_conflicts(
    db: Session,
    hall: str,
    trainer_id: int,
    start_time: datetime,
    duration_min: int,
    exclude_class_id: int | None = None
):

    end_time = start_time + timedelta(minutes=duration_min)

    query = db.query(FitnessClass).filter(
        FitnessClass.start_time < end_time,
        (FitnessClass.start_time + (FitnessClass.duration_min * timedelta(minutes=1))) > start_time
    )

    if exclude_class_id:
        query = query.filter(FitnessClass.id != exclude_class_id)

    conflicts = query.all()

    for c in conflicts:
        if c.hall == hall:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Конфликт: зал «{hall}» занят в это время (занятие «{c.title}»)"
            )
        if c.trainer_id == trainer_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Конфликт: тренер уже ведет занятие «{c.title}» в это время"
            )
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ClassCreate(BaseModel):
    title: str
    description: str | None = None
    trainer_id: int
    start_time: datetime
    duration_min: int = Field(60, ge=15, le=300)
    capacity: int = Field(20, ge=1, le=200)
    hall: str


class ClassUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    trainer_id: int | None = None
    start_time: datetime | None = None
    duration_min: int | None = Field(None, ge=15, le=300)
    capacity: int | None = Field(None, ge=1, le=200)
    hall: str | None = None


class ClassRead(BaseModel):
    id: int
    title: str
    description: str | None
    trainer_id: int
    start_time: datetime
    duration_min: int
    capacity: int
    hall: str

    model_config = ConfigDict(from_attributes=True)
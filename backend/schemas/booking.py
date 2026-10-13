from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BookingCreate(BaseModel):
    class_id: int = Field(..., gt=0)


class BookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    class_id: int
    status: str
    created_at: datetime


class BookingWithClass(BookingRead):
    class_title: str
    class_start_time: datetime
    class_hall: str
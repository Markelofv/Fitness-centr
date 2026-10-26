from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class MembershipRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    type: str
    start_date: date
    end_date: date
    visits_left: int | None
    status: str
    created_at: datetime


class MembershipCreate(BaseModel):
    user_id: int
    type: str
    days: int
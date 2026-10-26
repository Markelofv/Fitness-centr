from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List

from schemas.membership import MembershipRead
from schemas.payment import PaymentRead
from schemas.booking import BookingWithClass  # Используем расширенную схему для красоты


class ClientRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    phone: str | None
    is_active: bool
    created_at: datetime


class ClientDetail(ClientRead):
    memberships: List[MembershipRead] = []
    payments: List[PaymentRead] = []
    bookings: List[BookingWithClass] = []


class AnalyticsSummary(BaseModel):
    total_clients: int
    active_memberships: int
    total_revenue: Decimal
    bookings_this_week: int


class PopularClass(BaseModel):
    class_id: int
    title: str
    bookings_count: int
from datetime import datetime
from decimal import Decimal
from schemas.membership import MembershipRead
from pydantic import BaseModel, ConfigDict, Field


class PaymentCreate(BaseModel):
    membership_type: str = Field(..., pattern="^(month|year|single)$")


class PaymentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    amount: Decimal
    status: str
    method: str
    membership_type: str
    created_at: datetime


class PaymentResult(BaseModel):
    payment: PaymentRead
    membership: MembershipRead
from sqlalchemy import Column, Integer, String, Numeric
from database import Base

class MembershipType(Base):
    __tablename__ = "membership_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)           # Например: "Абонемент на 15 дней"
    duration_days = Column(Integer, nullable=False)      # 15, 30, 365
    price = Column(Numeric(10, 2), nullable=False)       # 1500.00
    visits_limit = Column(Integer, nullable=True)        # None = безлимит, или число (например, 8)

    def __repr__(self):
        return f"<MembershipType {self.name}>"
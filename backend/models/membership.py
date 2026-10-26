from datetime import date, datetime

from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    type = Column(String(20), nullable=False)         # month / year / single
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    visits_left = Column(Integer, nullable=True)       # None = безлимит
    status = Column(String(20), nullable=False, default="active")  # active / frozen / expired
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id])

    def __repr__(self):
        return f"<Membership user={self.user_id} {self.type} ({self.status})>"
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class FitnessClass(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    trainer_id = Column(ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, nullable=False, index=True)
    duration_min = Column(Integer, nullable=False, default=60)
    capacity = Column(Integer, nullable=False, default=20)
    hall = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    trainer = relationship("User", foreign_keys=[trainer_id])

    def __repr__(self):
        return f"<FitnessClass {self.title} @ {self.start_time}>"
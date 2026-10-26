from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)  # client, trainer, admin
    description = Column(String(255), nullable=True)

    # Связь с пользователями (один ко многим)
    users = relationship("User", back_populates="role")

    def __repr__(self):
        return f"<Role {self.name}>"
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="employee")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    feedbacks = relationship(
        "Feedback",
        back_populates="employee",
        foreign_keys="Feedback.employee_id"
    )

    responses = relationship(
        "ManagerResponse",
        back_populates="manager",
        foreign_keys="ManagerResponse.manager_id"
    )


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)

    status = Column(
        String(30),
        nullable=False,
        default="Pending"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    employee = relationship(
        "User",
        back_populates="feedbacks",
        foreign_keys=[employee_id]
    )

    responses = relationship(
        "ManagerResponse",
        back_populates="feedback"
    )


class ManagerResponse(Base):
    __tablename__ = "manager_responses"

    id = Column(Integer, primary_key=True, index=True)

    feedback_id = Column(
        Integer,
        ForeignKey("feedback.id"),
        nullable=False
    )

    manager_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    response_text = Column(Text, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    feedback = relationship(
        "Feedback",
        back_populates="responses"
    )

    manager = relationship(
        "User",
        back_populates="responses",
        foreign_keys=[manager_id]
    )
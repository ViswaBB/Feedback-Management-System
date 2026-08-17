from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

from enum import Enum



class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "employee"


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str




class FeedbackCreate(BaseModel):
    title: str
    description: str
    category: str

class FeedbackStatus(str, Enum):
    PENDING = "Pending"
    UNDER_REVIEW = "Under Review"
    RESPONDED = "Responded"
    RESOLVED = "Resolved"


class ManagerResponseResponse(BaseModel):
    id: int
    manager_id: int
    response_text: str
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackResponse(BaseModel):
    id: int
    employee_id: int
    title: str
    description: str
    category: str
    status: str
    created_at: datetime
    updated_at: datetime

    responses: list[ManagerResponseResponse] = []

    class Config:
        from_attributes = True

class FeedbackUpdate(BaseModel):
    title: str
    description: str
    category: str



class ManagerResponseCreate(BaseModel):
    response_text: str





class FeedbackDetailResponse(BaseModel):
    id: int
    employee_id: int
    title: str
    description: str
    category: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    responses: list[ManagerResponseResponse] = []

    model_config = ConfigDict(from_attributes=True)
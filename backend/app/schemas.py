from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


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


class FeedbackResponse(BaseModel):
    id: int
    employee_id: int
    title: str
    description: str
    category: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ManagerResponseCreate(BaseModel):
    response_text: str
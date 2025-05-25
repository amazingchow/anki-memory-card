# -*- coding: utf-8 -*-
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    nickname: Optional[str] = None
    gender: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    nickname: Optional[str] = None
    gender: Optional[str] = None


class User(UserBase):
    id: int
    email: EmailStr
    nickname: Optional[str] = None
    gender: Optional[str] = None
    usage_count: int
    is_premium: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

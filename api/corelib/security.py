# -*- coding: utf-8 -*-
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import exceptions as jose_exceptions
from jose import jwt
from passlib.context import CryptContext

from corelib.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(
    password: str
) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=86400)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def parse_token(token: str) -> bool | dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jose_exceptions.JWTError:
        return False

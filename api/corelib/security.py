# -*- coding: utf-8 -*-
import base64
from datetime import datetime, timedelta, timezone
from typing import Optional

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from jose import exceptions as jose_exceptions
from jose import jwt
from loguru import logger as loguru_logger
from passlib.context import CryptContext

from corelib.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# AES encryption key and IV
AES_KEY = settings.SECRET_KEY[:32].encode()  # Use first 32 bytes of SECRET_KEY
AES_IV = bytes([0x1F, 0x2E, 0x3D, 0x4C, 0x5B, 0x6A, 0x79, 0x88, 0x97, 0xA6, 0xB5, 0xC4, 0xD3, 0xE2, 0xF1, 0x00])  # Complex fixed IV


def encrypt_aes(
    text: str
) -> str:
    """
    Encrypt text using AES encryption.
    
    Args:
        text: Text to encrypt
        
    Returns:
        str: Base64 encoded encrypted text
    """
    cipher = AES.new(AES_KEY, AES.MODE_CBC, AES_IV)
    padded_text = pad(text.encode(), AES.block_size)
    encrypted_text = cipher.encrypt(padded_text)
    return base64.b64encode(encrypted_text).decode()


def decrypt_aes(
    encrypted_text: str
) -> str:
    """
    Decrypt AES encrypted text.
    
    Args:
        encrypted_text: Base64 encoded encrypted text
        
    Returns:
        str: Decrypted text
    """
    encrypted_bytes = base64.b64decode(encrypted_text)
    cipher = AES.new(AES_KEY, AES.MODE_CBC, AES_IV)
    decrypted_padded = cipher.decrypt(encrypted_bytes)
    return unpad(decrypted_padded, AES.block_size).decode()


def get_password_hash(
    password: str
) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_token(
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


def parse_token(
    token: str
) -> bool | dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jose_exceptions.JWTError as exc:
        loguru_logger.error(f"Failed to parse token: {str(exc)}")
        return False

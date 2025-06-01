# -*- coding: utf-8 -*-
import json
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordRequestForm
from loguru import logger as loguru_logger
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_active_user
from corelib.config import settings
from corelib.db import get_sqlite_db
from corelib.security import (
    create_token,
    decrypt_aes,
    get_password_hash,
    parse_token,
    verify_password
)
from corelib.tasks.email_task_api import (
    send_activation_email_task,
    send_password_reset_email_task
)
from corelib.tasks.helper import new_task_params
from crud.crud_user import (
    cancel_subscription,
    create_user,
    delete_user,
    get_user_by_email,
    update_user_profile
)
from models.user import User
from schemas.user import PasswordResetRequest
from schemas.user import User as UserSchema
from schemas.user import UserCreate, UserUpdate

router = APIRouter()


@router.post("/login")
async def h_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_sqlite_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = await get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email before logging in",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "user_id": user.id
    }


@router.post("/register", response_model=UserSchema)
async def h_create_user_endpoint(
    user: UserCreate,
    db: AsyncSession = Depends(get_sqlite_db)
):
    """
    Create new user.
    """
    db_user = await get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create user
    new_user = await create_user(db=db, user=user)
    
    # Send activation email
    _task_id, task_params = new_task_params(
        email=user.email
    )
    task = send_activation_email_task.apply_async(
        (task_params,),
        task_id=_task_id,
        countdown=3,
        expires=3600
    )
    task_id = task.id
    loguru_logger.info(f"Activation email sent to {user.email} with task_id: {task_id}")
    
    return new_user


@router.get("/activate")
async def h_activate_user(
    token: str = Query(..., description="The activation token"),
    db: AsyncSession = Depends(get_sqlite_db)
):
    """
    Activate user account using encrypted token.
    """
    try:
        # Decrypt the token to get the email
        data = json.loads(decrypt_aes(token))
        email = data['email']
        expires_at = data['expires_at']
        if datetime.now(timezone.utc) > datetime.fromisoformat(expires_at):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Activation token expired"
            )
        
        # Get user by email
        user = await get_user_by_email(db, email=email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update user's verified status
        user.is_verified = True
        await db.commit()
        
        return {"message": "Account activated successfully"}
    except Exception as exc:
        loguru_logger.error(f"Failed to activate user: {exc}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired activation token"
        )


@router.get("/profile", response_model=UserSchema)
def h_get_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user profile.
    """
    return current_user


@router.patch("/profile", response_model=UserSchema)
async def h_update_user_profile_endpoint(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db)
):
    """
    Update user profile.
    """
    return await update_user_profile(db=db, user_id=current_user.id, user_update=user_update)


@router.post("/cancel-subscription", response_model=UserSchema)
async def h_cancel_subscription_endpoint(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db)
):
    """
    Cancel user subscription.
    """
    return await cancel_subscription(db=db, user_id=current_user.id)


@router.delete("/account", response_model=UserSchema)
async def h_delete_user_account(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db)
):
    """
    Delete user account.
    """
    return await delete_user(db=db, user_id=current_user.id)


@router.post("/request-password-reset")
async def request_password_reset(
    email: EmailStr = Query(..., description="The email address to reset password for"),
    db: AsyncSession = Depends(get_sqlite_db)
):
    """
    Request a password reset email.
    """
    user = await get_user_by_email(db, email=email)
    if not user:
        # Don't reveal that the email doesn't exist
        return {"message": "If your email is registered, you will receive a password reset link."}
    # Generate reset token
    reset_token = create_token(
        data={"sub": user.email, "type": "password_reset"},
        expires_delta=timedelta(hours=1)
    )
    # Send reset email
    _task_id, task_params = new_task_params(
        email=user.email,
        reset_token=reset_token
    )
    task = send_password_reset_email_task.apply_async(
        (task_params,),
        task_id=_task_id,
        countdown=3,
        expires=3600
    )
    task_id = task.id
    loguru_logger.info(f"Password reset email sent to {user.email} with task_id: {task_id}")
    
    return {"message": "If your email is registered, you will receive a password reset link."}


@router.post("/reset-password")
async def reset_password(
    password_reset: PasswordResetRequest,
    db: AsyncSession = Depends(get_sqlite_db)
):
    """
    Reset password using the reset token.
    """
    # Verify token
    payload = parse_token(password_reset.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    if payload.get("type") != "password_reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token"
        )

    # Get user
    user = await get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.hashed_password = get_password_hash(password_reset.new_password)
    await db.commit()

    return {"message": "Password has been reset successfully."}

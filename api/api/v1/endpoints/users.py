from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from api.deps import get_current_active_user
from core.config import settings
from core.db import get_db
from core.security import create_access_token, verify_password
from crud.crud_user import (
    cancel_subscription,
    create_user,
    delete_user,
    get_user_by_email,
    update_user_profile
)
from models.user import User
from schemas.user import User as UserSchema
from schemas.user import UserCreate, UserUpdate

router = APIRouter()


@router.post("/login")
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/register", response_model=UserSchema)
def create_user_endpoint(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Create new user.
    """
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return create_user(db=db, user=user)


@router.get("/profile", response_model=UserSchema)
def get_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user profile.
    """
    return current_user


@router.patch("/profile", response_model=UserSchema)
def update_user_profile_endpoint(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update user profile.
    """
    return update_user_profile(db=db, user_id=current_user.id, user_update=user_update)


@router.post("/cancel-subscription", response_model=UserSchema)
def cancel_subscription_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Cancel user subscription.
    """
    return cancel_subscription(db=db, user_id=current_user.id)


@router.delete("/account", response_model=UserSchema)
def delete_user_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete user account.
    """
    return delete_user(db=db, user_id=current_user.id)

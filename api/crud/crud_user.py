from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from corelib.security import get_password_hash
from models.user import User
from schemas.user import UserCreate, UserUpdate


async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).filter(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalar_one_or_none()


async def get_users(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(User).offset(skip).limit(limit))
    return result.scalars().all()


async def create_user(db: AsyncSession, user: UserCreate):
    try:
        hashed_password = get_password_hash(user.password)
        db_user = User(email=user.email, hashed_password=hashed_password)
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except Exception as exc:
        await db.rollback()
        raise exc


async def update_user_profile(db: AsyncSession, user_id: int, user_update: UserUpdate):
    try:
        db_user = await get_user(db, user_id)
        if db_user:
            update_data = user_update.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_user, field, value)
            await db.commit()
            await db.refresh(db_user)
        return db_user
    except Exception as exc:
        await db.rollback()
        raise exc


async def cancel_subscription(db: AsyncSession, user_id: int):
    try:
        db_user = await get_user(db, user_id)
        if db_user:
            db_user.is_premium = False
            await db.commit()
            await db.refresh(db_user)
        return db_user
    except Exception as exc:
        await db.rollback()
        raise exc


async def delete_user(db: AsyncSession, user_id: int):
    try:
        db_user = await get_user(db, user_id)
        if db_user:
            await db.delete(db_user)
            await db.commit()
        return db_user
    except Exception as exc:
        await db.rollback()
        raise exc

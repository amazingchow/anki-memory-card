# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_active_user
from core.db import get_sqlite_db
from crud.crud_statistic import get_statistics
from models.user import User
from schemas.statistics import Statistics

router = APIRouter()


@router.get("/", response_model=Statistics)
async def get_user_statistics(
    db: AsyncSession = Depends(get_sqlite_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get user statistics.
    """
    return await get_statistics(db=db, user_id=current_user.id)

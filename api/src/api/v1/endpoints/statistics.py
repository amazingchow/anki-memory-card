from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_active_user
from corelib.db import get_sqlite_db
from crud.crud_statistic import get_statistics
from models.user import User
from schemas.statistics import Statistics

router = APIRouter()


@router.get("/", response_model=Statistics)
async def h_get_user_statistics(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db),
):
    """Get user statistics."""
    return await get_statistics(db=db, user_id=current_user.id)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.deps import get_current_active_user
from core.db import get_db
from crud.crud_statistic import get_statistics
from models.user import User
from schemas.statistics import Statistics

router = APIRouter()


@router.get("/", response_model=Statistics)
def get_statistics_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get user statistics.
    """
    return get_statistics(db=db, user_id=current_user.id)

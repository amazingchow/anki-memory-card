from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from api import deps
from corelib.db import get_sqlite_db
from crud.curd_notification_setting import (
    create_notification_settings,
    get_notification_settings,
    update_notification_settings,
)
from schemas.notification_settings import (
    NotificationSettings,
    NotificationSettingsCreate,
    NotificationSettingsUpdate,
)

router = APIRouter()


@router.get("/notification-settings", response_model=NotificationSettings)
async def h_get_notification_settings(
    current_user=Depends(deps.get_current_user),
    db: AsyncSession = Depends(get_sqlite_db),
) -> Any:
    """Get current user's notification settings."""
    settings = await get_notification_settings(db, current_user.id)
    if not settings:
        # 如果用户没有通知设置，创建默认设置
        settings = await create_notification_settings(
            db,
            current_user.id,
            NotificationSettingsCreate(
                notification_types={
                    "new_cards": True,
                    "study_reminders": True,
                    "achievement_unlocked": True,
                    "system_updates": False,
                }
            ),
        )
    return settings


@router.patch("/notification-settings", response_model=NotificationSettings)
async def h_update_notification_settings(
    *,
    settings_in: NotificationSettingsUpdate,
    current_user=Depends(deps.get_current_user),
    db: AsyncSession = Depends(get_sqlite_db),
) -> Any:
    """Update current user's notification settings."""
    settings = await get_notification_settings(db, current_user.id)
    if not settings:
        raise HTTPException(status_code=404, detail="Notification settings not found")
    return await update_notification_settings(db, current_user.id, settings_in)

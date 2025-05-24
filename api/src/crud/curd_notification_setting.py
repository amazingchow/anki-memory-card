from datetime import time
from typing import Any, Dict, Optional

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from models.notification_settings import NotificationSettings
from schemas.notification_settings import (
    NotificationSettingsCreate,
    NotificationSettingsUpdate,
)


def _format_notification_settings(db_settings: NotificationSettings) -> Dict[str, Any]:
    """Helper function to format notification settings response."""
    return {
        "id": db_settings.id,
        "user_id": db_settings.user_id,
        "email_notifications": db_settings.email_notifications,
        "push_notifications": db_settings.push_notifications,
        "notification_types": {
            "new_cards": db_settings.new_cards_notification,
            "study_reminders": db_settings.study_reminders_notification,
            "achievement_unlocked": db_settings.achievement_unlocked_notification,
            "system_updates": db_settings.system_updates_notification,
        },
        "study_reminder_time": db_settings.study_reminder_time,
    }


def _validate_time(time_value: Any) -> Optional[time]:
    """Validate and convert input to Python time object."""
    if time_value is None:
        return None

    if isinstance(time_value, time):
        return time_value

    if isinstance(time_value, str):
        try:
            # Try to parse time string in format "HH:MM" or "HH:MM:SS"
            parts = time_value.split(":")
            if len(parts) == 2:
                hour, minute = map(int, parts)
                return time(hour=hour, minute=minute)
            elif len(parts) == 3:
                hour, minute, second = map(int, parts)
                return time(hour=hour, minute=minute, second=second)
        except (ValueError, TypeError):
            pass

    raise ValueError(
        "Invalid time format. Expected 'HH:MM' or 'HH:MM:SS' string or time object"
    )


async def get_notification_settings(
    db: AsyncSession, user_id: int
) -> Optional[Dict[str, Any]]:
    try:
        stmt = select(NotificationSettings).where(
            NotificationSettings.user_id == user_id
        )
        result = await db.execute(stmt)
        db_settings = result.scalar_one_or_none()

        if not db_settings:
            return None
        return _format_notification_settings(db_settings)
    except SQLAlchemyError as e:
        # Log the error here
        raise Exception(
            f"Database error while fetching notification settings: {str(e)}"
        )


async def create_notification_settings(
    db: AsyncSession, user_id: int, settings: NotificationSettingsCreate
) -> Dict[str, Any]:
    try:
        # Validate and convert study_reminder_time
        reminder_time = _validate_time(settings.study_reminder_time)

        db_settings = NotificationSettings(
            user_id=user_id,
            email_notifications=settings.email_notifications,
            push_notifications=settings.push_notifications,
            new_cards_notification=settings.notification_types.new_cards,
            study_reminders_notification=settings.notification_types.study_reminders,
            achievement_unlocked_notification=settings.notification_types.achievement_unlocked,
            system_updates_notification=settings.notification_types.system_updates,
            study_reminder_time=reminder_time,
        )
        db.add(db_settings)
        await db.commit()
        await db.refresh(db_settings)
        return _format_notification_settings(db_settings)
    except ValueError as e:
        raise Exception(f"Invalid time format: {str(e)}")
    except SQLAlchemyError as e:
        await db.rollback()
        # Log the error here
        raise Exception(
            f"Database error while creating notification settings: {str(e)}"
        )


async def update_notification_settings(
    db: AsyncSession, user_id: int, settings: NotificationSettingsUpdate
) -> Optional[Dict[str, Any]]:
    try:
        stmt = select(NotificationSettings).where(
            NotificationSettings.user_id == user_id
        )
        result = await db.execute(stmt)
        db_settings = result.scalar_one_or_none()

        if not db_settings:
            return None

        update_data = settings.dict(exclude_unset=True)

        # Handle nested notification_types
        if "notification_types" in update_data:
            notification_types = update_data.pop("notification_types")
            if notification_types:
                db_settings.new_cards_notification = notification_types.get(
                    "new_cards", db_settings.new_cards_notification
                )
                db_settings.study_reminders_notification = notification_types.get(
                    "study_reminders", db_settings.study_reminders_notification
                )
                db_settings.achievement_unlocked_notification = notification_types.get(
                    "achievement_unlocked",
                    db_settings.achievement_unlocked_notification,
                )
                db_settings.system_updates_notification = notification_types.get(
                    "system_updates", db_settings.system_updates_notification
                )

        # Update other fields
        for field, value in update_data.items():
            if field == "study_reminder_time":
                value = _validate_time(value)
            setattr(db_settings, field, value)

        await db.commit()
        await db.refresh(db_settings)
        return _format_notification_settings(db_settings)
    except ValueError as e:
        raise Exception(f"Invalid time format: {str(e)}")
    except SQLAlchemyError as e:
        await db.rollback()
        # Log the error here
        raise Exception(
            f"Database error while updating notification settings: {str(e)}"
        )

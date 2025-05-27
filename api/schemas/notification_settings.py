# -*- coding: utf-8 -*-
from datetime import time
from typing import Optional

from pydantic import BaseModel


class NotificationTypes(BaseModel):
    new_cards: bool = True
    study_reminders: bool = True
    achievement_unlocked: bool = True
    system_updates: bool = False


class NotificationSettingsBase(BaseModel):
    email_notifications: bool = True
    push_notifications: bool = True
    notification_types: NotificationTypes
    study_reminder_time: time = "20:00"


class NotificationSettingsCreate(NotificationSettingsBase):
    pass


class NotificationSettingsUpdate(NotificationSettingsBase):
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    notification_types: Optional[NotificationTypes] = None
    study_reminder_time: Optional[time] = None


class NotificationSettings(NotificationSettingsBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# -*- coding: utf-8 -*-
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Time
# from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from models.base import Base


class NotificationSettings(Base):
    __tablename__ = "notification_settings"

    id = Column(Integer, primary_key=True, index=True, comment="通知设置ID")
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, comment="用户ID")
    email_notifications = Column(Boolean, default=True, comment="邮箱通知")
    push_notifications = Column(Boolean, default=True, comment="推送通知")
    new_cards_notification = Column(Boolean, default=True, comment="新卡片通知")
    study_reminders_notification = Column(Boolean, default=True, comment="学习提醒通知")
    achievement_unlocked_notification = Column(Boolean, default=True, comment="成就解锁通知")
    system_updates_notification = Column(Boolean, default=False, comment="系统更新通知")
    study_reminder_time = Column(Time, default="20:00", comment="学习提醒时间")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="创建时间")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), comment="更新时间")

    # user = relationship("User", back_populates="notification_settings")

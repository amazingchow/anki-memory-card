from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from models.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, comment="用户ID")
    email = Column(String, unique=True, index=True, comment="邮箱")
    hashed_password = Column(String, nullable=False, comment="密码")
    is_verified = Column(Boolean, default=False, comment="是否已验证邮箱")
    nickname = Column(String, default="Anki User", comment="昵称")
    gender = Column(String, default="female", comment="性别")
    usage_count = Column(Integer, default=0, comment="使用次数")
    is_premium = Column(Boolean, default=False, comment="是否为付费用户")
    is_active = Column(Boolean, default=True, comment="是否为活跃用户")
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), comment="创建时间"
    )
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), comment="更新时间"
    )

    cards = relationship("Card", back_populates="owner")

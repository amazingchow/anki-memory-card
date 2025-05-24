from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from models.base import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True, comment="卡片ID")
    word = Column(String, index=True, comment="单词")
    definition = Column(Text, nullable=False, comment="详细释义")
    us_phonetic_symbols = Column(String, default="", comment="英美音标")
    zh_definition = Column(Text, default="", comment="中文释义")
    example = Column(Text, default="", comment="英文例句")
    zh_example = Column(Text, default="", comment="中文例句")
    notes = Column(Text, default="", comment="笔记")
    pronunciation = Column(String, default="", comment="音频二进制数据")
    tags = Column(String, default="", comment="标签")
    next_review = Column(DateTime(timezone=True), comment="下次复习时间")
    review_count = Column(Integer, default=0, comment="复习次数")
    status = Column(
        String, default="learning", comment="学习状态"
    )  # learning, reviewing, mastered
    owner_id = Column(Integer, ForeignKey("users.id"), comment="用户ID")
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), comment="创建时间"
    )
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), comment="更新时间"
    )

    owner = relationship("User", back_populates="cards")
    reviews = relationship("Review", back_populates="card")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, comment="复习ID")
    card_id = Column(Integer, ForeignKey("cards.id"), comment="卡片ID")
    review_date = Column(
        DateTime(timezone=True), server_default=func.now(), comment="复习时间"
    )
    rating = Column(
        Integer, comment="复习评分"
    )  # 1-5 rating of how well the user remembered
    next_interval = Column(Integer, comment="下次复习间隔")  # days until next review

    card = relationship("Card", back_populates="reviews")

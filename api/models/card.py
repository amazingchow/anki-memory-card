from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from core.db import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, index=True)
    definition = Column(Text)
    example = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    next_review = Column(DateTime(timezone=True))
    review_count = Column(Integer, default=0)
    status = Column(String, default="learning")  # learning, reviewing, mastered
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="cards")
    reviews = relationship("Review", back_populates="card")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    card_id = Column(Integer, ForeignKey("cards.id"))
    review_date = Column(DateTime(timezone=True), server_default=func.now())
    rating = Column(Integer)  # 1-5 rating of how well the user remembered
    next_interval = Column(Integer)  # days until next review

    card = relationship("Card", back_populates="reviews")

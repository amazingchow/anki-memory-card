from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CardBase(BaseModel):
    word: str
    definition: str
    example: Optional[str] = None
    notes: Optional[str] = None


class CardCreate(CardBase):
    pass


class CardUpdate(BaseModel):
    word: Optional[str] = None
    definition: Optional[str] = None
    example: Optional[str] = None
    notes: Optional[str] = None


class Card(CardBase):
    id: int
    created_at: datetime
    next_review: datetime
    review_count: int
    status: str
    owner_id: int

    class Config:
        from_attributes = True


class ReviewCreate(BaseModel):
    card_id: int
    rating: int


class Review(BaseModel):
    id: int
    card_id: int
    review_date: datetime
    rating: int
    next_interval: int

    class Config:
        from_attributes = True

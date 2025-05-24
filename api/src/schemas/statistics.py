from typing import List

from pydantic import BaseModel


class Statistics(BaseModel):
    total_cards: int
    mastered_cards: int
    learning_cards: int
    reviewing_cards: int
    due_cards: int
    daily_reviews: List[dict]
    review_ratings: List[dict]
    card_status_trend: List[dict]

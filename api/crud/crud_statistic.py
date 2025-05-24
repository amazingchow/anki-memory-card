from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from models.card import Card, Review
from schemas.statistics import Statistics


def get_statistics(db: Session, user_id: int) -> Statistics:
    # Get total cards
    total_cards = db.query(func.count(Card.id)).filter(Card.owner_id == user_id).scalar()
    
    # Get cards by status
    mastered_cards = db.query(func.count(Card.id)).filter(
        Card.owner_id == user_id,
        Card.status == "mastered"
    ).scalar()
    
    learning_cards = db.query(func.count(Card.id)).filter(
        Card.owner_id == user_id,
        Card.status == "learning"
    ).scalar()
    
    reviewing_cards = db.query(func.count(Card.id)).filter(
        Card.owner_id == user_id,
        Card.status == "reviewing"
    ).scalar()
    
    # Get due cards
    due_cards = db.query(func.count(Card.id)).filter(
        Card.owner_id == user_id,
        Card.next_review <= datetime.now()
    ).scalar()
    
    # Get daily reviews for the last 30 days
    daily_reviews = []
    for i in range(29, -1, -1):
        date = datetime.now() - timedelta(days=i)
        count = db.query(func.count(Review.id)).filter(
            Review.card_id.in_(
                db.query(Card.id).filter(Card.owner_id == user_id)
            ),
            func.date(Review.review_date) == date.date()
        ).scalar()
        daily_reviews.append({"date": date.date().isoformat(), "count": count})
    
    # Get review ratings distribution
    review_ratings = []
    for rating in range(1, 29):
        count = db.query(func.count(Review.id)).filter(
            Review.card_id.in_(
                db.query(Card.id).filter(Card.owner_id == user_id)
            ),
            Review.rating == rating
        ).scalar()
        review_ratings.append({"rating": rating, "count": count})
    
    # Get card status trend
    card_status_trend = []
    for i in range(30):
        date = datetime.now() - timedelta(days=i)
        learning = db.query(func.count(Card.id)).filter(
            Card.owner_id == user_id,
            Card.status == "learning",
            func.date(Card.created_at) <= date.date()
        ).scalar()
        reviewing = db.query(func.count(Card.id)).filter(
            Card.owner_id == user_id,
            Card.status == "reviewing",
            func.date(Card.created_at) <= date.date()
        ).scalar()
        mastered = db.query(func.count(Card.id)).filter(
            Card.owner_id == user_id,
            Card.status == "mastered",
            func.date(Card.created_at) <= date.date()
        ).scalar()
        card_status_trend.append({
            "date": date.date().isoformat(),
            "learning": learning,
            "reviewing": reviewing,
            "mastered": mastered
        })
    
    return Statistics(
        total_cards=total_cards,
        mastered_cards=mastered_cards,
        learning_cards=learning_cards,
        reviewing_cards=reviewing_cards,
        due_cards=due_cards,
        daily_reviews=daily_reviews,
        review_ratings=review_ratings,
        card_status_trend=card_status_trend
    )

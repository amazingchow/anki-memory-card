from datetime import datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.card import Card, Review
from schemas.statistics import Statistics


async def get_statistics(db: AsyncSession, user_id: int) -> Statistics:
    # Get total cards
    total_cards_query = select(func.count(Card.id)).filter(Card.owner_id == user_id)
    total_cards = await db.scalar(total_cards_query)

    # Get cards by status
    mastered_cards_query = select(func.count(Card.id)).filter(
        Card.owner_id == user_id, Card.status == "mastered"
    )
    mastered_cards = await db.scalar(mastered_cards_query)

    learning_cards_query = select(func.count(Card.id)).filter(
        Card.owner_id == user_id, Card.status == "learning"
    )
    learning_cards = await db.scalar(learning_cards_query)

    reviewing_cards_query = select(func.count(Card.id)).filter(
        Card.owner_id == user_id, Card.status == "reviewing"
    )
    reviewing_cards = await db.scalar(reviewing_cards_query)

    # Get due cards
    due_cards_query = select(func.count(Card.id)).filter(
        Card.owner_id == user_id, Card.next_review <= datetime.now()
    )
    due_cards = await db.scalar(due_cards_query)

    # Get daily reviews for the last 30 days
    daily_reviews = []
    for i in range(29, -1, -1):
        date = datetime.now() - timedelta(days=i)
        daily_reviews_query = select(func.count(Review.id)).filter(
            Review.card_id.in_(select(Card.id).filter(Card.owner_id == user_id)),
            func.date(Review.review_date) == date.date(),
        )
        count = await db.scalar(daily_reviews_query)
        daily_reviews.append({"date": date.date().isoformat(), "count": count})

    # Get review ratings distribution
    review_ratings = []
    for rating in range(1, 29):
        ratings_query = select(func.count(Review.id)).filter(
            Review.card_id.in_(select(Card.id).filter(Card.owner_id == user_id)),
            Review.rating == rating,
        )
        count = await db.scalar(ratings_query)
        review_ratings.append({"rating": rating, "count": count})

    # Get card status trend
    card_status_trend = []
    for i in range(30):
        date = datetime.now() - timedelta(days=i)

        learning_query = select(func.count(Card.id)).filter(
            Card.owner_id == user_id,
            Card.status == "learning",
            func.date(Card.created_at) <= date.date(),
        )
        learning = await db.scalar(learning_query)

        reviewing_query = select(func.count(Card.id)).filter(
            Card.owner_id == user_id,
            Card.status == "reviewing",
            func.date(Card.created_at) <= date.date(),
        )
        reviewing = await db.scalar(reviewing_query)

        mastered_query = select(func.count(Card.id)).filter(
            Card.owner_id == user_id,
            Card.status == "mastered",
            func.date(Card.created_at) <= date.date(),
        )
        mastered = await db.scalar(mastered_query)

        card_status_trend.append(
            {
                "date": date.date().isoformat(),
                "learning": learning,
                "reviewing": reviewing,
                "mastered": mastered,
            }
        )

    return Statistics(
        total_cards=total_cards,
        mastered_cards=mastered_cards,
        learning_cards=learning_cards,
        reviewing_cards=reviewing_cards,
        due_cards=due_cards,
        daily_reviews=daily_reviews,
        review_ratings=review_ratings,
        card_status_trend=card_status_trend,
    )

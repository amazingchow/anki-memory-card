from datetime import datetime

from sqlalchemy.orm import Session

from core.spaced_repetition import calculate_next_review, get_review_status
from models.card import Card
from schemas.card import CardCreate, CardUpdate


def get_card(db: Session, card_id: int):
    return db.query(Card).filter(Card.id == card_id).first()


def get_cards(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Card).offset(skip).limit(limit).all()


def get_user_cards(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Card).filter(Card.owner_id == user_id).offset(skip).limit(limit).all()


def create_card(db: Session, card: CardCreate, user_id: int):
    db_card = Card(
        **card.model_dump(),
        owner_id=user_id,
        next_review=datetime.now(),
        status="learning"
    )
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


def update_card(db: Session, card_id: int, card_update: CardUpdate):
    db_card = get_card(db, card_id)
    if db_card:
        update_data = card_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_card, field, value)
        db.commit()
        db.refresh(db_card)
    return db_card


def get_due_cards(db: Session, user_id: int):
    return db.query(Card).filter(
        Card.owner_id == user_id,
        Card.next_review <= datetime.now()
    ).all()


def create_review(db: Session, card_id: int, rating: int):
    db_card = get_card(db, card_id)
    if db_card:
        db_card.review_count += 1
        db_card.next_review = calculate_next_review(db_card.review_count, rating)
        db_card.status = get_review_status(db_card.review_count)
        db.commit()
        db.refresh(db_card)
    return db_card

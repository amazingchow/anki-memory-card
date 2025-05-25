# -*- coding: utf-8 -*-
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.spaced_repetition import calculate_next_review, get_review_status
from models.card import Card
from schemas.card import CardCreate, CardUpdate


async def get_card(db: AsyncSession, card_id: int):
    result = await db.execute(select(Card).filter(Card.id == card_id))
    return result.scalar_one_or_none()


async def get_cards(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Card).offset(skip).limit(limit))
    return result.scalars().all()


async def get_user_cards(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Card).filter(Card.owner_id == user_id).offset(skip).limit(limit))
    return result.scalars().all()


async def create_card(db: AsyncSession, card: CardCreate, user_id: int):
    try:
        db_card = Card(
            **card.model_dump(),
            owner_id=user_id,
            next_review=datetime.now(),
            status="learning"
        )
        db.add(db_card)
        await db.commit()
        await db.refresh(db_card)
        return db_card
    except Exception as exc:
        await db.rollback()
        raise exc


async def update_card(db: AsyncSession, card_id: int, card_update: CardUpdate):
    try:
        db_card = await get_card(db, card_id)
        if db_card:
            update_data = card_update.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_card, field, value)
            await db.commit()
            await db.refresh(db_card)
        return db_card
    except Exception as exc:
        await db.rollback()
        raise exc


async def get_due_cards(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Card).filter(
            Card.owner_id == user_id,
            Card.next_review <= datetime.now()
        )
    )
    return result.scalars().all()


async def create_review(db: AsyncSession, card_id: int, rating: int):
    try:
        db_card = await get_card(db, card_id)
        if db_card:
            next_interval = calculate_next_review(rating, db_card.review_count)
            db_card.next_review = datetime.now() + next_interval
            db_card.review_count += 1
            db_card.status = get_review_status(db_card.review_count)
            await db.commit()
            await db.refresh(db_card)
        return db_card
    except Exception as exc:
        await db.rollback()
        raise exc

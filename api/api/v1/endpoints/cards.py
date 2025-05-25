# -*- coding: utf-8 -*-
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_active_user
from core.db import get_sqlite_db
from crud.crud_card import (
    create_card,
    create_review,
    get_card,
    get_due_cards,
    get_user_cards,
    update_card
)
from models.user import User
from schemas.card import Card, CardCreate, CardUpdate, ReviewCreate

router = APIRouter()


@router.post("/", response_model=Card)
async def create_card_endpoint(
    card: CardCreate,
    db: AsyncSession = Depends(get_sqlite_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create new card.
    """
    try:
        return await create_card(db=db, card=card, user_id=current_user.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[Card])
async def get_cards_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_sqlite_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get user cards.
    """
    return await get_user_cards(db=db, user_id=current_user.id, skip=skip, limit=limit)


@router.get("/{card_id}", response_model=Card)
async def get_card_endpoint(
    card_id: int,
    db: AsyncSession = Depends(get_sqlite_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get card by ID.
    """
    db_card = await get_card(db=db, card_id=card_id)
    if db_card is None or db_card.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card


@router.patch("/{card_id}", response_model=Card)
async def update_card_endpoint(
    card_id: int,
    card_update: CardUpdate,
    db: AsyncSession = Depends(get_sqlite_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update card.
    """
    db_card = await get_card(db=db, card_id=card_id)
    if db_card is None or db_card.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Card not found")
    return await update_card(db=db, card_id=card_id, card_update=card_update)


@router.get("/due", response_model=List[Card])
async def get_due_cards_endpoint(
    db: AsyncSession = Depends(get_sqlite_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get due cards for review.
    """
    return await get_due_cards(db=db, user_id=current_user.id)


@router.post("/{card_id}/review", response_model=Card)
async def review_card_endpoint(
    card_id: int,
    review: ReviewCreate,
    db: AsyncSession = Depends(get_sqlite_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Review card.
    """
    db_card = await get_card(db=db, card_id=card_id)
    if db_card is None or db_card.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Card not found")
    return await create_review(db=db, card_id=card_id, rating=review.rating)


@router.post("/import", response_model=List[Card])
async def import_anki_cards(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """
    Import cards from an Anki .apkg file.
    """
    if not file.filename.endswith('.apkg'):
        raise HTTPException(status_code=400, detail="Only .apkg files are supported")
    
    try:
        # Create .apkg directory if it doesn't exist
        apkg_dir = Path(".apkg")
        apkg_dir.mkdir(exist_ok=True)
        
        # Save the file
        file_path = apkg_dir / file.filename
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
            
        return []  # Return empty list for now since we're just saving the file
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

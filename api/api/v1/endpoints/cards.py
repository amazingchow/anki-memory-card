from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_current_active_user
from corelib.db import get_sqlite_db
from crud.crud_card import (
    create_card,
    create_review,
    get_card,
    get_due_cards,
    get_user_cards,
    update_card,
)
from models.user import User
from schemas.card import Card, CardCreate, CardUpdate, ReviewCreate

router = APIRouter()


@router.get("/due", response_model=List[Card])
async def h_get_due_cards(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db),
):
    """Get due cards for review."""
    return await get_due_cards(db=db, user_id=current_user.id, skip=skip, limit=limit)


@router.get("/", response_model=List[Card])
async def h_get_cards(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db),
):
    """Get user cards."""
    return await get_user_cards(db=db, user_id=current_user.id, skip=skip, limit=limit)


@router.get("/{card_id}", response_model=Card)
async def h_get_card(
    card_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db),
):
    """Get card by ID."""
    db_card = await get_card(db=db, card_id=card_id)
    if db_card is None or db_card.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card


@router.post("/", response_model=Card)
async def h_create_card(
    card: CardCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db),
):
    """Create new card."""
    try:
        return await create_card(db=db, card=card, user_id=current_user.id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/{card_id}", response_model=Card)
async def h_update_card(
    card_id: int,
    card_update: CardUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db),
):
    """Update card."""
    db_card = await get_card(db=db, card_id=card_id)
    if db_card is None or db_card.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Card not found")
    return await update_card(db=db, card_id=card_id, card_update=card_update)


@router.post("/{card_id}/review", response_model=Card)
async def h_review_card(
    card_id: int,
    review: ReviewCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db),
):
    """Review card."""
    db_card = await get_card(db=db, card_id=card_id)
    if db_card is None or db_card.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Card not found")
    return await create_review(db=db, card_id=card_id, rating=review.rating)


@router.post("/import", response_model=List[Card])
async def h_import_anki_cards(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_sqlite_db),
):
    """Import cards from an Anki .apkg file."""
    if not file.filename.endswith(".apkg"):
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

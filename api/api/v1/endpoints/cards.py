from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from api.deps import get_current_active_user
from core.db import get_db
from crud.crud_card import (
    create_card,
    create_review,
    get_card,
    get_due_cards,
    get_user_cards,
    update_card
)
from models.user import User
from schemas.card import (
    BulkImportRequest,
    Card,
    CardCreate,
    CardUpdate,
    ReviewCreate
)

router = APIRouter()


@router.post("/", response_model=Card)
def create_card_endpoint(
    card: CardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create new card.
    """
    return create_card(db=db, card=card, user_id=current_user.id)


@router.get("/", response_model=List[Card])
def read_cards(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Retrieve cards.
    """
    return get_user_cards(db=db, user_id=current_user.id, skip=skip, limit=limit)


@router.get("/{card_id}", response_model=Card)
def read_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get card by ID.
    """
    card = get_card(db=db, card_id=card_id)
    if card is None or card.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


@router.patch("/{card_id}", response_model=Card)
def update_card_endpoint(
    card_id: int,
    card_update: CardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update card.
    """
    card = get_card(db=db, card_id=card_id)
    if card is None or card.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Card not found")
    return update_card(db=db, card_id=card_id, card_update=card_update)


@router.get("/due/", response_model=List[Card])
def get_due_cards_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get due cards.
    """
    return get_due_cards(db=db, user_id=current_user.id)


@router.post("/{card_id}/review", response_model=Card)
def review_card_endpoint(
    card_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Review a card.
    """
    card = get_card(db=db, card_id=card_id)
    if card is None or card.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Card not found")
    return create_review(db=db, card_id=card_id, rating=review.rating)


@router.post("/bulk", response_model=List[Card])
def bulk_import_cards(
    request: BulkImportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Bulk import cards.
    """
    cards = []
    for card in request.cards:
        db_card = create_card(db=db, card=card, user_id=current_user.id)
        cards.append(db_card)
    return cards


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

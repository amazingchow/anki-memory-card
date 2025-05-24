from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, database, auth, spaced_repetition
from pydantic import BaseModel

# 创建数据库表
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 前端开发服务器地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

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

class BulkImportRequest(BaseModel):
    cards: List[CardCreate]

class Statistics(BaseModel):
    total_cards: int
    mastered_cards: int
    learning_cards: int
    reviewing_cards: int
    due_cards: int
    daily_reviews: List[dict]
    review_ratings: List[dict]
    card_status_trend: List[dict]

# 用户认证相关路由
@app.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    """
    用户登录接口
    
    Args:
        form_data: 包含用户名(邮箱)和密码的表单数据
        db: 数据库会话
    
    Returns:
        包含访问令牌的字典
    
    Raises:
        HTTPException: 当用户名或密码错误时抛出401错误
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(database.get_db)):
    """
    用户注册接口
    
    Args:
        user: 包含邮箱和密码的用户创建数据
        db: 数据库会话
    
    Returns:
        创建的用户信息（不包含密码）
    
    Raises:
        HTTPException: 当邮箱已被注册时抛出400错误
    """
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# 单词卡片相关路由
@app.post("/cards/", response_model=Card)
def create_card(
    card: CardCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """
    创建新的单词卡片
    
    Args:
        card: 包含单词、定义、例句和笔记的卡片数据
        db: 数据库会话
        current_user: 当前登录用户
    
    Returns:
        创建的卡片信息
    """
    db_card = models.Card(
        **card.model_dump(),
        owner_id=current_user.id,
        next_review=datetime.now(),
        status="learning"
    )
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

@app.get("/cards/", response_model=List[Card])
def read_cards(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """
    获取当前用户的所有卡片
    
    Args:
        skip: 跳过的记录数，用于分页
        limit: 返回的最大记录数，用于分页
        db: 数据库会话
        current_user: 当前登录用户
    
    Returns:
        卡片列表
    """
    cards = db.query(models.Card).filter(
        models.Card.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    return cards

@app.get("/cards/{card_id}", response_model=Card)
def read_card(
    card_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """
    获取指定ID的卡片
    
    Args:
        card_id: 卡片ID
        db: 数据库会话
        current_user: 当前登录用户
    
    Returns:
        卡片信息
    
    Raises:
        HTTPException: 当卡片不存在或不属于当前用户时抛出404错误
    """
    card = db.query(models.Card).filter(
        models.Card.id == card_id,
        models.Card.owner_id == current_user.id
    ).first()
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return card

@app.post("/cards/{card_id}/review", response_model=Review)
def review_card(
    card_id: int,
    review: ReviewCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """
    复习指定ID的卡片
    
    Args:
        card_id: 卡片ID
        review: 包含评分的复习数据
        db: 数据库会话
        current_user: 当前登录用户
    
    Returns:
        复习记录
    
    Raises:
        HTTPException: 当卡片不存在或不属于当前用户时抛出404错误
    """
    card = db.query(models.Card).filter(
        models.Card.id == card_id,
        models.Card.owner_id == current_user.id
    ).first()
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")

    # 计算下次复习时间
    next_review = spaced_repetition.calculate_next_review(
        card.review_count,
        review.rating
    )
    
    # 更新卡片状态
    card.review_count += 1
    card.next_review = next_review
    card.status = spaced_repetition.get_review_status(card.review_count)
    
    # 创建复习记录
    db_review = models.Review(
        card_id=card_id,
        rating=review.rating,
        next_interval=int((next_review - datetime.now()).total_seconds() / 3600)
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/cards/due/", response_model=List[Card])
def get_due_cards(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """
    获取当前用户待复习的卡片
    
    Args:
        db: 数据库会话
        current_user: 当前登录用户
    
    Returns:
        待复习的卡片列表
    """
    now = datetime.now()
    cards = db.query(models.Card).filter(
        models.Card.owner_id == current_user.id,
        models.Card.next_review <= now
    ).all()
    return cards

@app.post("/cards/bulk", response_model=List[Card])
def bulk_import_cards(
    request: BulkImportRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """
    批量导入单词卡片
    
    Args:
        request: 包含多个卡片数据的请求
        db: 数据库会话
        current_user: 当前登录用户
    
    Returns:
        导入的卡片列表
    """
    db_cards = []
    for card_data in request.cards:
        db_card = models.Card(
            **card_data.model_dump(),
            owner_id=current_user.id,
            next_review=datetime.now(),
            status="learning"
        )
        db.add(db_card)
        db_cards.append(db_card)
    
    db.commit()
    for card in db_cards:
        db.refresh(card)
    return db_cards

@app.get("/statistics", response_model=Statistics)
def get_statistics(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """
    获取用户的统计数据
    
    Args:
        db: 数据库会话
        current_user: 当前登录用户
    
    Returns:
        包含各种统计数据的字典
    """
    # 获取卡片总数和各状态卡片数量
    total_cards = db.query(models.Card).filter(
        models.Card.owner_id == current_user.id
    ).count()
    
    mastered_cards = db.query(models.Card).filter(
        models.Card.owner_id == current_user.id,
        models.Card.status == "mastered"
    ).count()
    
    learning_cards = db.query(models.Card).filter(
        models.Card.owner_id == current_user.id,
        models.Card.status == "learning"
    ).count()
    
    reviewing_cards = db.query(models.Card).filter(
        models.Card.owner_id == current_user.id,
        models.Card.status == "reviewing"
    ).count()
    
    # 获取待复习卡片数量
    now = datetime.now()
    due_cards = db.query(models.Card).filter(
        models.Card.owner_id == current_user.id,
        models.Card.next_review <= now
    ).count()
    
    # 获取每日复习数量（最近30天）
    thirty_days_ago = now - timedelta(days=30)
    daily_reviews = db.query(
        func.date(models.Review.review_date).label('date'),
        func.count(models.Review.id).label('count')
    ).join(
        models.Card
    ).filter(
        models.Card.owner_id == current_user.id,
        models.Review.review_date >= thirty_days_ago
    ).group_by(
        func.date(models.Review.review_date)
    ).all()
    
    # 获取评分分布
    review_ratings = db.query(
        models.Review.rating,
        func.count(models.Review.id).label('count')
    ).join(
        models.Card
    ).filter(
        models.Card.owner_id == current_user.id
    ).group_by(
        models.Review.rating
    ).all()
    
    # 获取卡片状态趋势（最近30天）
    card_status_trend = db.query(
        func.date(models.Card.created_at).label('date'),
        models.Card.status,
        func.count(models.Card.id).label('count')
    ).filter(
        models.Card.owner_id == current_user.id,
        models.Card.created_at >= thirty_days_ago
    ).group_by(
        func.date(models.Card.created_at),
        models.Card.status
    ).all()
    
    return {
        "total_cards": total_cards,
        "mastered_cards": mastered_cards,
        "learning_cards": learning_cards,
        "reviewing_cards": reviewing_cards,
        "due_cards": due_cards,
        "daily_reviews": [{"date": str(r.date), "count": r.count} for r in daily_reviews],
        "review_ratings": [{"rating": r.rating, "count": r.count} for r in review_ratings],
        "card_status_trend": [{"date": str(t.date), "status": t.status, "count": t.count} for t in card_status_trend]
    }

@app.patch("/cards/{card_id}", response_model=Card)
def update_card(
    card_id: int,
    card_update: CardUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """
    更新指定ID的卡片
    
    Args:
        card_id: 卡片ID
        card_update: 要更新的卡片数据
        db: 数据库会话
        current_user: 当前登录用户
    
    Returns:
        更新后的卡片信息
    
    Raises:
        HTTPException: 当卡片不存在或不属于当前用户时抛出404错误
    """
    db_card = db.query(models.Card).filter(
        models.Card.id == card_id,
        models.Card.owner_id == current_user.id
    ).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")

    update_data = card_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_card, field, value)
    
    db.commit()
    db.refresh(db_card)
    return db_card 
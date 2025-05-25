# -*- coding: utf-8 -*-
from fastapi import APIRouter

from api.v1.endpoints import cards, statistics, users

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(cards.router, prefix="/cards", tags=["cards"])
api_router.include_router(statistics.router, prefix="/statistics", tags=["statistics"])

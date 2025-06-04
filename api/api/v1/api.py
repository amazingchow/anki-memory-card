from fastapi import APIRouter

from api.v1.endpoints import (  # auth,; study_sessions,
    cards,
    notification_settings,
    sse,
    statistics,
    users,
)

api_router = APIRouter()
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(cards.router, prefix="/cards", tags=["cards"])
# api_router.include_router(decks.router, prefix="/decks", tags=["decks"])
# api_router.include_router(study_sessions.router, prefix="/study-sessions", tags=["study-sessions"])
api_router.include_router(statistics.router, prefix="/statistics", tags=["statistics"])
api_router.include_router(
    notification_settings.router, prefix="/users", tags=["notification-settings"]
)
api_router.include_router(sse.router, prefix="/sse", tags=["sse"])

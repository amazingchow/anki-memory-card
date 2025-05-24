from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/health-check")
async def h_health_check(request: Request):
    return "OK"

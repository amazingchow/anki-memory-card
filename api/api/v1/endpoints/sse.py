from fastapi import APIRouter, Depends, Request
from sse_starlette.sse import EventSourceResponse

from api.deps import get_current_active_user
from corelib.sse import event_generator
from models.user import User

router = APIRouter()


@router.get("/")
async def sse_endpoint(
    request: Request, current_user: User = Depends(get_current_active_user)
):
    """SSE 端点，用于建立服务器发送事件连接"""
    return EventSourceResponse(event_generator(request))

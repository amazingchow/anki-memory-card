import asyncio
import json
from typing import Any, Dict, Optional
from uuid import uuid4

from fastapi import Request

# 存储所有活动的 SSE 连接，使用字典来存储连接信息
sse_connections: Dict[str, Dict[str, Any]] = {}


async def event_generator(request: Request, connection_type: Optional[str] = None):
    # 为每个客户端创建一个唯一的连接ID
    connection_id = str(uuid4())
    queue = asyncio.Queue()
    sse_connections[connection_id] = {"queue": queue, "type": connection_type}

    try:
        while True:
            if await request.is_disconnected():
                break
            # 等待新消息
            message = await queue.get()
            yield {"event": "message", "data": json.dumps(message)}
    finally:
        sse_connections.pop(connection_id, None)


async def broadcast_message(message: Dict, message_type: Optional[str] = None):
    """向所有连接的客户端广播消息

    Args:
        message: 要广播的消息
        message_type: 消息类型，如果指定则只发送给该类型的连接
    """
    for connection_id, connection_info in sse_connections.items():
        if message_type is None or connection_info["type"] == message_type:
            await connection_info["queue"].put(message)


async def send_message(connection_id: str, message: Dict):
    """向特定连接发送消息

    Args:
        connection_id: 连接ID
        message: 要发送的消息
    """
    if connection_id in sse_connections:
        await sse_connections[connection_id]["queue"].put(message)

# -*- coding: utf-8 -*-
import time

from fastapi import Request
from loguru import logger as loguru_logger
from starlette.middleware.base import (
    BaseHTTPMiddleware,
    RequestResponseEndpoint
)
from starlette.responses import JSONResponse, Response

from corelib.config import settings
from corelib.retry_with_backoff import MaximumNumberOfRetriesExceededError


class RecoverPanicAndReportLatencyMiddleware(BaseHTTPMiddleware):

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        if (request.method == "HEAD" and request.url.path == "/") or \
            (request.method == "GET" and request.url.path == "/") or \
                (request.method == "GET" and request.url.path == "/favicon.ico") or \
                    (request.method == "GET" and request.url.path == "/docs") or \
                        (request.method == "GET" and request.url.path == "/api/v1/openapi.json"):
            response = await call_next(request)
            return response
        else:
            try:
                if settings.RECORD_REQUEST_LATENCY:
                    st = time.time()
                    response = await call_next(request)
                    ed = time.time()
                    loguru_logger.trace(f"{request.method} {request.url.path} - request latency: {ed - st:.3f}s")
                else:
                    response = await call_next(request)
                return response
            except MaximumNumberOfRetriesExceededError as exc:
                loguru_logger.error(f"Recover from internal server panic, exc:{exc}.")
                return JSONResponse(
                    content={"code": 10503, "message": "服务器繁忙，请稍后再试"},
                    status_code=200
                )
            except Exception as exc:
                loguru_logger.exception(f"Recover from internal server panic, exc:{exc}.")
                return JSONResponse(
                    content={"code": 10500, "message": "服务器内部错误"},
                    status_code=200
                )

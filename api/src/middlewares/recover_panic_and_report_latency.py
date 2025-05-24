from fastapi import Request
from loguru import logger as loguru_logger
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import JSONResponse, Response

from corelib.error_code import (
    SERVICE_ERROR_CODE_10500,
    SERVICE_ERROR_CODE_10501,
    SERVICE_ERROR_CODE_MAP,
)
from corelib.retry_with_backoff import MaximumNumberOfRetriesExceededError


class RecoverPanicMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        try:
            return await call_next(request)
        except MaximumNumberOfRetriesExceededError as exc:
            loguru_logger.error(f"Recover from internal server panic, exc:{exc}.")
            return JSONResponse(
                content={
                    "code": SERVICE_ERROR_CODE_10501,
                    "message": SERVICE_ERROR_CODE_MAP[SERVICE_ERROR_CODE_10501],
                },
                status_code=200,
            )
        except Exception as exc:
            loguru_logger.exception(f"Recover from internal server panic, exc:{exc}.")
            return JSONResponse(
                content={
                    "code": SERVICE_ERROR_CODE_10500,
                    "message": SERVICE_ERROR_CODE_MAP[SERVICE_ERROR_CODE_10501],
                },
                status_code=200,
            )

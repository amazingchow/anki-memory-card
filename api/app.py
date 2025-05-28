# -*- coding: utf-8 -*-
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger as loguru_logger
from starlette.responses import JSONResponse

from api.v1.api import api_router
from corelib.config import settings
from corelib.db import sqlite_engine
from corelib.loguru_logger import init_global_logger
from middlewares.recover_panic_and_report_latency import (
    RecoverPanicAndReportLatencyMiddleware
)
from models.base import Base


# --- 生命周期事件 (可选) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup global logger.
    init_global_logger()

    loguru_logger.info("--------------------------------------------------------------------------")
    loguru_logger.info("Application startup...")
    # Create database tables
    async with sqlite_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    loguru_logger.info("Application shutdown...")


# --- FastAPI 实例 ---
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)
# --- 路由 ---
app.include_router(api_router, prefix=settings.API_V1_STR)
# --- 中间件 ---
app.add_middleware(RecoverPanicAndReportLatencyMiddleware)
# NOTE: 按照FILO顺序调用用户侧的中间件, 因此CORS中间件应该放在最前面.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- 全局异常处理 (可选) ---
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    # 避免覆盖 FastAPI 的 HTTPException 处理
    if isinstance(exc, HTTPException):
        raise exc
    # 对于其他未捕获的异常，记录并返回 500
    loguru_logger.error(f"Unhandled exception for request {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"Internal server error: {type(exc).__name__}"},
    )

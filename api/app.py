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
from middlewares.recover_panic_and_report_latency import RecoverPanicMiddleware
from models.base import Base


# --- 生命周期事件 (可选) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_global_logger()

    loguru_logger.info("--------------------------------------------------------------------------")
    loguru_logger.info("Application startup...")
    # Create database tables
    async with sqlite_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    loguru_logger.info("Application shutdown...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)
# --- 路由 ---
app.include_router(api_router, prefix=settings.API_V1_STR)
# --- 中间件 ---
app.add_middleware(RecoverPanicMiddleware)
# NOTE: 按照 FILO 顺序调用用户侧定义的中间件, 因此 CORS 中间件应该放在最后面.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

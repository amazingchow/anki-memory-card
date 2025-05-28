# -*- coding: utf-8 -*-
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine
)

from corelib.config import settings

# Sqlite
sqlite_engine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URL.replace('sqlite:///', 'sqlite+aiosqlite:///'),
    connect_args={"check_same_thread": False},
    echo=False,  # echo=True to print SQL
    future=True  # future=True to use SQLAlchemy 2.0 features
)
AsyncSqliteSessionLocal = async_sessionmaker(
    bind=sqlite_engine,
    class_=AsyncSession,
    autoflush=False,  # autoflush=True to automatically flush changes to the database
    expire_on_commit=False  # expire_on_commit=True to expire objects after commit, False to keep objects alive until the session is closed
)


# Dependency
async def get_sqlite_db():
    async with AsyncSqliteSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# MySQL
mysql_database_url = f"mysql+aiomysql://{settings.MYSQL_USERNAME}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_SERVER_ENDPOINT}/{settings.MYSQL_DATABASE}"
mysql_engine = create_async_engine(
    mysql_database_url,
    echo=False,
    future=True
)
AsyncMysqlSessionLocal = async_sessionmaker(
    bind=mysql_engine,
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False
)


async def get_mysql_db():
    async with AsyncMysqlSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# PostgreSQL
postgresql_database_url = f"postgresql+asyncpg://{settings.POSTGRES_USERNAME}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER_ENDPOINT}/{settings.POSTGRES_DATABASE}"
postgresql_engine = create_async_engine(
    postgresql_database_url,
    echo=False,
    future=True
)
AsyncPostgresqlSessionLocal = async_sessionmaker(
    bind=postgresql_engine,
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False
)


async def get_postgresql_db():
    async with AsyncPostgresqlSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

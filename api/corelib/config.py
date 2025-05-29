# -*- coding: utf-8 -*-
from typing import List

from fastapi.security.api_key import APIKeyHeader
from loguru import logger as loguru_logger
from pydantic import ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str
    VERSION: str
    API_V1_STR: str
    DEPLOYMENT_ENV: str
    # Security
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    # Misc
    FRONTEND_URL: str
    RECORD_REQUEST_LATENCY: bool
    RESTRICT_REGISTRATION_TO_WHITELIST: bool
    WHITELIST_EMAILS: List[str]
    BACKEND_CORS_ORIGINS: List[str]
    # Logging
    LOG_SERVICE_NAME: str
    LOG_LEVEL: str
    LOG_PRINTER: str
    LOG_PRINTER_FILENAME: str
    CELERY_LOG_SERVICE_NAME: str
    CELERY_LOG_LEVEL: str
    CELERY_WORKER_LOG_PRINTER: str
    CELERY_WORKER_LOG_PRINTER_FILENAME: str
    # Sqlite
    SQLALCHEMY_DATABASE_URL: str
    # MySQL
    MYSQL_SERVER_ENDPOINT: str
    MYSQL_USERNAME: str
    MYSQL_PASSWORD: str
    MYSQL_DATABASE: str
    MYSQL_CHARSET: str
    MYSQL_COLLATION: str
    # PostgreSQL
    POSTGRES_SERVER_ENDPOINT: str
    POSTGRES_USERNAME: str
    POSTGRES_PASSWORD: str
    POSTGRES_DATABASE: str
    POSTGRES_CHARSET: str
    POSTGRES_COLLATION: str
    # Redis
    REDIS_SERVER_ENDPOINT: str
    REDIS_PASSWORD: str
    REDIS_CACHE_DB: int
    # Celery
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND_URL: str
    # Email
    EMAIL_SENDER: str
    EMAIL_ATTACH_FILE_ROOT_PATH: str
    TMP_FILE_ROOT_PATH: str
    # Aliyun OSS
    ALICLOUD_ACCESS_KEY_ID: str
    ALICLOUD_ACCESS_KEY_SECRET: str
    ALICLOUD_OSS_ENDPOINT: str
    ALICLOUD_OSS_BUCKET: str
    # AWS S3
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_S3_REGION: str
    AWS_S3_ENDPOINT: str
    AWS_S3_BUCKET: str
    # Cloudflare R2
    CLOUDFLARE_R2_ACCESS_KEY_ID: str
    CLOUDFLARE_R2_ACCESS_KEY_SECRET: str
    CLOUDFLARE_R2_ENDPOINT: str
    CLOUDFLARE_R2_BUCKET: str
    # Resend
    RESEND_API_KEY: str
    RESEND_FROM_EMAIL: str
    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_BASE_URL: str
    OPENAI_MODEL: str
    # Anthropic
    ANTHROPIC_API_KEY: str
    ANTHROPIC_BASE_URL: str
    CLAUDE_MODEL: str
    # Google Gemini
    GOOGLE_GEMINI_API_KEY: str
    GOOGLE_GEMINI_BASE_URL: str
    GOOGLE_GEMINI_MODEL: str

    # model_config is used to configure the behavior of the Pydantic Settings class.
    # It controls settings such as:
    # - extra: "forbid" means that any extra fields not defined in the class will cause a validation error.
    # - arbitrary_types_allowed: allows arbitrary types to be used in the settings.
    # - validate_default: ensures that default values are validated.
    # - case_sensitive: makes the settings case-sensitive.
    # - env_prefix: sets a prefix for environment variables (empty in this case).
    # - env_file: specifies the environment file to load (None in this case).
    # - env_file_encoding: specifies the encoding of the environment file (None in this case).
    # - env_nested_delimiter: specifies the delimiter for nested environment variables (None in this case).
    # - secrets_dir: specifies the directory for secrets (None in this case).
    # - protected_namespaces: specifies namespaces that are protected from being overridden.
    model_config = SettingsConfigDict(
        extra="forbid",
        arbitrary_types_allowed=True,
        validate_default=True,
        case_sensitive=True,
        env_prefix="ANKI_AI_",
        env_file=None,
        env_file_encoding=None,
        env_nested_delimiter=None,
        secrets_dir=None,
        protected_namespaces=("model_", "settings_"),
    )


try:
    settings = Settings()
except ValidationError as exc:
    loguru_logger.error(f"Failed to parse settings, err: {exc.json(indent=4)}")

# Auth headers
auth_header_uid = APIKeyHeader(name="x-sec-uid", scheme_name="header for user id")
auth_header_account = APIKeyHeader(name="x-sec-account", scheme_name="header for user account")
auth_header_token = APIKeyHeader(name="x-sec-token", scheme_name="header for access token")

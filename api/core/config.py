"""
This module defines the configuration settings for the Anki AI application.
It loads environment variables from a .env file and system environment, with defaults provided in DEFAULTS.
The Settings class uses Pydantic to validate and parse these settings.
"""

# -*- coding: utf-8 -*-
import os
from typing import List

from dotenv import dotenv_values
from fastapi.security.api_key import APIKeyHeader
from loguru import logger as loguru_logger
from pydantic import ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULTS = {
    "PROJECT_NAME": "Anki AI",
    "VERSION": "1.0.0",
    "API_V1_STR": "/api/v1",
    "DEPLOYMENT_ENV": "dev",
    # Security
    "SECRET_KEY": "your_secret_key",
    "ALGORITHM": "HS256",
    "ACCESS_TOKEN_EXPIRE_MINUTES": "30",
    # Misc
    "RECORD_REQUEST_LATENCY": "true",
    "RESTRICT_REGISTRATION_TO_WHITELIST": "false",
    "WHITELIST_EMAILS": "your_whitelist_emails",
    # Logging
    "LOG_SERVICE_NAME": "Anki AI",
    "LOG_LEVEL": "TRACE",
    "LOG_PRINTER": "disk",  # or "print "
    "LOG_PRINTER_FILENAME": "./anki-ai.dev.log",
    "CELERY_LOG_SERVICE_NAME": "Anki AI Task Worker",
    "CELERY_LOG_LEVEL": "TRACE",
    "CELERY_WORKER_LOG_PRINTER": "disk",  # or "print"
    "CELERY_WORKER_LOG_PRINTER_FILENAME": "./anki-ai-celery-worker.dev.log",
    # Sqlite
    "SQLALCHEMY_DATABASE_URL": "sqlite:///./anki.db",
    # MySQL
    "MYSQL_SERVER_ENDPOINT": "localhost:3306",
    "MYSQL_USERNAME": "your_mysql_username",
    "MYSQL_PASSWORD": "your_mysql_password",
    "MYSQL_DATABASE": "your_mysql_database",
    "MYSQL_CHARSET": "utf8mb4",
    "MYSQL_COLLATION": "utf8mb4_unicode_ci",
    # PostgreSQL
    "POSTGRES_SERVER_ENDPOINT": "localhost:5432",
    "POSTGRES_USERNAME": "your_postgres_username",
    "POSTGRES_PASSWORD": "your_postgres_password",
    "POSTGRES_DATABASE": "your_postgres_database",
    "POSTGRES_CHARSET": "utf8mb4",
    "POSTGRES_COLLATION": "utf8mb4_unicode_ci",
    # Redis
    "REDIS_SERVER_ENDPOINT": "localhost:6379",
    "REDIS_PASSWORD": "your_redis_password",
    "REDIS_CACHE_DB": "0",
    # Celery
    "CELERY_BROKER_URL": "your_celery_broker_url",
    "CELERY_RESULT_BACKEND_URL": "your_celery_result_backend_url",
    # Email
    "EMAIL_SENDER": "your_email_sender",
    "EMAIL_ATTACH_FILE_ROOT_PATH": "your_email_attach_file_root_path",
    "TMP_FILE_ROOT_PATH": "your_tmp_file_root_path",
    # Aliyun OSS
    "ALICLOUD_ACCESS_KEY_ID": "your_alicloud_access_key_id",
    "ALICLOUD_ACCESS_KEY_SECRET": "your_alicloud_access_key_secret",
    "ALICLOUD_OSS_ENDPOINT": "your_alicloud_oss_endpoint",
    "ALICLOUD_OSS_BUCKET": "your_alicloud_oss_bucket",
    # AWS S3
    "AWS_ACCESS_KEY_ID": "your_aws_access_key_id",
    "AWS_SECRET_ACCESS_KEY": "your_aws_secret_access_key",
    "AWS_S3_REGION": "your_aws_s3_region",
    "AWS_S3_ENDPOINT": "your_aws_s3_endpoint",
    "AWS_S3_BUCKET": "your_aws_s3_bucket",
    # Cloudflare R2
    "CLOUDFLARE_R2_ACCESS_KEY_ID": "your_cloudflare_r2_access_key_id",
    "CLOUDFLARE_R2_ACCESS_KEY_SECRET": "your_cloudflare_r2_access_key_secret",
    "CLOUDFLARE_R2_ENDPOINT": "your_cloudflare_r2_endpoint",
    "CLOUDFLARE_R2_BUCKET": "your_cloudflare_r2_bucket",
    # Resend
    "RESEND_API_KEY": "your_resend_api_key",
    # OpenAI
    "OPENAI_API_KEY": "your_openai_api_key",
    "OPENAI_BASE_URL": "https://api.openai.com/v1",
    "OPENAI_MODEL": "your_openai_model",
    # Anthropic
    "ANTHROPIC_API_KEY": "your_anthropic_api_key",
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
    "CLAUDE_MODEL": "your_claude_model",
    # Google Gemini
    "GOOGLE_GEMINI_API_KEY": "your_google_gemini_api_key",
    "GOOGLE_GEMINI_BASE_URL": "https://api.google.com",
    "GOOGLE_GEMINI_MODEL": "your_google_gemini_model",
}

ENV = {
    **dotenv_values(".env"),   # load local environment variables
    **os.environ,              # override loaded values with environment variables
}


def get_env(key: str) -> str:
    return ENV.get(key, DEFAULTS.get(key))


def get_bool_env(key: str) -> bool:
    return get_env(key).lower() == "true"


def get_int_env(key: str) -> int:
    return int(get_env(key))


def get_array_env(key: str) -> List[str]:
    return get_env(key).split(",")


def get_cors_allow_origins(env, default):
    cors_allow_origins = []
    if get_env(env):
        for origin in get_env(env).split(","):
            cors_allow_origins.append(origin)
    else:
        cors_allow_origins = [default]
    return cors_allow_origins


class Settings(BaseSettings):
    PROJECT_NAME: str = get_env("PROJECT_NAME")
    VERSION: str = get_env("VERSION")
    API_V1_STR: str = get_env("API_V1_STR")
    DEPLOYMENT_ENV: str = get_env("DEPLOYMENT_ENV")
    # Security
    SECRET_KEY: str = get_env("SECRET_KEY")
    ALGORITHM: str = get_env("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = get_int_env("ACCESS_TOKEN_EXPIRE_MINUTES")
    # Misc
    RECORD_REQUEST_LATENCY: bool = get_bool_env("RECORD_REQUEST_LATENCY")
    RESTRICT_REGISTRATION_TO_WHITELIST: bool = get_bool_env("RESTRICT_REGISTRATION_TO_WHITELIST")
    WHITELIST_EMAILS: List[str] = get_array_env("WHITELIST_EMAILS")
    # Logging
    LOG_SERVICE_NAME: str = get_env("LOG_SERVICE_NAME")
    LOG_LEVEL: str = get_env("LOG_LEVEL")
    LOG_PRINTER: str = get_env("LOG_PRINTER")
    LOG_PRINTER_FILENAME: str = get_env("LOG_PRINTER_FILENAME")
    CELERY_LOG_SERVICE_NAME: str = get_env("CELERY_LOG_SERVICE_NAME")
    CELERY_LOG_LEVEL: str = get_env("CELERY_LOG_LEVEL")
    CELERY_WORKER_LOG_PRINTER: str = get_env("CELERY_WORKER_LOG_PRINTER")
    CELERY_WORKER_LOG_PRINTER_FILENAME: str = get_env("CELERY_WORKER_LOG_PRINTER_FILENAME")
    # Sqlite
    SQLALCHEMY_DATABASE_URL: str = get_env("SQLALCHEMY_DATABASE_URL")
    # MySQL
    MYSQL_SERVER_ENDPOINT: str = get_env("MYSQL_SERVER_ENDPOINT")
    MYSQL_USERNAME: str = get_env("MYSQL_USERNAME")
    MYSQL_PASSWORD: str = get_env("MYSQL_PASSWORD")
    MYSQL_DATABASE: str = get_env("MYSQL_DATABASE")
    MYSQL_CHARSET: str = get_env("MYSQL_CHARSET")
    MYSQL_COLLATION: str = get_env("MYSQL_COLLATION")
    # PostgreSQL
    POSTGRES_SERVER_ENDPOINT: str = get_env("POSTGRES_SERVER_ENDPOINT")
    POSTGRES_USERNAME: str = get_env("POSTGRES_USERNAME")
    POSTGRES_PASSWORD: str = get_env("POSTGRES_PASSWORD")
    POSTGRES_DATABASE: str = get_env("POSTGRES_DATABASE")
    POSTGRES_CHARSET: str = get_env("POSTGRES_CHARSET")
    POSTGRES_COLLATION: str = get_env("POSTGRES_COLLATION")
    # Redis
    REDIS_SERVER_ENDPOINT: str = get_env("REDIS_SERVER_ENDPOINT")
    REDIS_PASSWORD: str = get_env("REDIS_PASSWORD")
    REDIS_CACHE_DB: int = get_int_env("REDIS_CACHE_DB")
    # Celery
    CELERY_BROKER_URL: str = get_env("CELERY_BROKER_URL")
    CELERY_RESULT_BACKEND_URL: str = get_env("CELERY_RESULT_BACKEND_URL")
    # Email
    EMAIL_SENDER: str = get_env("EMAIL_SENDER")
    EMAIL_ATTACH_FILE_ROOT_PATH: str = get_env("EMAIL_ATTACH_FILE_ROOT_PATH")
    TMP_FILE_ROOT_PATH: str = get_env("TMP_FILE_ROOT_PATH")
    # Aliyun OSS
    ALICLOUD_ACCESS_KEY_ID: str = get_env("ALICLOUD_ACCESS_KEY_ID")
    ALICLOUD_ACCESS_KEY_SECRET: str = get_env("ALICLOUD_ACCESS_KEY_SECRET")
    ALICLOUD_OSS_ENDPOINT: str = get_env("ALICLOUD_OSS_ENDPOINT")
    ALICLOUD_OSS_BUCKET: str = get_env("ALICLOUD_OSS_BUCKET")
    # AWS S3
    AWS_ACCESS_KEY_ID: str = get_env("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: str = get_env("AWS_SECRET_ACCESS_KEY")
    AWS_S3_REGION: str = get_env("AWS_S3_REGION")
    AWS_S3_ENDPOINT: str = get_env("AWS_S3_ENDPOINT")
    AWS_S3_BUCKET: str = get_env("AWS_S3_BUCKET")
    # Cloudflare R2
    CLOUDFLARE_R2_ACCESS_KEY_ID: str = get_env("CLOUDFLARE_R2_ACCESS_KEY_ID")
    CLOUDFLARE_R2_ACCESS_KEY_SECRET: str = get_env("CLOUDFLARE_R2_ACCESS_KEY_SECRET")
    CLOUDFLARE_R2_ENDPOINT: str = get_env("CLOUDFLARE_R2_ENDPOINT")
    CLOUDFLARE_R2_BUCKET: str = get_env("CLOUDFLARE_R2_BUCKET")
    # Resend
    RESEND_API_KEY: str = get_env("RESEND_API_KEY")
    # OpenAI
    OPENAI_API_KEY: str = get_env("OPENAI_API_KEY")
    OPENAI_BASE_URL: str = get_env("OPENAI_BASE_URL")
    OPENAI_MODEL: str = get_env("OPENAI_MODEL")
    # Anthropic
    ANTHROPIC_API_KEY: str = get_env("ANTHROPIC_API_KEY")
    ANTHROPIC_BASE_URL: str = get_env("ANTHROPIC_BASE_URL")
    CLAUDE_MODEL: str = get_env("CLAUDE_MODEL")
    # Google Gemini
    GOOGLE_GEMINI_API_KEY: str = get_env("GOOGLE_GEMINI_API_KEY")
    GOOGLE_GEMINI_BASE_URL: str = get_env("GOOGLE_GEMINI_BASE_URL")
    GOOGLE_GEMINI_MODEL: str = get_env("GOOGLE_GEMINI_MODEL")

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
    settings_whitelist = settings.WHITELISTING_EMAILS.split(",")
except ValidationError as exc:
    loguru_logger.error(f"Failed to parse settings, err: {exc.json(indent=4)}")

# Auth headers
auth_header_uid = APIKeyHeader(name="x-sec-uid", scheme_name="header for user id")
auth_header_account = APIKeyHeader(name="x-sec-account", scheme_name="header for user account")
auth_header_token = APIKeyHeader(name="x-sec-token", scheme_name="header for access token")

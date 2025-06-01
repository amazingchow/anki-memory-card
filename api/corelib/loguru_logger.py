# -*- coding: utf-8 -*-
import os
import sys

from loguru import logger as loguru_logger

from corelib.config import settings


def _env(key, type_, default=None):
    if key not in os.environ:
        return default

    val = os.environ[key]

    if type_ == str:
        return val
    elif type_ == bool:
        if val.lower() in ["1", "true", "yes", "y", "ok", "on"]:
            return True
        if val.lower() in ["0", "false", "no", "n", "nok", "off"]:
            return False
        raise ValueError(
            "Invalid environment variable '%s' (expected a boolean): '%s'" % (key, val)
        )
    elif type_ == int:
        try:
            return int(val)
        except ValueError:
            raise ValueError(
                "Invalid environment variable '%s' (expected an integer): '%s'" % (key, val)
            ) from None


def init_global_logger():
    # remove default logger
    loguru_logger.remove()
    # loguru_logger.configure() must be called before loguru_logger.add()
    loguru_logger.configure(extra={
        "pid": os.getpid(), "trace_id": ""
    })
    # add new logger
    if settings.LOG_PRINTER.lower() == "disk" and len(settings.LOG_PRINTER_FILENAME) > 0:
        loguru_logger.add(
            sink=settings.LOG_PRINTER_FILENAME,
            level=settings.LOG_LEVEL.upper(),
            format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
                "<level>{level: <8}</level> | "
                "<red>pid={extra[pid]}</red> <red>trace_id={extra[trace_id]}</red> | "
                "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
                "- <level>{message}</level>",
            colorize=_env("LOGURU_COLORIZE", bool, False),
            serialize=_env("LOGURU_SERIALIZE", bool, False),
            backtrace=_env("LOGURU_BACKTRACE", bool, True),
            diagnose=_env("LOGURU_DIAGNOSE", bool, True),
            enqueue=_env("LOGURU_ENQUEUE", bool, False),
            catch=_env("LOGURU_CATCH", bool, True),
            rotation="256 MB"
        )
    else:
        loguru_logger.add(
            sink=sys.stderr,
            level=settings.LOG_LEVEL.upper(),
            format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
                "<level>{level: <8}</level> | "
                "<red>pid={extra[pid]}</red> <red>trace_id={extra[trace_id]}</red> | "
                "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
                "- <level>{message}</level>",
            colorize=_env("LOGURU_COLORIZE", bool, False),
            serialize=_env("LOGURU_SERIALIZE", bool, False),
            backtrace=_env("LOGURU_BACKTRACE", bool, True),
            diagnose=_env("LOGURU_DIAGNOSE", bool, True),
            enqueue=_env("LOGURU_ENQUEUE", bool, False),
            catch=_env("LOGURU_CATCH", bool, True)
        )


def init_task_logger():
    # remove default logger
    loguru_logger.remove()
    # loguru_logger.configure() must be called before loguru_logger.add()
    loguru_logger.configure(extra={
        "task_id": "", "uid": ""
    })
    # add new logger
    if settings.CELERY_WORKER_LOG_PRINTER.lower() == "disk" and len(settings.CELERY_WORKER_LOG_PRINTER_FILENAME) > 0:
        loguru_logger.add(
            sink=settings.CELERY_WORKER_LOG_PRINTER_FILENAME,
            level=settings.CELERY_WORKER_LOG_LEVEL.upper(),
            format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
                "<level>{level: <8}</level> | "
                "<red>task_id={extra[task_id]}</red> <red>uid={extra[uid]}</red> | "
                "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
                "- <level>{message}</level>",
            colorize=_env("LOGURU_COLORIZE", bool, False),
            serialize=_env("LOGURU_SERIALIZE", bool, False),
            backtrace=_env("LOGURU_BACKTRACE", bool, True),
            diagnose=_env("LOGURU_DIAGNOSE", bool, True),
            enqueue=_env("LOGURU_ENQUEUE", bool, False),
            catch=_env("LOGURU_CATCH", bool, True),
            rotation="256 MB"
        )
    else:
        loguru_logger.add(
            sink=sys.stderr,
            level=settings.LOG_LEVEL.upper(),
            format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
                "<level>{level: <8}</level> | "
                "<red>task_id={extra[task_id]}</red> <red>uid={extra[uid]}</red> | "
                "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
                "- <level>{message}</level>",
            colorize=_env("LOGURU_COLORIZE", bool, False),
            serialize=_env("LOGURU_SERIALIZE", bool, False),
            backtrace=_env("LOGURU_BACKTRACE", bool, True),
            diagnose=_env("LOGURU_DIAGNOSE", bool, True),
            enqueue=_env("LOGURU_ENQUEUE", bool, False),
            catch=_env("LOGURU_CATCH", bool, True)
        )

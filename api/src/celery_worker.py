import celery
from loguru import logger as loguru_logger

from corelib.config import settings
from corelib.tasks import SendActivationEmailTask, SendPasswordResetEmailTask


def init_runtime_env():
    # init_task_logger()
    loguru_logger.info(
        "------------------------------------------------------------------------"
    )
    loguru_logger.info("Celery worker runtime environment initialized.")
    loguru_logger.info(
        "------------------------------------------------------------------------"
    )


def init_celery():
    registered_tasks = [SendActivationEmailTask, SendPasswordResetEmailTask]
    celery_inst = celery.Celery(
        __name__,
        broker=settings.CELERY_BROKER_URL,
        backend=settings.CELERY_RESULT_BACKEND_URL,
        set_as_current=True,
    )
    for task in registered_tasks:
        celery_inst.register_task(task)
    return celery_inst


class CeleryManager:
    _instance = None
    _celery_inst = None

    def __init__(self):
        raise RuntimeError("Call get_instance() instead")

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls.__new__(cls)
            init_runtime_env()
            cls._celery_inst = init_celery()
        return cls._instance

    def get_celery_inst(self):
        return self._celery_inst


celery_inst = CeleryManager.get_instance().get_celery_inst()

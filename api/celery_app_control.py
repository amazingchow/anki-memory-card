# -*- coding: utf-8 -*-
from celery.app.control import Control as CeleryControl
from loguru import logger as loguru_logger

from celery_client_instance import celery_inst as app

celery_app_control_inst = CeleryControl(app)
loguru_logger.debug("Celery control client inited.")

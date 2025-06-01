# -*- coding: utf-8 -*-
import json
import uuid


def new_task_id() -> str:
    return uuid.uuid4().hex


def new_task_params(**kwargs) -> tuple[str, str]:
    task_id = new_task_id()
    return (task_id, json.dumps({
        "task_id": task_id,
        **kwargs
    }))

from celery_client_instance import celery_inst as app


@app.task(name="IntelliVocab.send_activation_email")
def send_activation_email_task(task_params: str):
    pass


@app.task(name="IntelliVocab.send_password_reset_email")
def send_password_reset_email_task(task_params: str):
    pass

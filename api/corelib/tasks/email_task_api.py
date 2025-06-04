from celery_client_instance import celery_inst as app


@app.task(name="send-activation-email-task")
def send_activation_email_task(task_params: str):
    pass


@app.task(name="send-password-reset-email-task")
def send_password_reset_email_task(task_params: str):
    pass

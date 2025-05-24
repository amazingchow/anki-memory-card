import json
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import celery
import resend
from jinja2 import Template
from loguru import logger as loguru_logger

from corelib.config import settings
from corelib.security import encrypt_aes


def render_email_template(*, template_name: str, context: dict[str, Any]) -> str:
    template_str = (
        Path(__file__).parent.parent.parent / "email-templates" / template_name
    ).read_text()
    html_content = Template(template_str).render(context)
    return html_content


def send_email(email: str, subject: str, html_content: str) -> tuple[str | None, bool]:
    """Send email."""
    try:
        resend.api_key = settings.RESEND_API_KEY
        response = resend.Emails.send(
            {
                "from": settings.RESEND_FROM_EMAIL,
                "to": email,
                "subject": subject,
                "html": html_content,
            }
        )
        if (response is not None) and (response["id"] is not None):
            return (response["id"], True)
        else:
            return (None, False)
    except Exception as exc:
        loguru_logger.error(f"Failed to send email: {str(exc)}")
        return (None, False)


class SendActivationEmailTask(celery.Task):
    name = "IntelliVocab.send_activation_email"

    def run(self, task_params: str):
        params = json.loads(task_params)
        task_id = params["task_id"]
        email = params["email"]

        with loguru_logger.contextualize(task_id=task_id):
            loguru_logger.info("To exec task...")
            loguru_logger.debug(f"Task params: {params}.")
            start_at = time.perf_counter()
            try:
                subject = "Welcome to IntelliVocab - Activate Your Account"
                # Create data with expiration time
                expiration_time = datetime.now(timezone.utc) + timedelta(hours=24)
                data = {"email": email, "expires_at": expiration_time.isoformat()}
                # Encrypt the data
                encrypted_data = encrypt_aes(json.dumps(data))
                html_content = render_email_template(
                    template_name="new_account.html",
                    context={
                        "frontend_url": settings.FRONTEND_URL,
                        "encrypted_data": encrypted_data,
                    },
                )
                send_email(email, subject, html_content)
            finally:
                end_at = time.perf_counter()
                loguru_logger.info(
                    f"Finished task, used time: {end_at - start_at:.3f}s."
                )


class SendPasswordResetEmailTask(celery.Task):
    name = "IntelliVocab.send_password_reset_email"

    def run(self, task_params: str):
        params = json.loads(task_params)
        task_id = params["task_id"]
        email = params["email"]
        reset_token = params["reset_token"]

        with loguru_logger.contextualize(task_id=task_id):
            loguru_logger.info("To exec task...")
            loguru_logger.debug(f"Task params: {params}.")
            start_at = time.perf_counter()
            try:
                subject = "Reset Your IntelliVocab Password"
                html_content = render_email_template(
                    template_name="reset_password.html",
                    context={
                        "frontend_url": settings.FRONTEND_URL,
                        "reset_token": reset_token,
                    },
                )
                send_email(email, subject, html_content)
            finally:
                end_at = time.perf_counter()
                loguru_logger.info(
                    f"Finished task, used time: {end_at - start_at:.3f}s."
                )

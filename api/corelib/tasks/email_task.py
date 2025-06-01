# -*- coding: utf-8 -*-
import json
import time
from datetime import datetime, timedelta, timezone

import celery
import resend
from loguru import logger as loguru_logger

from corelib.config import settings
from corelib.security import encrypt_aes


def send_email(email: str, subject: str, html_content: str) -> tuple[str | None, bool]:
    """
    Send email.
    """
    try:
        resend.api_key = settings.RESEND_API_KEY
        response = resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to": email,
            "subject": subject,
            "html": html_content
        })
        if (response is not None) and (response['id'] is not None):
            return (response['id'], True)
        else:
            return (None, False)
    except Exception as exc:
        loguru_logger.error(f"Failed to send email: {str(exc)}")
        return (None, False)


class SendActivationEmailTask(celery.Task):
    name = "send-activation-email-task"
    
    def run(self, task_params: str):
        params = json.loads(task_params)
        task_id = params["task_id"]
        email = params["email"]

        with loguru_logger.contextualize(task_id=task_id):
            loguru_logger.info("To exec task...")
            loguru_logger.debug(f"Task params: {params}.")
            start_at = time.perf_counter()
            try:
                subject = "Welcome to Anki AI - Activate Your Account"
                # Create data with expiration time
                expiration_time = datetime.now(timezone.utc) + timedelta(hours=24)
                data = {
                    "email": email,
                    "expires_at": expiration_time.isoformat()
                }
                # Encrypt the data
                encrypted_data = encrypt_aes(json.dumps(data))
                html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background-color: hsl(var(--primary));
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }}
        .content {{
            background-color: white;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
        }}
        .button {{
            display: inline-block;
            background-color: hsl(var(--primary));
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
        }}
        .footer {{
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 14px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Anki AI!</h1>
        </div>
        <div class="content">
            <p>Thank you for joining Anki AI! We're excited to have you on board.</p>
            <p>To get started and activate your account, please click the button below:</p>
            <div style="text-align: left;">
                <a href="{settings.FRONTEND_URL}/activate?token={encrypted_data}" class="button">Activate Account</a>
            </div>
            <p>If you did not create this account, you can safely ignore this email.</p>
            <p>This activation link will expire in 24 hours.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The Anki AI Team</p>
            <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
"""
                send_email(email, subject, html_content)
            finally:
                end_at = time.perf_counter()
                loguru_logger.info(f"Finished task, used time: {end_at - start_at:.3f}s.")


class SendPasswordResetEmailTask(celery.Task):
    name = "send-password-reset-email-task"
    
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
                subject = "Reset Your Anki AI Password"
                html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .header {{
            background-color: hsl(var(--primary));
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }}
        .content {{
            background-color: white;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
        }}
        .button {{
            display: inline-block;
            background-color: hsl(var(--primary));
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 500;
        }}
        .footer {{
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 14px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Reset Your Password</h1>
        </div>
        <div class="content">
            <p>We received a request to reset your Anki AI account password.</p>
            <p>To reset your password, please click the button below:</p>
            <div style="text-align: left;">
                <a href="{settings.FRONTEND_URL}/reset-password?token={reset_token}" class="button">Reset Password</a>
            </div>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
            <p>This password reset link will expire in 1 hour.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The Anki AI Team</p>
            <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
"""
                send_email(email, subject, html_content)
            finally:
                end_at = time.perf_counter()
                loguru_logger.info(f"Finished task, used time: {end_at - start_at:.3f}s.")

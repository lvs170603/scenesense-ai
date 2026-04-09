"""
services/email_service.py
Sends transactional emails via Brevo SMTP using Python's built-in smtplib.
No third-party Brevo SDK required.
"""

from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import config

logger = logging.getLogger(__name__)


def send_otp_email(recipient_email: str, recipient_name: str, otp: str) -> None:
    """
    Send an OTP verification email to *recipient_email* via Brevo SMTP.

    Raises
    ------
    RuntimeError
        If SMTP credentials are not configured or the send fails.
    """
    if not config.BREVO_SMTP_LOGIN or not config.BREVO_SMTP_PASSWORD:
        raise RuntimeError(
            "Brevo SMTP credentials are not set. "
            "Please fill BREVO_SMTP_LOGIN and BREVO_SMTP_PASSWORD in .env"
        )

    subject = "Verify your SceneSense AI account"

    # ── Plain-text body ──────────────────────────────────────────────
    plain_body = (
        f"Hi {recipient_name},\n\n"
        f"Your OTP for email verification is:\n\n"
        f"  {otp}\n\n"
        f"This OTP will expire in {config.OTP_EXPIRY_MINUTES} minutes.\n\n"
        f"If you did not request this, please ignore this email.\n\n"
        f"— SceneSense AI Team"
    )

    # ── HTML body ────────────────────────────────────────────────────
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #0F172A; color: #F1F5F9; margin: 0; padding: 0; }}
    .container {{ max-width: 480px; margin: 40px auto; background: #1E293B; border-radius: 16px;
                  border: 1px solid rgba(124,58,237,0.3); overflow: hidden; }}
    .header {{ background: linear-gradient(135deg, #7C3AED, #06B6D4); padding: 32px 40px; text-align: center; }}
    .header h1 {{ margin: 0; font-size: 22px; color: #fff; letter-spacing: -0.5px; }}
    .body {{ padding: 36px 40px; }}
    .greeting {{ font-size: 15px; color: #CBD5E1; margin-bottom: 24px; }}
    .otp-box {{ background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.4);
                border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }}
    .otp-code {{ font-size: 42px; font-weight: 700; letter-spacing: 10px; color: #F1F5F9;
                 font-family: 'Courier New', monospace; }}
    .expiry {{ font-size: 13px; color: #94A3B8; margin-top: 10px; }}
    .note {{ font-size: 12px; color: #64748B; margin-top: 24px; line-height: 1.6; }}
    .footer {{ background: rgba(0,0,0,0.2); padding: 16px 40px; text-align: center;
               font-size: 11px; color: #475569; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎬 SceneSense AI</h1>
    </div>
    <div class="body">
      <p class="greeting">Hi <strong>{recipient_name}</strong>,<br/>
         Verify your email to start using SceneSense AI.</p>
      <div class="otp-box">
        <div class="otp-code">{otp}</div>
        <div class="expiry">⏱ Expires in {config.OTP_EXPIRY_MINUTES} minutes</div>
      </div>
      <p class="note">
        Enter this code on the verification page.<br/>
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">© 2025 SceneSense AI · All rights reserved</div>
  </div>
</body>
</html>
"""

    # ── Build MIME message ───────────────────────────────────────────
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{config.BREVO_SENDER_NAME} <{config.BREVO_SENDER_EMAIL}>"
    msg["To"] = recipient_email

    msg.attach(MIMEText(plain_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    # ── Send via SMTP ────────────────────────────────────────────────
    try:
        with smtplib.SMTP(config.BREVO_SMTP_HOST, config.BREVO_SMTP_PORT, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.login(config.BREVO_SMTP_LOGIN, config.BREVO_SMTP_PASSWORD)
            server.sendmail(config.BREVO_SENDER_EMAIL, recipient_email, msg.as_string())
        logger.info("OTP email sent to %s", recipient_email)
    except smtplib.SMTPException as exc:
        logger.error("Failed to send OTP email: %s", exc)
        raise RuntimeError(f"Email delivery failed: {exc}") from exc
    except OSError as exc:
        logger.error("SMTP connection error: %s", exc)
        raise RuntimeError(f"SMTP connection failed: {exc}") from exc

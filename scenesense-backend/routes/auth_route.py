"""
routes/auth_route.py
Auth blueprint: signup, verify-otp, resend-otp, login.
"""

from __future__ import annotations

import logging
import re
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt
from flask import Blueprint, jsonify, request

import config
from models import user_model
from services.email_service import send_otp_email

logger = logging.getLogger(__name__)
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

# ── helpers ──────────────────────────────────────────────────────────

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _err(msg: str, status: int = 400):
    return jsonify({"success": False, "message": msg}), status


def _ok(data: dict, status: int = 200):
    return jsonify({"success": True, **data}), status


def _make_jwt(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=config.JWT_EXPIRY_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, config.JWT_SECRET, algorithm="HS256")


# ── POST /auth/signup ─────────────────────────────────────────────────


@auth_bp.post("/signup")
def signup():
    data = request.get_json(silent=True) or {}
    full_name = (data.get("full_name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    confirm = data.get("confirm_password") or ""

    # Validate inputs
    if not full_name:
        return _err("Full name is required")
    if not EMAIL_RE.match(email):
        return _err("A valid email address is required")
    if len(password) < 6:
        return _err("Password must be at least 6 characters")
    if password != confirm:
        return _err("Passwords do not match")

    # Check duplicate
    if user_model.find_by_email(email):
        return _err("An account with this email already exists")

    # Hash password
    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    # Create user (includes OTP + expiry)
    user = user_model.create_user(full_name, email, pw_hash)

    # Send OTP email
    try:
        send_otp_email(email, full_name, user["otp"])
    except RuntimeError as exc:
        logger.error("Email send error during signup: %s", exc)
        # Don't block signup — user can resend OTP
        return _ok(
            {
                "message": "Account created but email delivery failed. Use Resend OTP.",
                "email": email,
                "email_sent": False,
            },
            201,
        )

    return _ok(
        {
            "message": "Account created. Please verify your email.",
            "email": email,
            "email_sent": True,
        },
        201,
    )


# ── POST /auth/verify-otp ─────────────────────────────────────────────


@auth_bp.post("/verify-otp")
def verify_otp():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    otp = (data.get("otp") or "").strip()

    if not email or not otp:
        return _err("Email and OTP are required")

    ok, reason = user_model.verify_otp(email, otp)
    if not ok:
        return _err(reason)

    user_model.mark_verified(email)
    return _ok({"message": "Email verified successfully. You can now log in."})


# ── POST /auth/resend-otp ─────────────────────────────────────────────


@auth_bp.post("/resend-otp")
def resend_otp():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()

    if not email:
        return _err("Email is required")

    user = user_model.find_by_email(email)
    if not user:
        return _err("No account found with this email")

    if user.get("is_verified"):
        return _err("This email is already verified")

    new_otp = user_model.save_otp(email)
    if not new_otp:
        return _err("Failed to generate OTP. Please try again.")

    try:
        send_otp_email(email, user.get("full_name", "User"), new_otp)
    except RuntimeError as exc:
        logger.error("Email send error during resend: %s", exc)
        return _err("Failed to send OTP email. Please check SMTP configuration.")

    return _ok({"message": "A new OTP has been sent to your email."})


# ── POST /auth/login ──────────────────────────────────────────────────


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return _err("Email and password are required")

    user = user_model.find_by_email(email)
    if not user:
        return _err("Invalid email or password", 401)

    # Check password
    stored_hash = user.get("password_hash", "")
    if not bcrypt.checkpw(password.encode(), stored_hash.encode()):
        return _err("Invalid email or password", 401)

    # Check verification
    if not user.get("is_verified"):
        return _ok(
            {
                "message": "Email not verified. Please verify your OTP.",
                "verified": False,
                "email": email,
            },
            403,
        )

    # Generate JWT
    token = _make_jwt(str(user["_id"]), email)

    return _ok(
        {
            "message": "Login successful",
            "verified": True,
            "token": token,
            "user": {
                "full_name": user.get("full_name"),
                "email": email,
            },
        }
    )

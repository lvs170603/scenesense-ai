"""
config.py – Centralised configuration loaded from environment variables.
All service classes and routes import from here; no raw os.getenv calls elsewhere.
"""

import os
import dns.resolver

# Fix for "The DNS operation timed out" on Ubuntu/WSL when using mongodb+srv://
try:
    dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
    dns.resolver.default_resolver.nameservers = ['8.8.8.8', '1.1.1.1']
except Exception:
    pass

from dotenv import load_dotenv

load_dotenv()

# ──────────────────────────────────────────────
# Server
# ──────────────────────────────────────────────
FLASK_ENV: str = os.getenv("FLASK_ENV", "development")
PORT: int = int(os.getenv("PORT", 5000))
DEBUG: bool = FLASK_ENV == "development"

# ──────────────────────────────────────────────
# File storage
# ──────────────────────────────────────────────
BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER: str = os.path.join(BASE_DIR, "static", "uploads")
AUDIO_FOLDER: str = os.path.join(BASE_DIR, "static", "audio")
ALLOWED_EXTENSIONS: set[str] = {"png", "jpg", "jpeg", "webp", "gif"}
MAX_CONTENT_LENGTH: int = 16 * 1024 * 1024  # 16 MB

# ──────────────────────────────────────────────
# MongoDB
# ──────────────────────────────────────────────
MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "scenesense")

# ──────────────────────────────────────────────
# JWT
# ──────────────────────────────────────────────
JWT_SECRET: str = os.getenv("JWT_SECRET", "change-me-in-production")
JWT_EXPIRY_HOURS: int = int(os.getenv("JWT_EXPIRY_HOURS", 24))

# ──────────────────────────────────────────────
# Brevo SMTP
# ──────────────────────────────────────────────
BREVO_SMTP_HOST: str = os.getenv("BREVO_SMTP_HOST", "smtp-relay.brevo.com")
BREVO_SMTP_PORT: int = int(os.getenv("BREVO_SMTP_PORT", 587))
BREVO_SMTP_LOGIN: str = os.getenv("BREVO_SMTP_LOGIN", "")
BREVO_SMTP_PASSWORD: str = os.getenv("BREVO_SMTP_PASSWORD", "")
BREVO_SENDER_EMAIL: str = os.getenv("BREVO_SENDER_EMAIL", "no-reply@scenesense.ai")
BREVO_SENDER_NAME: str = os.getenv("BREVO_SENDER_NAME", "SceneSense AI")

# ──────────────────────────────────────────────
# OTP
# ──────────────────────────────────────────────
OTP_EXPIRY_MINUTES: int = int(os.getenv("OTP_EXPIRY_MINUTES", 5))

# ──────────────────────────────────────────────
# Model identifiers
# ──────────────────────────────────────────────
BLIP_MODEL_ID: str = "Salesforce/blip-image-captioning-large"
TRANSLATION_MODEL_EN_HI: str = "Helsinki-NLP/opus-mt-en-hi"
TRANSLATION_MODEL_EN_TE: str = "Helsinki-NLP/opus-mt-en-mul"   # multilingual covers Telugu

# ──────────────────────────────────────────────
# Ensure runtime directories exist
# ──────────────────────────────────────────────
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)

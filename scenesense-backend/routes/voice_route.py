"""
routes/voice_route.py
POST /voice – converts text to speech and returns the audio file URL.
"""

from __future__ import annotations

import logging
from flask import Blueprint, request, jsonify

from services.voice_service import voice_service

logger = logging.getLogger(__name__)
voice_bp = Blueprint("voice", __name__)

VALID_LANGUAGES = {"en", "hi", "te"}


@voice_bp.post("/voice")
def generate_voice():
    """
    Body JSON: ``{ "text": "...", "language": "en|hi|te" }``

    Returns
    -------
    JSON ``{ "audio_url": "/static/audio/<file>.mp3", "filename": "<file>.mp3" }``
    """
    body = request.get_json(silent=True) or {}
    text: str = body.get("text", "").strip()
    language: str = body.get("language", "en").strip().lower()

    if not text:
        return jsonify({"error": "text is required"}), 400

    if language not in VALID_LANGUAGES:
        return jsonify({"error": f"language must be one of {sorted(VALID_LANGUAGES)}"}), 400

    try:
        result = voice_service.generate(text, language=language)
        return jsonify({
            "audio_url": result["url"],
            "filename": result["filename"],
        }), 200
    except Exception as exc:
        logger.exception("Voice generation failed: %s", exc)
        return jsonify({"error": "Voice generation failed. Please try again."}), 500

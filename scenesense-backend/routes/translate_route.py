"""
routes/translate_route.py
POST /translate – translates a caption to the requested language.
"""

from __future__ import annotations

import logging
from flask import Blueprint, request, jsonify

from services.translation_service import translation_service, _MODEL_MAP
from models.history_model import insert_history

logger = logging.getLogger(__name__)
translate_bp = Blueprint("translate", __name__)

VALID_LANGUAGES = set(_MODEL_MAP.keys())
VALID_LANGUAGES.add("en")


@translate_bp.post("/translate")
def translate_caption():
    """
    Body JSON::

        {
            "text": "<english caption>",
            "language": "en|hi|te",
            "image_name": "<filename>",    // optional, for history
            "original_caption": "<text>",  // optional, for history
            "mode": "simple|detailed|story" // optional, for history
        }

    Returns
    -------
    JSON ``{ "translated_text": "...", "language": "...", "history_id": "..." }``
    """
    body = request.get_json(silent=True) or {}
    text: str = body.get("text", "").strip()
    language: str = body.get("language", "en").strip().lower()

    if not text:
        return jsonify({"error": "text is required"}), 400

    if language not in VALID_LANGUAGES:
        return jsonify({"error": f"language must be one of {sorted(VALID_LANGUAGES)}"}), 400

    try:
        translated = translation_service.translate(text, target_lang=language)  # type: ignore[arg-type]

        # Persist to MongoDB if caller supplied extra context
        history_id = None
        image_name = body.get("image_name", "")
        original_caption = body.get("original_caption", text)
        mode = body.get("mode", "simple")

        if image_name:
            history_id = insert_history(
                image_name=image_name,
                caption=original_caption,
                translated_caption=translated,
                language=language,
                mode=mode,
            )

        return jsonify({
            "translated_text": translated,
            "language": language,
            "history_id": history_id,
        }), 200
    except Exception as exc:
        logger.exception("Translation failed: %s", exc)
        return jsonify({"error": "Translation failed. Please try again."}), 500

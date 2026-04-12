"""
routes/history_route.py
GET /history – returns paginated caption history from MongoDB.
"""

from __future__ import annotations

import logging
from flask import Blueprint, request, jsonify

from models.history_model import get_history

logger = logging.getLogger(__name__)
history_bp = Blueprint("history", __name__)


@history_bp.get("/history")
def fetch_history():
    """
    Query params:
        ``limit`` (int, default 20) – max records per page
        ``skip``  (int, default 0)  – records to skip

    Returns
    -------
    JSON ``{ "history": [...], "count": <int> }``
    """
    try:
        limit = int(request.args.get("limit", 20))
        skip = int(request.args.get("skip", 0))
        limit = max(1, min(limit, 100))  # clamp 1..100
        skip = max(0, skip)
    except ValueError:
        return jsonify({"error": "limit and skip must be integers"}), 400

    try:
        records = get_history(limit=limit, skip=skip)
        return jsonify({"history": records, "count": len(records)}), 200
    except Exception as exc:
        logger.exception("History fetch failed: %s", exc)
        return jsonify({"error": "Could not retrieve history."}), 500


@history_bp.post("/history")
def save_history():
    """
    Body JSON::

        {
            "image_name": "<filename>",
            "caption": "<text>",
            "translated_caption": "<text>",
            "language": "en|hi|... etc",
            "mode": "simple|detailed|story",
            "audio_url": "/static/audio/..." // optional
        }

    Returns
    -------
    JSON ``{ "message": "History saved", "history_id": "..." }``
    """
    body = request.get_json(silent=True) or {}
    image_name = body.get("image_name", "")
    caption = body.get("caption", "")
    translated_caption = body.get("translated_caption", "")
    language = body.get("language", "en")
    mode = body.get("mode", "simple")
    audio_url = body.get("audio_url", None)

    if not image_name or not caption:
        return jsonify({"error": "image_name and caption are required"}), 400

    try:
        from models.history_model import insert_history
        history_id = insert_history(
            image_name=image_name,
            caption=caption,
            translated_caption=translated_caption,
            language=language,
            mode=mode,
            audio_url=audio_url,
        )

        return jsonify({
            "message": "History saved",
            "history_id": history_id,
        }), 201
    except Exception as exc:
        logger.exception("History save failed: %s", exc)
        return jsonify({"error": "Failed to save history."}), 500


@history_bp.delete("/history/<history_id>")
def remove_history(history_id):
    """
    Deletes a specific history record globally.

    Returns
    -------
    JSON ``{ "message": "Deleted successfully" }`` or 404 error
    """
    try:
        from models.history_model import delete_history
        success = delete_history(history_id)
        if success:
            return jsonify({"message": "Deleted successfully"}), 200
        else:
            return jsonify({"error": "Record not found or invalid format"}), 404
    except Exception as exc:
        logger.exception("Failed to process delete request: %s", exc)
        return jsonify({"error": "Internal server error"}), 500

"""
routes/caption_route.py
POST /caption – generates an English caption for a previously uploaded image.
"""

from __future__ import annotations

import os
import logging
from flask import Blueprint, request, jsonify

import config
from services.caption_service import caption_service

logger = logging.getLogger(__name__)
caption_bp = Blueprint("caption", __name__)

VALID_MODES = {"simple", "detailed", "story"}


@caption_bp.post("/caption")
def generate_caption():
    """
    Body JSON: ``{ "filename": "<saved_name>", "mode": "simple|detailed|story" }``

    Returns
    -------
    JSON  ``{ "caption": "...", "mode": "..." }``
    """
    body = request.get_json(silent=True) or {}
    filename: str = body.get("filename", "").strip()
    mode: str = body.get("mode", "simple").strip().lower()

    if not filename:
        return jsonify({"error": "filename is required"}), 400

    if mode not in VALID_MODES:
        return jsonify({"error": f"mode must be one of {sorted(VALID_MODES)}"}), 400

    image_path = os.path.join(config.UPLOAD_FOLDER, filename)
    if not os.path.exists(image_path):
        return jsonify({"error": "Image not found. Please upload the image first."}), 404

    try:
        caption = caption_service.generate(image_path, mode=mode)  # type: ignore[arg-type]
        return jsonify({"caption": caption, "mode": mode}), 200
    except Exception as exc:
        logger.exception("Caption generation failed: %s", exc)
        return jsonify({"error": "Caption generation failed. Please try again."}), 500

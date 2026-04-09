"""
routes/upload_route.py
POST /upload – accepts a multipart image, saves it, returns the filename.
"""

from __future__ import annotations

import os
import uuid
import logging
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app

import config

logger = logging.getLogger(__name__)
upload_bp = Blueprint("upload", __name__)


def _allowed_file(filename: str) -> bool:
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in config.ALLOWED_EXTENSIONS
    )


@upload_bp.post("/upload")
def upload_image():
    """
    Accepts a multipart/form-data POST with an ``image`` field.

    Returns
    -------
    JSON  ``{ "filename": "<saved_name>", "preview_url": "/static/uploads/<saved_name>" }``
    """
    if "image" not in request.files:
        return jsonify({"error": "No image field in request"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not _allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Use PNG, JPG, JPEG, WEBP, or GIF."}), 415

    ext = file.filename.rsplit(".", 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    save_path = os.path.join(config.UPLOAD_FOLDER, unique_name)
    file.save(save_path)
    logger.info("Image uploaded: %s", save_path)

    return jsonify({
        "filename": unique_name,
        "preview_url": f"/static/uploads/{unique_name}",
    }), 200

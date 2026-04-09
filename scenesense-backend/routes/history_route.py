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

"""
app.py – Flask application factory.
Registers all route blueprints and configures CORS and file size limits.
"""

from flask import Flask
from flask_cors import CORS
import config
from routes.upload_route import upload_bp
from routes.caption_route import caption_bp
from routes.translate_route import translate_bp
from routes.voice_route import voice_bp
from routes.history_route import history_bp
from routes.auth_route import auth_bp


def create_app() -> Flask:
    app = Flask(__name__, static_folder="static")

    # ── Configuration ────────────────────────────────────────────────
    app.config["MAX_CONTENT_LENGTH"] = config.MAX_CONTENT_LENGTH
    app.config["UPLOAD_FOLDER"] = config.UPLOAD_FOLDER
    app.config["AUDIO_FOLDER"] = config.AUDIO_FOLDER

    # ── CORS ─────────────────────────────────────────────────────────
    ALLOWED_ORIGINS = [
        "https://scene-sense-ai.vercel.app",
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
    ]
    CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}}, supports_credentials=True)

    # ── Blueprints ───────────────────────────────────────────────────
    app.register_blueprint(upload_bp)
    app.register_blueprint(caption_bp)
    app.register_blueprint(translate_bp)
    app.register_blueprint(voice_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(auth_bp)

    # ── Health check ─────────────────────────────────────────────────
    @app.get("/health")
    def health():
        return {"status": "ok", "service": "SceneSense AI"}

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG, threaded=True)

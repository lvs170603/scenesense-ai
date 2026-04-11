"""
services/voice_service.py
Converts text to speech using gTTS and saves an MP3 file in static/audio/.
"""

from __future__ import annotations

import logging
import os
import uuid

from gtts import gTTS

import config

logger = logging.getLogger(__name__)

# gTTS language code mapping
_LANG_MAP: dict[str, str] = {
    "en": "en",        # English
    "zh": "zh-CN",     # Chinese (Mandarin)
    "hi": "hi",        # Hindi
    "es": "es",        # Spanish
    "fr": "fr",        # French
    "ar": "ar",        # Arabic
    "bn": "bn",        # Bengali
    "pt": "pt",        # Portuguese
    "ru": "ru",        # Russian
    "ur": "ur",        # Urdu
    "id": "id",        # Indonesian
    "de": "de",        # German
    "ja": "ja",        # Japanese
    "sw": "sw",        # Swahili
    "mr": "mr",        # Marathi
    "te": "te",        # Telugu
    "tr": "tr",        # Turkish
    "ta": "ta",        # Tamil
    "ko": "ko",        # Korean
    "vi": "vi",        # Vietnamese
}


class VoiceService:
    """Wraps gTTS to generate an MP3 and return its web-accessible path."""

    def generate(self, text: str, language: str = "en") -> dict[str, str]:
        """
        Parameters
        ----------
        text:
            Text to convert to speech.
        language:
            ISO language code – ``"en"``, ``"hi"``, or ``"te"``.

        Returns
        -------
        dict with keys:
            ``filename`` – basename of the MP3 file stored in ``static/audio/``.
            ``url``      – relative URL path usable by the frontend.
        """
        lang_code = _LANG_MAP.get(language, "en")
        filename = f"audio_{uuid.uuid4().hex}.mp3"
        filepath = os.path.join(config.AUDIO_FOLDER, filename)

        tts = gTTS(text=text, lang=lang_code, slow=False)
        tts.save(filepath)
        logger.info("Audio saved: %s (lang=%s)", filepath, lang_code)

        return {
            "filename": filename,
            "url": f"/static/audio/{filename}",
        }


voice_service = VoiceService()

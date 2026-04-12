"""
services/voice_service.py
Converts text to speech using gTTS and saves an MP3 file in static/audio/.
"""

from __future__ import annotations

import logging
import os
import uuid
import config

import asyncio
import edge_tts

logger = logging.getLogger(__name__)

# Microsoft Edge TTS (Azure Neural) language voice mapping
_LANG_MAP: dict[str, str] = {
    "en": "en-US-AriaNeural",      # English
    "zh": "zh-CN-XiaoxiaoNeural",  # Chinese (Mandarin)
    "hi": "hi-IN-SwaraNeural",     # Hindi
    "es": "es-ES-ElviraNeural",    # Spanish
    "fr": "fr-FR-DeniseNeural",    # French
    "ar": "ar-SA-ZariyahNeural",   # Arabic
    "bn": "bn-IN-TanishaaNeural",  # Bengali
    "pt": "pt-BR-FranciscaNeural", # Portuguese
    "ru": "ru-RU-SvetlanaNeural",  # Russian
    "ur": "ur-PK-UzmaNeural",      # Urdu
    "id": "id-ID-GadisNeural",     # Indonesian
    "de": "de-DE-KatjaNeural",     # German
    "ja": "ja-JP-NanamiNeural",    # Japanese
    "sw": "sw-KE-ZuriNeural",      # Swahili
    "mr": "mr-IN-AarohiNeural",    # Marathi
    "te": "te-IN-ShrutiNeural",    # Telugu
    "tr": "tr-TR-EmelNeural",      # Turkish
    "ta": "ta-IN-PallaviNeural",   # Tamil
    "ko": "ko-KR-SunHiNeural",     # Korean
    "vi": "vi-VN-HoaiMyNeural",    # Vietnamese
}


class VoiceService:
    """Wraps Edge TTS (Azure Neural) to generate an MP3 and return its web-accessible path."""

    def generate(self, text: str, language: str = "en") -> dict[str, str]:
        """
        Parameters
        ----------
        text:
            Text to convert to speech.
        language:
            ISO language code.

        Returns
        -------
        dict with keys:
            ``filename`` – basename of the MP3 file stored in static/audio/.
            ``url``      – relative URL path usable by the frontend.
        """
        voice = _LANG_MAP.get(language, "en-US-AriaNeural")
        filename = f"audio_{uuid.uuid4().hex}.mp3"
        filepath = os.path.join(config.AUDIO_FOLDER, filename)

        # Run async edge-tts communication in a synchronous wrapper
        async def _synthesize():
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(filepath)

        asyncio.run(_synthesize())

        logger.info("Audio saved using Edge TTS: %s (voice=%s)", filepath, voice)

        return {
            "filename": filename,
            "url": f"/static/audio/{filename}",
        }


voice_service = VoiceService()

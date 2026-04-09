"""
services/translation_service.py
Translates English text → 20 Global Languages using Facebook's NLLB-200 600M model.
"""

from __future__ import annotations

import logging
from typing import Literal
import torch

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

logger = logging.getLogger(__name__)

# Facebook NLLB model id
MODEL_NAME = "facebook/nllb-200-distilled-600M"

# NLLB bcp-47 language codes
language_map = {
    "en": "eng_Latn",
    "zh": "zho_Hans",
    "hi": "hin_Deva",
    "es": "spa_Latn",
    "fr": "fra_Latn",
    "ar": "arb_Arab",
    "bn": "ben_Beng",
    "pt": "por_Latn",
    "ru": "rus_Cyrl",
    "ur": "urd_Arab",
    "id": "ind_Latn",
    "de": "deu_Latn",
    "ja": "jpn_Jpan",
    "sw": "swh_Latn",
    "mr": "mar_Deva",
    "te": "tel_Telu",
    "tr": "tur_Latn",
    "ta": "tam_Taml",
    "ko": "kor_Hang",
    "vi": "vie_Latn"
}

# _MODEL_MAP added for backwards compatibility with translate_route
_MODEL_MAP = language_map

# gTTS language codes for downstream use
GTTS_LANG_MAP: dict[str, str] = {
    l: l for l in _MODEL_MAP.keys()
}
GTTS_LANG_MAP["en"] = "en"
GTTS_LANG_MAP["zh"] = "zh-CN"


class TranslationService:
    """Lazy-loading NLLB translation service."""

    _instance: "TranslationService | None" = None
    _tokenizer: AutoTokenizer | None = None
    _model: AutoModelForSeq2SeqLM | None = None

    def __new__(cls) -> "TranslationService":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def _load(self) -> None:
        if self._model is not None:
            return

        logger.info("Loading NLLB-200 model '%s' ...", MODEL_NAME)
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        self._tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        self._model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME).to(device)
        
        logger.info("NLLB-200 model loaded on %s.", device)

    def translate(self, text: str, target_lang: str) -> str:
        """
        Translate *text* from English to *target_lang*.
        """
        if target_lang == "en":
            return text

        if target_lang not in language_map:
            raise ValueError(f"Unsupported target language: {target_lang!r}")

        self._load()
        
        target_code = language_map[target_lang]
        device = next(self._model.parameters()).device
        
        inputs = self._tokenizer(text, return_tensors="pt").to(device)
        
        with torch.no_grad():
            translated_tokens = self._model.generate(
                **inputs,
                forced_bos_token_id=self._tokenizer.convert_tokens_to_ids(target_code),
                max_length=200
            )
            
        result: str = self._tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]
        logger.info("Translated [%s -> %s]: %s", target_lang, target_code, result)
        return result


translation_service = TranslationService()

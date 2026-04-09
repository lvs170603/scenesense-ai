"""
services/caption_service.py
Wraps the Salesforce BLIP image-captioning model.

Mode behaviour
--------------
simple  → standard conditional captioning
detailed → longer, descriptive conditional captioning
story   → narrative-style conditional captioning
"""

from __future__ import annotations

import os
import logging
from pathlib import Path
from typing import Literal

from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
import config

logger = logging.getLogger(__name__)

CaptionMode = Literal["simple", "detailed", "story"]

_MODE_PROMPTS: dict[CaptionMode, str] = {
    "simple": "",
    "detailed": "a detailed description of",
    "story": "a creative story about",
}

_MAX_TOKENS: dict[CaptionMode, int] = {
    "simple": 60,
    "detailed": 120,
    "story": 200,
}


class CaptionService:
    """Singleton wrapper for BLIP. Model is lazy-loaded on first call."""

    _instance: "CaptionService | None" = None
    _processor: BlipProcessor | None = None
    _model: BlipForConditionalGeneration | None = None

    def __new__(cls) -> "CaptionService":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def _load(self) -> None:
        if self._processor is not None:
            return
        logger.info("Loading BLIP model – this may take a moment on first run …")
        self._processor = BlipProcessor.from_pretrained(config.BLIP_MODEL_ID)
        self._model = BlipForConditionalGeneration.from_pretrained(
            config.BLIP_MODEL_ID,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        )
        device = "cuda" if torch.cuda.is_available() else "cpu"
        self._model.to(device)
        logger.info("BLIP model loaded on %s.", device)

    def generate(self, image_path: str, mode: CaptionMode = "simple") -> str:
        """
        Generate a caption for the image at *image_path*.

        Parameters
        ----------
        image_path:
            Absolute path to the uploaded image file.
        mode:
            One of ``"simple"``, ``"detailed"``, or ``"story"``.

        Returns
        -------
        str
            The generated caption text.
        """
        self._load()

        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        raw_image = Image.open(image_path).convert("RGB")
        device = next(self._model.parameters()).device  # type: ignore[union-attr]
        
        # 1. Always generate the simple base caption via BLIP
        inputs = self._processor(raw_image, return_tensors="pt").to(device)  # type: ignore[misc]

        with torch.no_grad():
            out = self._model.generate(  # type: ignore[union-attr]
                **inputs, max_new_tokens=60
            )

        base_caption: str = self._processor.decode(out[0], skip_special_tokens=True)  # type: ignore[misc]

        if mode == "simple":
            logger.info("Caption (simple): %s", base_caption)
            return base_caption

        # 2. Expand using a fast LLM for Detailed / Story modes
        if not hasattr(self, "_llm") or self._llm is None:
            logger.info("Loading GPT-2 for stylistic expansion...")
            from transformers import pipeline
            import logging as hf_logging
            hf_logging.getLogger("transformers").setLevel(hf_logging.ERROR)
            self._llm = pipeline(
                "text-generation", 
                model="gpt2", 
                device=0 if torch.cuda.is_available() else -1
            )
            logger.info("GPT-2 loaded.")

        # Setup prompts based on style
        if mode == "detailed":
            prompt = f"A very detailed and highly descriptive paragraph about {base_caption}: The scene shows"
            max_len = 50
        else:
            prompt = f"Title: The Tale of {base_caption.title()}\nOnce upon a time, there was a {base_caption}. "
            max_len = 80

        logger.info("Expanding caption to %s mode using GPT-2...", mode)
        llm_out = self._llm(
            prompt,
            max_new_tokens=max_len,
            num_return_sequences=1,
            pad_token_id=50256,
            do_sample=True,
            temperature=0.8,
            top_p=0.9
        )

        final_text = llm_out[0]["generated_text"].strip()
        
        # Clean up the output so it looks like a continuous paragraph
        if mode == "detailed" and final_text.startswith(prompt):
            final_text = "The scene shows" + final_text[len(prompt):]
            
        logger.info("Caption (%s): %s", mode, final_text)
        return final_text


# Module-level singleton – import and call directly
caption_service = CaptionService()

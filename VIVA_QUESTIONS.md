# 🎓 SceneSense AI — Final Year B.Tech Viva Questions & Answers

**Project Title:** SceneSense AI: Multilingual Image Captioning with Voice Assistance  
**Stack:** React · Flask · MongoDB · BLIP · NLLB-200 · Edge-TTS  
**Total Questions:** 50 + 5 Bonus Power Answers

---

## 📋 Table of Contents

| Section | Questions | Focus |
|---|---|---|
| [📘 Basic](#-basic-questions-10) | B1 – B10 | Project overview, purpose, features |
| [📗 Intermediate](#-intermediate-questions-10) | I1 – I10 | Architecture, workflow, components |
| [📕 Technical](#-technical-questions-15) | T1 – T15 | BLIP, NLLB, edge-tts, APIs, inference |
| [📙 Advanced](#-advanced-questions-10) | A1 – A10 | Scalability, security, deployment |
| [📒 Tricky](#-tricky-questions-5) | TR1 – TR5 | Deep understanding & gotchas |
| [🌟 Bonus](#-bonus--5-one-line-power-answers) | — | One-line answers to impress examiner |

---

## 📘 Basic Questions (10)

---

**B1. What is SceneSense AI? Explain your project in one paragraph.**

> SceneSense AI is a full-stack AI-powered web application that automatically analyses an uploaded image, generates a descriptive caption using BLIP, translates that caption into any of 20 global languages using Facebook's NLLB-200, and synthesises natural-sounding speech using Microsoft Azure Neural voices via edge-tts. Users manage accounts with JWT-based authentication, and all successful generations are stored in MongoDB for future reference. The goal is to bridge the language gap in visual accessibility.

---

**B2. What is the main problem your project solves?**

> Most AI captioning tools only output captions in English, making them inaccessible to users who speak other languages. For visually impaired users or users in non-English speaking regions, this creates a huge barrier. SceneSense AI solves this by generating captions and voice output in 20 languages, making visual content accessible to a global, multilingual audience.

---

**B3. What is image captioning?**

> Image captioning is the task of automatically generating a natural language text description of the visual content in an image. It combines Computer Vision (understanding what is in the image) and Natural Language Processing (forming grammatically correct, meaningful sentences). Example: given a photo of a dog playing in a park, the system outputs — *"a dog running on green grass in a park."*

---

**B4. What are the key features of your project?**

> 1. **AI Image Captioning** — BLIP with Simple, Detailed, and Story modes.
> 2. **Multilingual Translation** — 20 languages via NLLB-200.
> 3. **Neural Voice Synthesis** — Microsoft Azure Neural voices via edge-tts.
> 4. **Secure Authentication** — JWT tokens + OTP email verification.
> 5. **History Tracking** — All generations stored in MongoDB.
> 6. **Recent Generations Sidebar** — Slide-in panel with inline audio playback and workspace reload.

---

**B5. What technologies did you use for the frontend?**

> React.js (Vite), Framer Motion for animations, Axios for HTTP requests, React Router DOM for routing, react-icons for icon set, and Vanilla CSS with glassmorphism design system.

---

**B6. What technologies did you use for the backend?**

> Python Flask, HuggingFace Transformers (BLIP + NLLB-200 + GPT-2), edge-tts for neural speech synthesis, PyMongo for MongoDB, Flask-CORS for cross-origin handling, PyJWT + bcrypt for authentication, and Gunicorn as the production WSGI server.

---

**B7. Why did you choose MongoDB as your database?**

> History records are flexible JSON-like documents containing image names, captions, translated text, language codes, audio URLs, and timestamps — varying in structure. MongoDB's schema-less, document-oriented design handles this naturally. It integrates cleanly with Python via PyMongo and scales horizontally for cloud deployments on MongoDB Atlas.

---

**B8. How many languages does your project support?**

> **20 languages:** English, Chinese, Hindi, Spanish, French, Arabic, Bengali, Portuguese, Russian, Urdu, Indonesian, German, Japanese, Swahili, Marathi, Telugu, Turkish, Tamil, Korean, and Vietnamese. Each has its own NLLB-200 BCP-47 translation code and a dedicated Azure Neural voice for speech synthesis.

---

**B9. What is the user workflow in your application?**

> 1. Register/log in to account.
> 2. Upload an image on the workspace.
> 3. Select caption style (Simple, Detailed, or Story).
> 4. Select target language from the dropdown.
> 5. Click **"Run Inference Pipeline"**.
> 6. Receive generated caption, translated text, and audio playback.
> 7. Browse and replay past generations from the **Recent Generations** sidebar.

---

**B10. What is the significance of voice generation in your project?**

> Voice generation makes the application truly accessible — especially for visually impaired users who cannot read the caption on screen. By synthesising speech in the same language as the translation, the information becomes audio-first and language-native, dramatically improving usability for low-literacy or visually challenged users in non-English speaking regions.

---

## 📗 Intermediate Questions (10)

---

**I1. Explain the complete pipeline/workflow of your application.**

> 1. **Upload:** POST /upload → image saved to `static/uploads/` with UUID filename.
> 2. **Caption:** POST /caption → BLIP generates English caption from image.
> 3. **Translate:** POST /translate → NLLB-200 translates English caption to target language.
> 4. **Voice:** POST /voice → edge-tts maps language to Azure Neural voice → saves MP3 to `static/audio/`.
> 5. **History Save:** POST /history → all outputs (image, caption, translation, language, audio URL) saved to MongoDB.
> 6. **Display:** React renders caption, translated text, and AudioPlayer with playback controls.

---

**I2. What is the architecture of your application?**

> Classic **3-tier architecture:**
> - **Presentation Layer:** React.js + Vite frontend.
> - **Application/Logic Layer:** Python Flask REST API with AI model services (BLIP, NLLB-200, GPT-2, edge-tts).
> - **Data Layer:** MongoDB Atlas cloud database.
>
> Frontend and backend are fully decoupled, communicating via JSON REST APIs over HTTP — allowing independent deployment on Vercel (frontend) and Render (backend).

---

**I3. How does authentication work end-to-end?**

> **Signup:** User provides name, email, password → bcrypt hashes password → MongoDB stores user with `is_verified=False` + OTP → OTP sent via Brevo SMTP email.
>
> **OTP Verify:** User enters 6-digit OTP → backend compares OTP + checks 5-min expiry → sets `is_verified=True`, clears OTP from DB.
>
> **Login:** User sends email + password → `bcrypt.checkpw()` verifies → server generates JWT `{sub: user_id, email, exp: +24h}` → frontend stores in `localStorage` and attaches as `Authorization: Bearer <token>` on all protected requests.

---

**I4. How is the history feature implemented?**

> After the full pipeline completes successfully, the frontend sends `POST /history` containing image_name, caption, translated_caption, language, mode, and audio_url. Flask calls `insert_history()` which writes a BSON document to MongoDB's `history` collection. `GET /history` queries MongoDB sorted by timestamp descending and returns the 20 most recent records.

---

**I5. How does the Recent Generations sidebar work?**

> `HistorySidebar.jsx` is mounted in `Home.jsx` and slides in via Framer Motion spring animation when `isSidebarOpen` state is `true`. It fetches history from MongoDB on open, renders each record as a card with a thumbnail, language/mode badge, and action buttons:
> - **"Load into Workspace"** — restores all past outputs into the main UI state.
> - **"Play Audio"** — plays the Edge-TTS MP3 inline without page reload.
> - **Trash Icon** — triggers animated confirmation modal, then calls `DELETE /history/:id`.

---

**I6. What are the three caption modes and how do they differ?**

> - **Simple:** BLIP alone → short, factual sentence (max 60 tokens). Fastest mode.
> - **Detailed:** BLIP generates base caption → GPT-2 expands it using a descriptive paragraph prompt. Produces a richer, scene-level description.
> - **Story:** BLIP generates base caption → GPT-2 creates a narrative story with a title and "Once upon a time..." structure. Most creative, longest output.

---

**I7. How does image upload work on the backend?**

> The frontend sends the image as `multipart/form-data` via Axios POST to `/upload`. Flask validates the file extension against an allowlist (jpg, jpeg, png, webp, gif), generates a UUID-based unique filename to prevent collisions, and saves it to `static/uploads/`. The endpoint returns the generated filename which the frontend uses as a reference key for all subsequent pipeline API calls.

---

**I8. How did you handle CORS in your application?**

> React (port 5173) and Flask (port 5000) run on different origins, so browsers enforce the Same-Origin Policy blocking cross-origin requests. I used **Flask-CORS** configured with explicit allowed origins (`localhost:5173` for dev, Vercel domain for prod) and `supports_credentials=True` to allow the JWT `Authorization` header to be passed through correctly.

---

**I9. How is the audio file served to the frontend?**

> When edge-tts generates an MP3, Flask saves it to `static/audio/<uuid>.mp3`. Flask serves it via its built-in static file server at `/static/audio/<filename>`. The backend returns this relative URL in the API response. The React `AudioPlayer` component sets this as the `<audio>` element's `src` — the browser streams the MP3 directly from the Flask server.

---

**I10. Why did you use Axios instead of the native Fetch API?**

> Axios provides several advantages over native Fetch:
> - **Automatic JSON** serialization/deserialization
> - **Request interceptors** for attaching JWT headers globally
> - **Upload progress tracking** via `onUploadProgress` (used for the upload progress bar)
> - **Auto-throws on 4xx/5xx** responses (Fetch requires manual status checking)
> - Cleaner, more readable syntax

---

## 📕 Technical Questions (15)

---

**T1. What is BLIP? How does it work?**

> **BLIP (Bootstrapping Language-Image Pre-training)** by Salesforce Research is a Vision-Language Model. It combines:
> - A **Vision Transformer (ViT) encoder** that extracts visual feature vectors from the image.
> - A **Text Transformer decoder** that generates natural language tokens sequentially, conditioned on those visual features.
>
> Pre-trained on massive image-text pairs, BLIP generates captions by predicting the most probable word at each step using a language model head.

---

**T2. What is the difference between BLIP-base and BLIP-large?**

> Both share the same architecture but differ in scale:
> - **BLIP-large** (ViT-L, ~900M parameters) — more accurate and fluent captions but requires significantly more RAM and 10-15s inference time.
> - **BLIP-base** (ViT-B, ~220M parameters) — much lighter and faster (~1-2s) while producing sufficiently accurate captions.
>
> I switched from `large` to `base` to reduce inference latency by ~80% with minimal quality loss.

---

**T3. What is NLLB-200? Why did you choose it over Google Translate?**

> **NLLB-200 (No Language Left Behind)** is an open-source multilingual neural machine translation model by Meta AI trained on 200 languages using a Sequence-to-Sequence Transformer architecture.
>
> Advantages over Google Translate API:
> - **Completely free** — no API keys, no rate limits.
> - **Runs locally** — no third-party data sharing.
> - Covers all 20 target languages including low-resource ones like Swahili and Marathi.
> - Uses precise **BCP-47 language codes** for dialect specification.

---

**T4. What is Greedy Decoding vs. Beam Search? Which do you use and why?**

> - **Beam Search** (`num_beams > 1`) explores multiple token paths simultaneously, comparing probability scores and selecting the globally best sequence — higher quality but 3-4× slower.
> - **Greedy Decoding** (`num_beams=1`) picks the single highest-probability token at each step immediately — much faster but can occasionally miss a better overall sequence.
>
> I use **Greedy Decoding** (`num_beams=1, do_sample=False`) for BLIP inference because the speed gain (80%+ reduction in latency) outweighs the minimal quality loss for this use case.

---

**T5. What is edge-tts and how does it synthesise speech?**

> `edge-tts` is a Python library that interfaces with **Microsoft Azure Cognitive Speech Services** via WebSocket. It sends text and a voice identifier (e.g., `fr-FR-DeniseNeural`) to Microsoft's cloud, which returns a synthesised MP3 audio stream. The async `Communicate.save()` coroutine writes this stream to a local file. I wrap it in `asyncio.run()` to call it from synchronous Flask routes.

---

**T6. What is a Neural voice? How is it different from traditional TTS?**

> Traditional TTS (gTTS, eSpeak) uses **concatenative synthesis** — stitching pre-recorded phoneme fragments, resulting in robotic, unnatural-sounding speech.
>
> **Neural voices** (Azure Neural) are trained using **deep neural network acoustic models** (WaveNet-style or Transformer-based) on large human speech recording datasets. The result is speech nearly indistinguishable from natural human voice — with correct prosody, rhythm, intonation, and emotion.

---

**T7. How do you map 20 languages to correct Azure voices?**

> In `services/voice_service.py`, a Python dictionary `_LANG_MAP` maps each ISO language code to a specific Azure Neural voice name:
> ```python
> _LANG_MAP = {
>     "fr": "fr-FR-DeniseNeural",
>     "ur": "ur-PK-UzmaNeural",
>     "zh": "zh-CN-XiaoxiaoNeural",
>     ...
> }
> ```
> On each request: `voice = _LANG_MAP.get(language, "en-US-AriaNeural")`. The fallback ensures unknown language codes gracefully default to English neural voice instead of crashing.

---

**T8. How does NLLB-200 know which language to translate to?**

> NLLB-200 uses **`forced_bos_token_id`** (Forced Beginning-of-Sentence Token). During generation:
> ```python
> forced_bos_token_id = tokenizer.convert_tokens_to_ids("fra_Latn")
> ```
> This forces the decoder's first token to be the BCP-47 language tag of the target language (e.g., `fra_Latn` for French). Since the model was pre-trained on sequences starting with these tags, it correctly conditions the entire translation on the target language from the first generated token.

---

**T9. What is JWT? How is it structured?**

> **JSON Web Token (JWT)** is an open standard (RFC 7519) for securely transmitting user identity as a signed JSON object.
>
> Structure: `Header.Payload.Signature`
> - **Header:** Algorithm used (HS256)
> - **Payload:** `{ sub: user_id, email, exp: +24h, iat: now }`
> - **Signature:** HMAC-SHA256 of Header + Payload using server secret key
>
> Clients attach JWT as `Authorization: Bearer <token>`. The server re-verifies the signature on every request — **no database lookup needed** (stateless).

---

**T10. How did you fix the hardcoded language restriction bug?**

> `routes/voice_route.py` had: `VALID_LANGUAGES = {"en", "hi", "te"}` — a legacy left over from the old gTTS implementation. Even though `voice_service.py` fully supported all 20 languages via `_LANG_MAP`, the API gateway rejected any other code before reaching the service layer.
>
> **Fix:** `VALID_LANGUAGES = set(_LANG_MAP.keys())` — dynamically derived from the actual voice mapping dictionary. This ensures the API gate and the service engine always stay perfectly in sync automatically.

---

**T11. How do you handle model loading performance in Flask?**

> Both BLIP and NLLB-200 use the **Singleton + Lazy Loading** pattern:
> - `__new__()` returns the same object instance on every call.
> - `_load()` checks `if self._model is not None: return` — skips re-initialisation on every request.
> - On the **first request**, the model downloads and loads into memory (~5-30s).
> - **Every subsequent request** uses the in-memory model — fast, sub-second inference.

---

**T12. What is multipart/form-data? When is it used?**

> `multipart/form-data` is an HTTP encoding type for binary file uploads. Unlike `application/json` (text only), it splits the request body into multiple "parts" separated by a boundary string — each part carries its own `Content-Type`, allowing binary file streams alongside text fields. It is the standard way to upload images/videos over HTTP. Flask reads it via `request.files.get("file")`.

---

**T13. What is `torch.no_grad()` and why is it important?**

> During PyTorch model **inference**, we don't need gradients (no backpropagation/weight updates). `torch.no_grad()` is a context manager that:
> - **Skips building the computation graph** — saves memory.
> - **Skips storing gradient tensors** — can use 2-3× less memory.
> - **Speeds up inference by 15-30%.**
>
> It is a critical best practice for all production inference code.

---

**T14. How did you ensure all 20 languages work end-to-end?**

> - `translation_service.py` has `language_map` mapping all 20 ISO codes → NLLB BCP-47 codes.
> - `voice_service.py` has `_LANG_MAP` mapping all 20 ISO codes → Azure Neural voice names.
> - Both are derived from the same language source of truth — adding a new language requires one entry in each dictionary.
> - The API validation gate is dynamically derived: `VALID_LANGUAGES = set(_LANG_MAP.keys())`.

---

**T15. What is `asyncio.run()` and why did the voice service need it?**

> `edge-tts` is an async Python library — its `Communicate.save()` method is a native `async` coroutine requiring an event loop. Flask routes are synchronous by default.
>
> `asyncio.run()` creates a temporary event loop, runs the given async coroutine to completion, then destroys the loop. This is the standard Python pattern for calling async code from a synchronous context — used in each voice generation call to ensure thread safety across concurrent Flask requests.

---

## 📙 Advanced Questions (10)

---

**A1. Can your application scale to 1000 concurrent users? What changes are needed?**

> Not in current form — BLIP and NLLB-200 run synchronously on a single server process. To scale:
> 1. **GPU instances** (AWS EC2 G4, GCP A2) — reduce inference to milliseconds.
> 2. **Celery + Redis** — async task queue for AI inference, API returns task ID immediately.
> 3. **Multiple Gunicorn workers / Kubernetes pods** — horizontal scaling.
> 4. **TorchServe / Triton Inference Server** — dedicated model serving microservice.
> 5. **CDN** (Cloudflare) — cache static audio/image assets globally.

---

**A2. What are the security vulnerabilities in your implementation and how would you fix them?**

> | Vulnerability | Current State | Production Fix |
> |---|---|---|
> | JWT Storage | localStorage (XSS vulnerable) | HttpOnly cookies |
> | File Upload | Extension check only | Validate file magic bytes |
> | Rate Limiting | None | Flask-Limiter per IP |
> | CORS | Fixed to known origins | Keep strict — never `*` |
> | MongoDB Client | New client per request | Single long-lived client with connection pool |
> | Secret Keys | .env file | Cloud secrets manager (AWS Secrets, Vault) |

---

**A3. How would you handle model versioning and updates without downtime?**

> **Blue-Green Deployment:**
> - Two identical server environments run simultaneously — "Blue" serves live traffic while "Green" has the updated model.
> - After validating Green's outputs, a load balancer instantly redirects all traffic from Blue to Green.
> - For model storage, use **DVC (Data Version Control)** to track model weights and **Docker containers** to package specific versions reproducibly.
> - Rollback = switch load balancer back to Blue.

---

**A4. Your application generates audio files indefinitely. How would you manage storage growth?**

> 1. **MongoDB TTL Index** — auto-deletes history records older than X days.
> 2. **Cron Cleanup Job** — deletes orphan audio files from `static/audio/` not matching any active MongoDB record.
> 3. **AWS S3 + Lifecycle Policy** — move audio and images to S3, auto-delete after 7-30 days.
> 4. **File Deduplication** — hash the text+language combination; return existing audio URL if identical request was made before.

---

**A5. What would you do differently if rebuilding this project?**

> 1. **FastAPI** instead of Flask — native async, auto-generated OpenAPI docs, better type safety.
> 2. **React Query / TanStack Query** — automatic caching, refetching, and loading state management.
> 3. **HttpOnly cookies** for JWT storage — prevents XSS token theft.
> 4. **Separate model microservice** — TorchServe or Triton decouples AI processing from the API server.
> 5. **WebSocket `/progress` endpoint** — real-time step-by-step pipeline status updates instead of a loading spinner.

---

**A6. How would you add real-time caption generation progress?**

> **Server-Sent Events (SSE)** — Flask's `Response` with a generator function streaming JSON progress events. The frontend connects via the `EventSource` browser API and updates the UI step-by-step:
> *"Uploading... → Captioning... → Translating... → Synthesising..."*
>
> More efficient than WebSockets for one-directional server-to-client streaming and requires minimal changes to the Flask architecture.

---

**A7. How would you implement role-based access control (RBAC)?**

> - Add a `role` field to MongoDB user documents (`"user"` | `"admin"`).
> - Include the role in the JWT payload claim.
> - Create a custom `@require_role("admin")` Flask decorator that decodes the token and checks the role before allowing access.
> - Admins access: `GET /admin/users`, `DELETE /admin/history/all`, system analytics dashboard.
> - Regular users only see their own history filtered by `user_id`.

---

**A8. What happens if MongoDB is unavailable? How does your system behave?**

> Currently, if MongoDB is unavailable, history save/retrieve operations throw `pymongo.errors.ConnectionFailure`. The history save is wrapped in `try/except` in `Home.jsx` with a `console.warn`, so the **generation pipeline does not crash** — users still get their caption and audio. The record simply won't be saved.
>
> Improvement: **Redis retry queue** for failed writes + **circuit breaker pattern** that disables history UI and shows a user-friendly banner when MongoDB is down.

---

**A9. How would you implement caching to avoid re-running BLIP on the same image?**

> 1. Compute a **SHA-256 hash** of the uploaded image binary before saving.
> 2. Before BLIP inference, check a **Redis cache** for an existing caption matching that hash.
> 3. If found, return the cached caption in milliseconds — no GPU/CPU computation.
> 4. Similarly cache `(caption, target_language) → translated_text` pairs in Redis.
>
> This is **memoization at the inference layer** — very effective since the same product/landscape images often get uploaded multiple times.

---

**A10. How would you build an A/B testing system for BLIP-base vs. BLIP-large?**

> - Add `?model=base|large` query parameter to the `/caption` endpoint.
> - `CaptionService` maintains both model instances and routes based on the parameter.
> - Log the model variant used alongside each generation in MongoDB.
> - Build an analytics dashboard comparing: average user satisfaction (thumbs up/down feedback), average latency, and caption quality metrics per variant.
> - After statistically sufficient samples (using a two-proportion z-test), permanently deploy the winning variant.

---

## 📒 Tricky Questions (5)

---

**TR1. If NLLB translates from English to French, but the image caption is not grammatically perfect English — does translation quality suffer?**

> **Yes, this is a real limitation.** NLLB-200 performs best when the source text is clean, well-formed English. BLIP sometimes generates awkward captions (e.g., *"woman sitting bench park"*). These imperfect inputs can produce lower-quality or overly literal translations.
>
> **Mitigation:** Add a **Grammar Error Correction (GEC)** step between BLIP output and NLLB input — using a small model fine-tuned for GEC — to normalise the caption before translation.

---

**TR2. Why is your system not truly "real-time" even though it feels instant to the user?**

> The system performs **four sequential blocking operations**: upload (I/O), BLIP inference (CPU/GPU compute), NLLB inference (CPU/GPU compute), and edge-tts synthesis (network I/O to Microsoft). Each takes 1-15 seconds. The *illusion of responsiveness* comes from UX design — step-by-step progress indicators, Framer Motion animations, and smooth transitions.
>
> True real-time would require **streaming model outputs token-by-token** (like ChatGPT's typewriter effect), which needs streaming API integration.

---

**TR3. Your `_get_collection()` creates a new MongoClient on every call. Is this a problem?**

> **Yes — this is a connection leak anti-pattern.** Creating a new `MongoClient` per request is expensive and violates MongoDB's recommended usage. PyMongo's client internally manages a thread-safe connection pool.
>
> **Fix:** Instantiate a single `MongoClient` at **module load time** (outside any function) and reuse it across all calls:
> ```python
> # Module-level singleton — correct pattern
> _client = MongoClient(config.MONGO_URI)
> def _get_collection():
>     return _client[config.MONGO_DB_NAME]["history"]
> ```

---

**TR4. If a user selects "Story" mode, GPT-2 generates creative content. Can it generate harmful or inappropriate stories?**

> **Yes — this is a real AI safety concern.** GPT-2 is an unconstrained generative model. Mitigations:
> 1. **Output filtering** — run output through a lightweight toxicity classifier (e.g., `facebook/roberta-hate-speech-dynabench-r4-target`) before returning to the user.
> 2. **Prompt engineering guardrails** — explicitly constrain the GPT-2 prompt (e.g., *"Write a child-safe, positive story about..."*).
> 3. **User reporting mechanism** — flagged outputs reviewed manually by moderators.

---

**TR5. Why is `use_fast=True` important when loading the NLLB tokenizer, and what happens if you omit it?**

> HuggingFace tokenizers come in two versions: the **Rust-based fast version** (`use_fast=True`, default) — up to 100× faster than the pure Python slow version. For NLLB-200, which processes multilingual text with complex scripts (Arabic, Chinese, Devanagari), fast tokenization reduces preprocessing from seconds to milliseconds.
>
> If you omit it and the Rust library isn't properly installed, HuggingFace **silently falls back** to the slow Python tokenizer — causing a subtle performance regression with no visible error, making it very hard to detect and debug.

---

## 🌟 BONUS — 5 One-Line Power Answers

> *Use these confidently in your viva to leave a lasting impression.*

---

**1.** *"SceneSense AI transforms any image into accessible, multilingual, audio-augmented information — making visual content language-agnostic."*

**2.** *"By replacing gTTS with Microsoft Azure Neural voices via edge-tts, we elevated voice quality from robotic phoneme-stitching to near-human neural speech synthesis across 20 languages."*

**3.** *"Switching from BLIP-large to BLIP-base with greedy decoding reduced caption latency by over 80% with negligible accuracy loss — a classic engineering trade-off of performance vs. precision."*

**4.** *"The Singleton lazy-loading pattern ensures our 1.5GB AI models are loaded exactly once and kept in memory — making every request after the first execute in under 2 seconds."*

**5.** *"Our history feature implements optimistic UI deletion — the card disappears instantly on the frontend while the database DELETE runs asynchronously, making the interface feel incredibly snappy even on slow connections."*

---

## 📊 Quick Reference Cheat Sheet

| Component | Technology | Why |
|---|---|---|
| Frontend | React.js + Vite | Fast SPA with hot reload |
| Animations | Framer Motion | Premium micro-interactions |
| HTTP Client | Axios | Interceptors + upload progress |
| Backend | Python Flask | Lightweight, flexible micro-framework |
| AI: Captioning | Salesforce BLIP-base | Fast Vision-Language model |
| AI: Translation | Meta NLLB-200 (600M) | Free, local, 200 languages |
| AI: Story/Detail | GPT-2 | Text expansion for richer captions |
| AI: Voice | Microsoft edge-tts | Free Azure Neural voices, 20 languages |
| Database | MongoDB Atlas | Schema-less, cloud-hosted |
| Auth | JWT + bcrypt + OTP | Stateless, secure, verified |
| Production Server | Gunicorn | WSGI for Flask in production |
| Deployment | Render + Vercel | Backend + Frontend cloud hosting |

---

*Best of luck with your viva! Speak with confidence — you built something genuinely impressive.* 🎓

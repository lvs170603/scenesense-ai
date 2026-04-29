# SceneSense AI: Multilingual Image Captioning with Voice Assistance

**A Full-Stack AI-Powered Accessibility Platform**

---

*IEEE Conference Paper Format — Final Year B.Tech Project*

---

## Abstract

Automatic image captioning has emerged as a fundamental challenge at the intersection of computer vision and natural language processing. Existing systems predominantly generate descriptions in English, creating a significant accessibility barrier for the billions of non-English-speaking users worldwide. This paper presents **SceneSense AI**, a full-stack AI web application that integrates state-of-the-art deep learning models to generate contextual image captions, translate them into twenty global languages, and render the output as synthesized speech. The system employs the **Salesforce BLIP-Large** (Bootstrapping Language-Image Pre-training) model for vision-language caption generation, **Facebook's NLLB-200** (No Language Left Behind, 600M distilled) model for neural machine translation, and **Google Text-to-Speech (gTTS)** for audio synthesis. The backend is implemented using **Python Flask** following an application factory pattern with modular Blueprint architecture, while the frontend is developed with **React** and **Vite**. User data and caption history are persisted in **MongoDB Atlas**. Authentication is secured through **bcrypt** password hashing, **JWT** stateless token authorization, and **OTP-based** email verification. Experimental results demonstrate high-quality English caption generation with structurally coherent multilingual translations and low-latency audio output. SceneSense AI addresses the critical need for inclusive, accessible AI-powered image description tools, with practical applications in assistive technology, e-commerce, content management, and education.

**Index Terms** — Image Captioning, BLIP, NLLB-200, Neural Machine Translation, Text-to-Speech, Accessibility, Multilingual AI, Flask, React, MongoDB, Transformer Models.

---

## I. Introduction

The exponential growth of digital visual content—estimated at over 3.2 billion images shared daily across global platforms—has created an urgent need for automated, scalable, and linguistically inclusive image description systems [1]. Image captioning, the task of generating a natural language description for a given visual input, sits at the confluence of two complex domains: computer vision and natural language processing (NLP). Early captioning systems relied on template-based approaches and hand-engineered feature extraction pipelines, which produced rigid, context-insensitive descriptions. The advent of deep learning, and specifically the Transformer architecture [2], has dramatically elevated the quality and fluency of machine-generated captions.

Despite considerable progress, two critical limitations persist in deployed captioning systems:

**1) Monolingual output:** The vast majority of image captioning systems produce descriptions exclusively in English. With approximately 6,500 languages spoken worldwide and fewer than 20% of the global population being proficient English speakers, this presents a substantial accessibility and inclusivity gap [3].

**2) Absence of multimodal output:** Visual descriptions are of limited utility for individuals with visual impairments if they remain in text form. Converting captions to synthesized speech is an essential accessibility feature that most captioning tools do not provide natively.

This paper addresses both limitations through the design and implementation of **SceneSense AI**, a production-grade web application that provides:

- **Automated English captioning** with three stylistic modes (Simple, Detailed, and Story)
- **Multilingual translation** into 20 languages using the NLLB-200 neural translation model
- **Text-to-speech synthesis** in English, Hindi, and Telugu via gTTS
- **Persistent caption history** stored in MongoDB Atlas
- **Secure multi-factor authentication** via bcrypt, JWT, and OTP email verification
- **Responsive, theme-aware frontend** with dark/light mode and glassmorphism UI design

The remainder of this paper is organized as follows: Section II reviews related literature. Section III describes the system methodology and architecture. Section IV details the implementation. Section V presents results and discussion. Section VI discusses advantages and limitations. Sections VII and VIII outline future scope and conclusions, followed by references.

---

## II. Literature Review

### A. Traditional Image Captioning Methods

Early approaches to automatic image captioning relied on two principal paradigms: retrieval-based methods and template-based generation. Retrieval-based systems matched an input image to the most visually similar image in a labeled database and returned the associated description [4]. While computationally efficient, these methods suffered from limited generalizability and inflexible vocabulary.

Template-based systems extracted visual features using object detectors and filled predefined sentence templates (e.g., "A [noun] is [verb]-ing in a [location]") [5]. Although interpretable, they produced stilted, unnatural sentences and struggled with complex multi-object scenes.

### B. Neural Network Approaches

The introduction of encoder-decoder architectures revolutionized image captioning. Vinyals et al. [6] proposed the "Show and Tell" model, which used a Convolutional Neural Network (CNN) as a visual encoder and a Long Short-Term Memory (LSTM) network as a language decoder. Xu et al. [7] extended this with attention mechanisms in "Show, Attend and Tell," allowing the decoder to focus on relevant image regions when generating each word. These models significantly improved caption quality but required large labeled datasets and struggled with fine-grained semantic understanding.

### C. Vision-Language Transformer Models

The adoption of the Transformer architecture [2] enabled the development of large-scale pre-trained vision-language models. OSCAR [8] uses object tags as pivot points to align image-text pairs. VinVL [9] improved visual feature extraction using a stronger object detector. However, these models required separately trained vision encoders and were computationally expensive to fine-tune.

**BLIP (Bootstrapping Language-Image Pre-training)** [10], proposed by Li et al. at Salesforce Research, introduced a unified encoder-decoder architecture that jointly learns visual encoding, image-text matching, and language modeling. BLIP-Large, the variant used in this project, was pre-trained on 129M image-text pairs with noise filtering via a Captioner-Filter bootstrapping mechanism, achieving state-of-the-art performance on the COCO captions benchmark (CIDEr: 133.3) at the time of publication.

### D. Neural Machine Translation

Statistical Machine Translation (SMT), as implemented in Moses [11], was the dominant paradigm before 2014. It modeled translation as a probabilistic optimization problem using phrase tables and language models. SMT systems required per-language-pair corpora and produced grammatically inconsistent outputs for morphologically rich languages.

**Sequence-to-sequence neural models** [12], based on RNNs with attention, improved fluency but still required large bilingual datasets for each language pair. The Helsinki-NLP MarianMT family [13] provides efficient seq2seq models for many language pairs but suffers from translation inconsistencies in Indian regional languages such as Telugu and Hindi, including word repetition and hallucination artifacts.

**NLLB-200** (No Language Left Behind) [14], released by Meta AI Research in 2022, addresses these limitations through a Many-to-Many multilingual translation model trained on 200 languages using a mixture of supervised and self-supervised objectives. The 600M distilled variant used in SceneSense AI achieves competitive translation quality with a fraction of the 54B-parameter dense model's computational cost. NLLB-200 demonstrated BLEU score improvements of up to 44% on low-resource African and South Asian languages compared to prior state-of-the-art systems.

### E. Text-to-Speech Systems

Text-to-Speech (TTS) synthesis has evolved from formant synthesis and concatenative approaches to end-to-end neural models. Systems such as WaveNet [15] and Tacotron 2 [16] produce near-human-quality speech but require significant computational resources. For web deployment, **Google Text-to-Speech (gTTS)** provides a lightweight, language-aware TTS API with support for dozens of languages, making it suitable for accessible web applications.

### F. Existing System Limitations

Current image captioning platforms such as Microsoft Azure Computer Vision, Google Cloud Vision AI, and AWS Rekognition are (i) closed-source, (ii) require paid API subscriptions, (iii) do not natively support regional Indian languages, and (iv) do not provide integrated TTS output. Open-source alternatives such as CLIP-Cap and OFA are primarily research prototypes without production-grade authentication, history management, or voice synthesis. SceneSense AI uniquely integrates all these capabilities into a single deployable web application.

---

## III. Methodology

### A. System Overview

SceneSense AI is designed as a **three-tier web application**:

1. **Presentation Tier:** React + Vite SPA (Single Page Application)
2. **Application Tier:** Python Flask REST API backend with Blueprint architecture
3. **Data Tier:** MongoDB Atlas cloud database

The system follows a **microservice-inspired modular pattern** — each functional domain (auth, upload, captioning, translation, voice, history) is encapsulated in its own Flask Blueprint and service class, enabling independent development, testing, and future replacement of individual components.

### B. Complete System Workflow

```
┌─────────────┐     POST /upload      ┌──────────────────────┐
│   Browser   │ ──────────────────▶  │   Flask Backend       │
│  (React UI) │                       │                       │
│             │ ◀────────────────────  │  1. Validate file     │
│             │   { filename }         │  2. UUID rename       │
│             │                       │  3. Save to disk      │
│             │                       └──────────────────────┘
│             │
│             │     POST /caption     ┌──────────────────────┐
│             │ ──────────────────▶  │  CaptionService       │
│             │                       │  (BLIP-Large)         │
│             │ ◀────────────────────  │                       │
│             │   { caption }          │  1. Lazy-load model   │
│             │                       │  2. PIL image open    │
│             │                       │  3. BLIP inference    │
│             │                       │  4. GPT-2 (optional)  │
│             │                       └──────────────────────┘
│             │
│             │     POST /translate   ┌──────────────────────┐
│             │ ──────────────────▶  │  TranslationService   │
│             │                       │  (NLLB-200)           │
│             │ ◀────────────────────  │                       │
│             │   { translated_text }  │  1. Lazy-load model   │
│             │                       │  2. Tokenize input    │
│             │                       │  3. Generate tokens   │
│             │                       │  4. Insert to MongoDB │
│             │                       └──────────────────────┘
│             │
│             │     POST /voice       ┌──────────────────────┐
│             │ ──────────────────▶  │  VoiceService (gTTS)  │
│             │ ◀────────────────────  │                       │
│             │   { audio_url }        │  1. gTTS synthesis    │
└─────────────┘                       │  2. Save MP3 to disk  │
                                       └──────────────────────┘
```

### C. Caption Generation Methodology

Caption generation employs the BLIP-Large model in a **conditional image captioning** configuration. The model accepts a raw image and an optional conditioning text prompt. Three modes are supported:

| Mode | Technique | Max Tokens | Use Case |
|---|---|---|---|
| Simple | BLIP unconditional generation | 60 | Quick, one-sentence caption |
| Detailed | BLIP + GPT-2 expansion | 50 (GPT-2) | Descriptive paragraph |
| Story | BLIP + GPT-2 narrative prompt | 80 (GPT-2) | Creative storytelling |

For **Simple mode**, the BLIP model directly decodes from visual embeddings with beam search:

```
Input: Image I
Output: Caption C = BLIP_decode(visual_embed(I), max_tokens=60)
```

For **Detailed and Story modes**, BLIP generates a base caption, which is then fed as a conditioning prefix to GPT-2 (124M parameters) using temperature sampling (T=0.8) and nucleus sampling (top-p=0.9) for diverse, natural-sounding output.

### D. Translation Methodology

The translation pipeline uses NLLB-200 (distilled 600M) in a **forced target BOS token** configuration. The source language is English (`eng_Latn`); target language codes follow the BCP-47 standard as defined by NLLB's language taxonomy:

```
Input:  English text T, target language code L
Process: tokens = tokenizer(T)
         output = model.generate(
             **tokens,
             forced_bos_token_id = tokenizer.convert_tokens_to_ids(nllb_code[L]),
             max_length = 200
         )
Output: translated_text = tokenizer.batch_decode(output, skip_special_tokens=True)
```

All 20 supported languages and their NLLB BCP-47 codes are enumerated in Table I.

**Table I: Supported Translation Languages**

| Code | Language | NLLB BCP-47 |
|---|---|---|
| `hi` | Hindi | `hin_Deva` |
| `te` | Telugu | `tel_Telu` |
| `ta` | Tamil | `tam_Taml` |
| `mr` | Marathi | `mar_Deva` |
| `bn` | Bengali | `ben_Beng` |
| `ur` | Urdu | `urd_Arab` |
| `zh` | Chinese (Simplified) | `zho_Hans` |
| `es` | Spanish | `spa_Latn` |
| `fr` | French | `fra_Latn` |
| `ar` | Arabic | `arb_Arab` |
| `pt` | Portuguese | `por_Latn` |
| `ru` | Russian | `rus_Cyrl` |
| `id` | Indonesian | `ind_Latn` |
| `de` | German | `deu_Latn` |
| `ja` | Japanese | `jpn_Jpan` |
| `sw` | Swahili | `swh_Latn` |
| `tr` | Turkish | `tur_Latn` |
| `ko` | Korean | `kor_Hang` |
| `vi` | Vietnamese | `vie_Latn` |
| `en` | English (passthrough) | `eng_Latn` |

### E. Voice Synthesis Methodology

Text-to-Speech output is generated using Google Text-to-Speech (gTTS). The service accepts the translated text and a language code, produces an MP3 audio file, and persists it in the `static/audio/` directory with a UUID-based filename to prevent collisions:

```
Input:  text T, language L
Process: tts = gTTS(text=T, lang=gTTS_lang_map[L], slow=False)
         filename = "audio_" + uuid4().hex + ".mp3"
         tts.save(AUDIO_FOLDER / filename)
Output: { audio_url: "/static/audio/<filename>", filename }
```

### F. Authentication & Freemium Access Methodology

The system implements a tiered access model natively integrated with three security layers:

**Freemium Access Layer:**
Unauthenticated users are greeted with a frictionless onboarding experience. Temporary guest sessions are tracked persistently via browser `localStorage`. Guests are provisioned 2 free AI pipeline generations, after which the application conditionally renders a security boundary modal forcing authentication.

**Layer 1 — Password Security:**
Passwords are hashed using bcrypt with a randomly generated salt:
```
hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))
```
The raw password is never stored or logged. Verification uses `bcrypt.checkpw()`.

**Layer 2 — Email Verification:**
Upon registration, a 6-digit OTP is generated using `random.randint(0, 999999)` (zero-padded), persisted to MongoDB with a 5-minute UTC expiry timestamp, and delivered via Brevo SMTP using Python's `smtplib` with STARTTLS encryption.

**Layer 3 — Stateless JWT Authorization:**
Upon successful login, a JWT token is signed using the HS256 algorithm:
```
payload = { "sub": user_id, "email": email,
            "exp": now + timedelta(hours=24), "iat": now }
token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
```
The token is stored in browser `localStorage` and transmitted in request headers.

---

## IV. System Architecture

### A. Frontend Architecture

The frontend is a **Single Page Application (SPA)** built with React 18 and Vite. Component architecture is organized into two distinct layers:

**1. Landing Layer** (`src/components/landing/`):
Marketing-oriented components including animated hero section, features display, interactive demo preview, infinite-scroll screenshot carousel, how-it-works section, and call-to-action segments. Animations are implemented with Framer Motion.

**2. Application Layer** (`src/components/`):
Functional components for the core AI workflow: `ImageUploader` (drag-and-drop file selection with Axios upload progress), `CaptionDisplay` (result rendering with copy functionality), `LanguageSelector` (20-language dropdown), `StyleModeSelector` (Simple/Detailed/Story), `AudioPlayer` (custom HTML5 audio with controls), and `HistoryPanel` (paginated MongoDB-backed history).

**Routing** is handled by React Router DOM v6:

```
/ → Landing.jsx (public marketing page)
/signup → Signup.jsx
/verify-otp → VerifyOtp.jsx
/login → Login.jsx
/app → Home.jsx (protected AI workspace)
* → Redirect to /
```

**State Management:** The `ThemeContext` (React Context API) provides global dark/light mode state. Component-local state is managed with React `useState` and `useEffect` hooks. No external state management library (Redux/Zustand) is required given the application scale.

**API Communication:** Two service modules abstract all backend calls:

- `services/api.js` (Axios instance, 120s timeout, global error interceptor): handles upload, caption, translate, voice, history
- `services/authApi.js` (native Fetch): handles signup, OTP verification, resend, login

### B. Backend Architecture

The Flask backend follows the **Application Factory Pattern** — `create_app()` in `app.py` instantiates the Flask application, applies CORS middleware, sets configuration, and registers all Blueprints. This pattern enables easy testing and environment-specific instantiation.

**Blueprint Module Map:**

| Blueprint | Prefix | Endpoints |
|---|---|---|
| `auth_bp` | `/auth` | signup, login, verify-otp, resend-otp |
| `upload_bp` | (root) | POST /upload |
| `caption_bp` | (root) | POST /caption |
| `translate_bp` | (root) | POST /translate |
| `voice_bp` | (root) | POST /voice |
| `history_bp` | (root) | GET /history |

**Service Layer:** AI models are encapsulated in service classes following the **Singleton design pattern** to prevent repeated model loading:

```python
class CaptionService:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    def _load(self):
        if self._processor is not None: return
        # Load BLIP-Large (runs only on first request)
```

**Model Layer:** 
Thin PyMongo wrappers provide CRUD operations without an ODM overhead (no MongoEngine/Beanie), keeping the stack minimal and performant. To prevent connection leakage and timeout storms under concurrent load, the `MongoClient` instance is governed by a global Singleton connection pool pattern instantiated exclusively at module load time.

### C. Database Architecture

MongoDB Atlas is used as a cloud-hosted NoSQL database. Two collections are defined:

**Collection: `users`**

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Auto-generated primary key |
| `full_name` | String | User's full name |
| `email` | String | Unique, lowercase, indexed |
| `password_hash` | String | bcrypt hash (12 rounds) |
| `is_verified` | Boolean | Email verification status |
| `otp` | String / null | 6-digit OTP (null after verify) |
| `otp_expires_at` | DateTime | UTC expiry timestamp |
| `created_at` | DateTime | Account creation UTC timestamp |

**Collection: `history`**

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Auto-generated primary key |
| `image_name` | String | UUID filename of uploaded image |
| `caption` | String | English caption from BLIP |
| `translated_caption` | String | Output of NLLB-200 |
| `language` | String | Target language code |
| `mode` | String | simple / detailed / story |
| `timestamp` | DateTime | UTC timestamp, sorted descending |

History records are retrieved with:
```python
collection.find({}).sort("timestamp", DESCENDING).skip(skip).limit(limit)
```
The `limit` parameter is clamped to the range [1, 100] to prevent over-fetching.

---

## V. Results and Discussion

### A. Caption Generation Quality

The BLIP-Large model demonstrates strong performance on real-world images. Qualitative evaluation confirms that:

- **Simple mode** produces concise, grammatically correct single-sentence captions describing the primary subject and scene context (e.g., "a dog sitting on a grassy field with trees in the background").
- **Detailed mode** (BLIP + GPT-2) produces paragraph-length descriptions elaborating on scene elements, spatial relationships, and visual attributes.
- **Story mode** generates creative, narrative-style text suitable for content creation and engagement-oriented use cases.

The BLIP-Large model achieves a **CIDEr score of 133.3** and **SPICE of 23.3** on the COCO captions test set (reported in the original BLIP paper [10]), reflecting its strong semantic alignment between visual features and generated descriptions.

### B. Translation Quality

Translation quality was assessed qualitatively across Hindi, Telugu, French, Spanish, and Arabic. NLLB-200 consistently produced grammatically well-formed output for European and South Asian languages. Compared to the previously used Helsinki-NLP MarianMT models:

| Criterion | MarianMT | NLLB-200 |
|---|---|---|
| Language coverage | Per-pair models (~50 languages) | 200 languages (single model) |
| Telugu translation | Word repetition / hallucination | Coherent, structurally correct |
| Hindi translation | Acceptable but inconsistent | High quality |
| Inference memory | ~500 MB per model | ~2.4 GB (single shared model) |
| Deployment complexity | Multiple model files | Single unified model |

The NLLB-200 paper reports an **average BLEU improvement of 44%** over the prior state-of-the-art on 55 low-resource African and South Asian languages, corroborating the observed improvements in Indian regional language quality.

### C. Voice Output Performance

gTTS synthesis produces MP3 audio files in under 3 seconds for typical caption lengths (10–30 words) on standard internet connectivity. Audio quality is clear and natural for English and Hindi. Telugu speech synthesis is supported by gTTS's language model but may exhibit minor prosodic inconsistencies in longer sentences. Audio files are UUID-named, preventing conflicts across concurrent users.

### D. System Performance

| Operation | Approximate Time | Conditions |
|---|---|---|
| Image upload (1–5 MB) | < 2 seconds | Local network |
| BLIP first load | ~25–40 seconds | CPU, first request |
| BLIP inference (Simple) | 2–5 seconds | CPU |
| NLLB-200 first load | ~15–25 seconds | CPU, first request |
| NLLB-200 translation | 3–8 seconds | CPU |
| gTTS MP3 generation | 1–3 seconds | Internet required |
| MongoDB read/write | < 200 ms | MongoDB Atlas free tier |

> **Note:** All AI inference times reduce by 5–10× with CUDA GPU acceleration. Model loading occurs only once per server session (Singleton pattern).

### E. Authentication Security

The authentication pipeline meets industry security standards:
- bcrypt with 12 rounds provides computational resistance against brute-force attacks (estimated ~0.3 seconds per hash on modern hardware, rendering mass attacks infeasible)
- JWT tokens use HS256 signing with a configurable secret, 24-hour expiry, and include `iat` (issued-at) claim for token freshness validation
- OTP codes expire in 5 minutes and are cleared from the database immediately after successful verification, preventing replay attacks

### F. User Experience

The frontend provides a polished user experience with:
- Animated drag-and-drop image upload with real-time progress percentage
- Instant caption display with copy-to-clipboard functionality
- Seamless language switching with automatic re-translation
- Integrated audio playback without page reload
- Paginated history panel showing past captions with thumbnails
- Dark/light theme toggle persisted across sessions

---

## VI. Advantages and Limitations

### A. Advantages

**1. Comprehensive Multilingual Support:**
Support for 20 languages in a single unified model (NLLB-200) eliminates the need for per-language-pair model management. This is particularly significant for South Asian and East Asian languages underserved by existing captioning tools.

**2. Accessibility through Voice:**
By converting captions to spoken audio via gTTS, SceneSense AI extends image understanding to visually impaired users and low-literacy populations, aligning with WCAG 2.1 accessibility guidelines.

**3. Three-Mode Caption Flexibility:**
The Simple/Detailed/Story modes address diverse use cases — from quick alt-text generation to creative content writing — within a single application.

**4. Resource-Efficient Model Serving:**
The Singleton lazy-loading pattern ensures models are loaded into memory only once and shared across all requests, making the system viable on commodity servers with limited RAM without requiring model serving infrastructure like TorchServe.

**5. Open-Source and Self-Hostable:**
Unlike Microsoft Azure Vision or Google Vision AI, SceneSense AI is fully open-source and self-hostable. It has no per-request API cost, making it economically viable for educational institutions and NGOs.

**6. Secure Multi-Factor Authentication:**
The bcrypt + JWT + OTP pipeline provides enterprise-level authentication security without relying on third-party OAuth providers.

### B. Limitations

**1. Model Size and Memory Requirements:**
BLIP-Large requires approximately 900 MB of RAM; NLLB-200 (600M distilled) requires approximately 2.4 GB. Running both concurrently on a free-tier server (512 MB RAM) is infeasible without model quantization or offloading.

**2. First-Request Latency:**
Cold-start latency (25–60 seconds for combined model loading) creates a poor initial user experience when the server has restarted. Warm-start requests are significantly faster (~2–8 seconds).

**3. Internet Dependency for gTTS:**
Google Text-to-Speech requires an active internet connection from the server. A network outage will cause voice generation to fail. An offline TTS alternative (e.g., Coqui TTS, pyttsx3) would improve resilience.

**4. Global Caption History:**
The history collection is not segmented by user. Any logged-in user can view captions generated by other users, which is a privacy concern in multi-user deployments.

**5. No Route-Level Authorization:**
The `/upload`, `/caption`, `/translate`, `/voice`, and `/history` endpoints currently do not require a valid JWT token. Any unauthenticated client can access these endpoints, which is a security gap in production deployments.

**6. CPU-Only Inference:**
The `requirements.txt` specifies `torch==2.6.0+cpu`. Deployments without GPU cannot exploit CUDA acceleration, resulting in high inference latency under concurrent load.

---

## VII. Future Scope

**1. Real-Time Video Captioning:**
Extending the pipeline to process video streams frame-by-frame, using OpenCV for frame extraction and BLIP for per-frame captioning with temporal context aggregation, would enable live accessibility for video content.

**2. Mobile Application:**
Developing a React Native or Flutter cross-platform mobile app would extend SceneSense AI to smartphone cameras, enabling real-world object identification and scene description for visually impaired users on the go.

**3. Per-User Data Isolation:**
Linking history records to authenticated users (via `user_id` field in the history collection) and enforcing JWT-protected routes on all AI endpoints would enable personalized history and multi-tenant security.

**4. Model Quantization and Optimization:**
Applying 8-bit or 4-bit quantization (via HuggingFace `bitsandbytes`) to BLIP and NLLB-200 would reduce memory consumption by 50–75%, enabling deployment on smaller servers or edge devices.

**5. Cloud Object Storage:**
Migrating file storage from local disk (`static/uploads/`, `static/audio/`) to Amazon S3 or Google Cloud Storage would enable horizontal scaling and persistent storage across deployments.

**6. Asynchronous Task Queue:**
Integrating Celery with a Redis broker would enable asynchronous AI inference — the server immediately returns a job ID, processes the heavy model task in the background, and notifies the frontend via WebSocket when results are ready.

**7. Upgraded TTS Engine:**
Replacing gTTS with a locally-hosted neural TTS model (Coqui TTS, Microsoft SpeechT5) would eliminate internet dependency, improve voice naturalness, and support more languages for synthesis.

**8. Fine-Tuning for Domain Specificity:**
Fine-tuning BLIP on domain-specific datasets (medical imaging, satellite imagery, product photography) would improve captioning accuracy for specialized professional applications.

**9. Accessibility Compliance:**
Adding full WCAG 2.1 AA compliance, ARIA labels, keyboard navigation, and screen reader optimization would make SceneSense AI a certified accessible web application.

---

## VIII. Conclusion

This paper has presented **SceneSense AI**, a full-stack AI-powered web application that integrates image captioning, multilingual translation, and voice synthesis into a unified, accessible platform. The system leverages **Salesforce BLIP-Large** for high-quality English caption generation across three contextual modes, **Facebook NLLB-200** for translation into twenty global languages through a single unified model, and **Google gTTS** for text-to-speech audio output. The production backend, implemented in **Python Flask** with a Blueprint modular architecture, enforces request validation, efficient Singleton-based AI model management, and robust security through bcrypt password hashing, JWT token authentication, and OTP-based email verification. User caption history is persistently stored and paginated via **MongoDB Atlas**.

The system demonstrates the feasibility of integrating multiple large pre-trained transformer models within a lightweight web application framework while maintaining acceptable latency for end-user interaction. SceneSense AI addresses a meaningful gap in the current landscape of captioning tools by supporting regional Indian languages (Telugu, Hindi, Tamil, Marathi) alongside 16 other global languages, at zero per-request cost.

From an educational perspective, SceneSense AI provides a comprehensive case study in the integration of deep learning model serving, RESTful API design, NoSQL database management, modern frontend development, and application security — demonstrating that high-impact AI-driven accessibility tools can be built and deployed by small development teams using open-source technologies.

---

## References

[1] Internet Live Stats, "Number of photos taken per day," 2024. [Online]. Available: https://www.internetlivestats.com

[2] A. Vaswani et al., "Attention is all you need," in *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 30, 2017.

[3] Ethnologue, "Languages of the World," 25th ed., SIL International, 2022. [Online]. Available: https://www.ethnologue.com

[4] C. Fang et al., "From captions to visual concepts and back," in *Proc. IEEE Conf. on Computer Vision and Pattern Recognition (CVPR)*, 2015, pp. 1473–1482.

[5] Y. Yang et al., "Corpus-guided sentence generation of natural images," in *Proc. Conf. on Empirical Methods in Natural Language Processing (EMNLP)*, 2011, pp. 444–454.

[6] O. Vinyals, A. Toshev, S. Bengio, and D. Erhan, "Show and tell: A neural image caption generator," in *Proc. IEEE CVPR*, 2015, pp. 3156–3164.

[7] K. Xu et al., "Show, attend and tell: Neural image caption generation with visual attention," in *Proc. Int. Conf. Machine Learning (ICML)*, 2015, pp. 2048–2057.

[8] X. Li et al., "Oscar: Object-semantics aligned pre-training for vision-language tasks," in *Proc. European Conf. on Computer Vision (ECCV)*, 2020, pp. 121–137.

[9] P. Zhang et al., "VinVL: Revisiting visual representations in vision-language models," in *Proc. IEEE CVPR*, 2021, pp. 5579–5588.

[10] J. Li, D. Li, C. Xiong, and S. Hoi, "BLIP: Bootstrapping language-image pre-training for unified vision-language understanding and generation," in *Proc. Int. Conf. Machine Learning (ICML)*, 2022, pp. 12888–12900. [Online]. Available: https://arxiv.org/abs/2201.12086

[11] P. Koehn et al., "Moses: Open source toolkit for statistical machine translation," in *Proc. Assoc. Computational Linguistics (ACL)*, 2007, pp. 177–180.

[12] I. Sutskever, O. Vinyals, and Q. V. Le, "Sequence to sequence learning with neural networks," in *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 27, 2014.

[13] J. Tiedemann and S. Thottingal, "OPUS-MT — Building open translation services for the world," in *Proc. European Assoc. Machine Translation (EAMT)*, 2020. [Online]. Available: https://github.com/Helsinki-NLP/Opus-MT

[14] NLLB Team, Meta AI Research, "No language left behind: Scaling human-centered machine translation," *arXiv preprint arXiv:2207.04672*, 2022. [Online]. Available: https://arxiv.org/abs/2207.04672

[15] A. van den Oord et al., "WaveNet: A generative model for raw audio," *arXiv preprint arXiv:1609.03499*, 2016. [Online]. Available: https://arxiv.org/abs/1609.03499

[16] J. Shen et al., "Natural TTS synthesis by conditioning WaveNet on mel spectrogram predictions," in *Proc. IEEE Int. Conf. on Acoustics, Speech and Signal Processing (ICASSP)*, 2018, pp. 4779–4783.

[17] T. Wolf et al., "Transformers: State-of-the-art natural language processing," in *Proc. Conf. on Empirical Methods in Natural Language Processing (EMNLP): System Demonstrations*, 2020, pp. 38–45. [Online]. Available: https://huggingface.co/transformers

[18] M. Arjovsky, S. Chintala, and L. Bottou, "Wasserstein GAN," *arXiv preprint arXiv:1701.07875*, 2017.

[19] A. Radford et al., "Language models are unsupervised multitask learners," OpenAI Blog, 2019. [Online]. Available: https://openai.com/blog/better-language-models (GPT-2)

[20] MongoDB, Inc., "MongoDB Atlas Documentation," 2024. [Online]. Available: https://www.mongodb.com/docs/atlas/

[21] Pallets Projects, "Flask Documentation, v3.0," 2024. [Online]. Available: https://flask.palletsprojects.com

[22] Meta AI, "PyTorch Documentation," 2024. [Online]. Available: https://pytorch.org/docs/

[23] gTTS Contributors, "gTTS: Google Text-to-Speech Python library," 2024. [Online]. Available: https://gtts.readthedocs.io

[24] M. Jones, J. Bradley, and N. Sakimura, "JSON Web Token (JWT)," *RFC 7519*, Internet Engineering Task Force (IETF), 2015. [Online]. Available: https://tools.ietf.org/html/rfc7519

[25] N. Provos and D. Mazieres, "A future-adaptable password scheme," in *Proc. USENIX Annual Technical Conf.*, 1999. (bcrypt)

---

*Paper prepared for IEEE Conference Submission.*
*Project: SceneSense AI | Final Year B.Tech Project*
*Technologies: React, Flask, BLIP, NLLB-200, gTTS, MongoDB, JWT, bcrypt*

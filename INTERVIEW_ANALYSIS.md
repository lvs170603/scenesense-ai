# 🎬 SceneSense AI — Complete Project Deep Analysis
### For Interviews, Viva & Real-World Discussions

---

## 1. Project Overview

### What is this project?
**SceneSense AI** is a full-stack AI-powered web application that automatically **analyzes images and generates smart, contextual captions** — in multiple languages, with a text-to-speech (voice) feature on top.

> **Simple గా చెప్పాలంటే:** మీరు ఒక image upload చేస్తే, AI దాన్ని చూసి automatically description రాస్తుంది. తెలుగు, హిందీ, లేదా 20 భాషల్లో translate కూడా చేస్తుంది. Voice లో కూడా వినవచ్చు!

### What problem does it solve?

| Problem | Solution |
|---|---|
| Writing image descriptions manually is time-consuming | BLIP AI auto-generates captions in seconds |
| Language barriers for non-English users | Multi-language translation (20 languages) via NLLB-200 |
| Accessibility for visually impaired users | Text-to-speech (gTTS) converts captions to audio |
| No history of analyzed images | MongoDB stores full caption history |
| Insecure access | JWT auth + OTP-verified email signup |

### Who are the target users?
- **Content creators** who need quick image descriptions
- **Accessibility-focused apps** (alt-text generation for visually impaired)
- **E-commerce sellers** needing product descriptions
- **Students & educators** using multi-language content
- **Developers** building AI media pipelines

---

## 2. Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────┐
│             USER'S BROWSER               │
│   React + Vite (Frontend — Port 5173)    │
└──────────────┬────────────────┬──────────┘
               │  Axios/Fetch   │  (Vite Proxy)
               ▼                ▼
┌──────────────────────────────────────────┐
│        Flask Backend (Port 5000)         │
│   Blueprints: auth, upload, caption,     │
│              translate, voice, history   │
└────────┬──────────────┬──────────────────┘
         │              │
    ┌────▼────┐    ┌─────▼──────────────────────┐
    │ MongoDB │    │      AI / ML Services       │
    │  Atlas  │    │  BLIP-Large  (captioning)   │
    │ (Cloud) │    │  NLLB-200    (translation)  │
    └─────────┘    │  GPT-2       (story mode)   │
                   │  gTTS        (voice/mp3)    │
                   └────────────────────────────-┘
```

### Complete Request Flow (Step by Step)

**Example: User uploads an image and gets a Hindi caption with voice**

```
1.  User picks image in browser
2.  React → Axios → POST /upload  (multipart/form-data)
3.  Flask validates extension, saves with UUID filename to disk
4.  Flask returns { filename, preview_url }
5.  React → Axios → POST /caption  { filename, mode: "detailed" }
6.  Flask lazy-loads BLIP model on first call
7.  BLIP processes image → English caption string
8.  Flask returns { caption, mode }
9.  React → Axios → POST /translate  { text, language: "hi", image_name, ... }
10. Flask lazy-loads NLLB-200, translates English → Hindi
11. Flask saves to MongoDB history collection
12. Flask returns { translated_text, history_id }
13. React → Axios → POST /voice  { text: hindiCaption, language: "hi" }
14. gTTS converts text → MP3, saved to static/audio/
15. Flask returns { audio_url }
16. React renders AudioPlayer with the MP3 URL
```

---

## 3. Frontend Details

### Technologies Used

| Technology | Purpose |
|---|---|
| **React 18** | UI components & state management |
| **Vite** | Fast dev server + production bundler |
| **React Router DOM v6** | Client-side routing (SPA) |
| **Framer Motion** | Animations (scroll, hover, float, carousel) |
| **Axios** | HTTP requests to Flask backend |
| **Tailwind CSS v3** | Utility-first styling |
| **Vanilla CSS** | Custom design tokens, glassmorphism, dark/light mode |

### Pages (Routes)

| Route | Page | Purpose |
|---|---|---|
| `/` | `Landing.jsx` | Marketing landing page |
| `/login` | `Login.jsx` | Login form |
| `/signup` | `Signup.jsx` | Registration form |
| `/verify-otp` | `VerifyOtp.jsx` | 6-digit OTP entry |
| `/app` | `Home.jsx` | Main AI application |
| `*` | Redirects to `/` | 404 fallback |

### Key Components

```
src/components/
├── landing/                         → Marketing site sections
│   ├── Navbar.jsx                   → Top nav with theme toggle
│   ├── HeroSection.jsx              → Headline + CTA buttons
│   ├── FeaturesSection.jsx          → Feature cards
│   ├── DemoPreview.jsx              → Live demo walkthrough
│   ├── ScreenshotsSection.jsx       → Infinite scrolling mockup carousel
│   ├── HowItWorks.jsx               → Step-by-step flow
│   ├── AIFeatures.jsx               → AI capabilities
│   ├── TrialSection.jsx             → Free trial CTA
│   ├── CTASection.jsx               → Final call-to-action
│   └── Footer.jsx                   → Footer links
├── ImageUploader.jsx                → Drag & drop with upload progress
├── CaptionDisplay.jsx               → Shows caption + options
├── AudioPlayer.jsx                  → Plays generated MP3
├── HistoryPanel.jsx                 → Past caption history sidebar
├── LanguageSelector.jsx             → Dropdown for 20 languages
├── StyleModeSelector.jsx            → Simple / Detailed / Story picker
├── Navbar.jsx                       → App navbar with user info + logout
└── ParticleBackground.jsx           → Animated floating particles
```

### Frontend → Backend Communication

Two separate service files:

**`src/services/api.js`** — uses **Axios**:
```js
const api = axios.create({ baseURL: '/', timeout: 120_000 })
// Vite dev proxy routes /upload, /caption, etc. → Flask:5000
// Functions: uploadImage(), generateCaption(), translateCaption(),
//            generateVoice(), fetchHistory()
```

**`src/services/authApi.js`** — uses **native Fetch API**:
```js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
// Functions: signup(), verifyOtp(), resendOtp(), login()
// Session helpers: saveSession(), getToken(), clearSession()
// JWT stored in: localStorage.setItem('ss_token', token)
```

### Theme System
- **Dark mode** (default) and **Light mode** toggle button in navbar
- Implemented via `ThemeContext.jsx` (React **Context API**)
- Theme class (`html.light`) applied to `<html>` element
- All components call `useTheme()` hook to switch colours reactively

---

## 4. Backend Details

### Language & Framework
- **Language:** Python 3.10+
- **Framework:** Flask 3.0.3
- **Pattern:** Application Factory (`create_app()` in `app.py`)

### Project Structure

```
scenesense-backend/
├── app.py              → Factory: registers blueprints + CORS
├── config.py           → All config from .env (central source of truth)
├── routes/             → URL handlers (one Blueprint per feature)
│   ├── auth_route.py      → /auth/signup, login, verify-otp, resend-otp
│   ├── upload_route.py    → POST /upload
│   ├── caption_route.py   → POST /caption
│   ├── translate_route.py → POST /translate
│   ├── voice_route.py     → POST /voice
│   └── history_route.py   → GET /history
├── models/             → Raw PyMongo database helpers
│   ├── user_model.py      → users collection CRUD
│   └── history_model.py   → history collection CRUD
└── services/           → Business logic / AI model wrappers
    ├── caption_service.py     → BLIP + GPT-2 (Singleton)
    ├── translation_service.py → NLLB-200 (Singleton)
    ├── voice_service.py       → gTTS MP3 generation
    └── email_service.py       → Brevo SMTP OTP emails
```

### Flask Blueprints
Flask **Blueprint** = a mini-application grouping related routes:
```python
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
# Registers: /auth/signup, /auth/login, /auth/verify-otp, /auth/resend-otp
# All blueprints registered in app.py via app.register_blueprint(...)
```

### Middleware / Cross-Cutting Concerns
| Concern | Implementation |
|---|---|
| CORS | `flask-cors` — allows all origins (`"*"`) |
| File size limit | `MAX_CONTENT_LENGTH = 16 MB` |
| Lazy model loading | Singleton + `_load()` pattern |
| DNS fix | Patches resolver to `8.8.8.8` for MongoDB Atlas on Linux/WSL |
| Production server | Gunicorn (`gunicorn app:create_app()`) |
| Multi-threading | `threaded=True` in dev, Gunicorn workers in production |

---

## 5. API Design

### Complete API Table

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check → `{"status": "ok"}` |
| `POST` | `/auth/signup` | Register, sends OTP email |
| `POST` | `/auth/verify-otp` | Verify 6-digit OTP |
| `POST` | `/auth/resend-otp` | Send a fresh OTP |
| `POST` | `/auth/login` | Login → returns JWT token |
| `POST` | `/upload` | Upload image → returns filename |
| `POST` | `/caption` | Generate English caption from image |
| `POST` | `/translate` | Translate caption → saves to history |
| `POST` | `/voice` | Convert text → MP3 file |
| `GET` | `/history` | Fetch paginated caption history |

### Request / Response Examples

**POST /upload**
```
Request:  multipart/form-data  (field: "image")
Response: { "filename": "abc123.jpg", "preview_url": "/static/uploads/abc123.jpg" }
```

**POST /caption**
```
Request:  { "filename": "abc123.jpg", "mode": "detailed" }
Response: { "caption": "A golden retriever playing in a sunny park...", "mode": "detailed" }
```

**POST /translate**
```
Request:  { "text": "A dog in a park", "language": "te", "image_name": "abc123.jpg", "mode": "simple" }
Response: { "translated_text": "పార్కులో ఒక కుక్క", "language": "te", "history_id": "665abc..." }
```

**POST /voice**
```
Request:  { "text": "పార్కులో ఒక కుక్క", "language": "te" }
Response: { "audio_url": "/static/audio/audio_xyz.mp3", "filename": "audio_xyz.mp3" }
```

**GET /history**
```
Query params: ?limit=20&skip=0
Response: { "history": [...], "count": 20 }
```

---

## 6. Database

### Database: MongoDB Atlas (Cloud NoSQL)
- Driver: `pymongo` (no ODM like MongoEngine)
- DB name: `scenesense`
- 2 collections: `users`, `history`

### `users` Collection Schema
```json
{
  "_id":           "ObjectId auto-generated",
  "full_name":     "Venkat",
  "email":         "venkat@example.com",
  "password_hash": "$2b$12$...",     ← bcrypt hash, NEVER plain text
  "is_verified":   true,
  "otp":           null,             ← cleared after verification
  "otp_expires_at": null,
  "created_at":    "2025-01-01T00:00:00Z"
}
```

### `history` Collection Schema
```json
{
  "_id":                "ObjectId auto-generated",
  "image_name":         "abc123.jpg",
  "caption":            "A dog playing in the park",
  "translated_caption": "పార్కులో ఒక కుక్క ఆడుకుంటోంది",
  "language":           "te",
  "mode":               "simple",
  "timestamp":          "2025-01-01T12:00:00Z"
}
```

### Data Flow Example
```
1. User uploads image → file saved on disk (static/uploads/)
2. BLIP generates caption → string returned
3. NLLB-200 translates → insert_history() called → saved to MongoDB
4. User opens History panel → GET /history
   → MongoDB .find().sort("timestamp", -1).skip(0).limit(20)
   → Returns JSON list of records
```

---

## 7. Authentication & Security

### Signup → OTP → Login Flow

```
SIGNUP:
  1. User fills name, email, password on /signup
  2. Backend validates: email format (regex), len(password) >= 6, passwords match
  3. Check duplicate: MongoDB find_by_email()
  4. Hash: bcrypt.hashpw(password.encode(), bcrypt.gensalt())
  5. Create user doc: is_verified=False, OTP=random 6 digits, expiry=+5 min
  6. Send HTML OTP email via Brevo SMTP
  7. Redirect user to /verify-otp

OTP VERIFICATION:
  1. User types 6-digit OTP
  2. Backend: fetch user, compare OTP string, check expiry timestamp
  3. If valid: set is_verified=True, clear OTP from DB

LOGIN:
  1. User enters email + password
  2. Backend: bcrypt.checkpw(password, stored_hash)
  3. If not verified → 403 response
  4. If OK → generate JWT: { sub: user_id, email, exp: +24h }
  5. Frontend: localStorage.setItem('ss_token', token)
```

### Security Measures

| Measure | How |
|---|---|
| Password hashing | `bcrypt` with random salt — never stores plain text |
| JWT auth | `PyJWT` HS256 signed, 24h expiry |
| OTP expiry | 5 minutes, stored in DB, checked on verify |
| File validation | Extension whitelist (png/jpg/jpeg/webp/gif) |
| File size limit | 16 MB max |
| Secure filename | `werkzeug.secure_filename` + UUID rename |
| Email format check | Server-side regex validation |
| CORS | `flask-cors` configured (open `*` — should restrict in prod) |

---

## 8. Key Features

| Feature | Technical Detail |
|---|---|
| 🖼️ Image Upload | Drag & drop, multipart POST, UUID filename, progress bar |
| 🤖 AI Captioning | BLIP-Large, 3 modes: Simple / Detailed / Story |
| 🌍 Multi-language | NLLB-200 (600M), 20 languages |
| 🔊 Text-to-Speech | gTTS → MP3 → custom AudioPlayer |
| 📋 History Panel | MongoDB, paginated, newest-first |
| 🔐 Auth System | Signup → OTP Email → JWT Login |
| 🌙 Dark/Light Theme | React Context, CSS tokens, glassmorphism |
| 🎞️ Landing Page | Framer Motion animations, infinite mockup carousel |

### Most Complex / Unique Features

**1. Singleton AI Models (Lazy Loading)**
> BLIP and NLLB-200 load only on first request using Python's `__new__` Singleton pattern. A `_load()` method checks `if self._processor is not None: return` — skips re-loading on every request.

**2. Three Caption Modes**
- `simple` → BLIP only → one short sentence (max 60 tokens)
- `detailed` → BLIP base + GPT-2 expands into a paragraph
- `story` → BLIP base + GPT-2 with narrative "Once upon a time..." prompt

**3. GPU / CPU Auto-detection**
```python
device = "cuda" if torch.cuda.is_available() else "cpu"
self._model.to(device)
```

**4. Branded OTP Emails**
> HTML emails styled with the app's dark theme (no external SDK — uses Python's built-in `smtplib` with Brevo SMTP).

**5. Infinite Scrolling Carousel**
```jsx
animate={{ x: ["0%", "-50%"] }}
transition={{ duration: 30, ease: "linear", repeat: Infinity }}
// Content is duplicated [...screenshots, ...screenshots] for seamless loop
```

---

## 9. Tools & Libraries

### Backend

| Library | Purpose |
|---|---|
| `Flask` | Web framework |
| `flask-cors` | CORS headers |
| `transformers` | HuggingFace — BLIP, NLLB-200, GPT-2 |
| `torch` | PyTorch — model inference |
| `Pillow` | Image file reading |
| `pymongo` | MongoDB driver |
| `bcrypt` | Password hashing |
| `PyJWT` | JWT create/verify |
| `gtts` | Google Text-to-Speech |
| `python-dotenv` | Load `.env` variables |
| `gunicorn` | Production WSGI server |
| `sentencepiece` | NLLB-200 tokenizer |
| `dnspython` | MongoDB Atlas DNS fix on WSL/Linux |
| `accelerate` | HuggingFace model load optimization |

### Frontend

| Library | Purpose |
|---|---|
| `react` | UI framework |
| `react-router-dom` | SPA routing |
| `framer-motion` | Animations |
| `axios` | HTTP client with interceptors + upload progress |
| `react-icons` | Icon set (Feather Icons) |
| `tailwindcss` | Utility CSS classes |
| `vite` | Fast build + hot reload |

---

## 10. Deployment

| Layer | Platform | Notes |
|---|---|---|
| **Backend** | **Render.com** | `render.yaml` configured, Gunicorn start command |
| **Database** | **MongoDB Atlas** | Cloud-hosted, free tier |
| **Frontend** | **Vercel** (recommended) | Vite static build deploys perfectly |
| **Email** | **Brevo SMTP** | Transactional email for OTP |

### Environment Variables
```env
# Backend .env
MONGO_URI=mongodb+srv://...
MONGO_DB_NAME=scenesense
JWT_SECRET=your-secret-key
JWT_EXPIRY_HOURS=24
OTP_EXPIRY_MINUTES=5
BREVO_SMTP_LOGIN=your@email.com
BREVO_SMTP_PASSWORD=your-brevo-key
BREVO_SENDER_EMAIL=no-reply@scenesense.ai
PORT=5000

# Frontend .env
VITE_API_URL=http://localhost:5000
```

---

## 11. Challenges Faced

| Challenge | Problem | Solution |
|---|---|---|
| AI model load time | BLIP takes ~30s to load | Lazy loading + Singleton pattern |
| MongoDB DNS on Linux/WSL | SRV lookup fails | Patched resolver to `8.8.8.8` in `config.py` |
| OTP timezone bug | PyMongo returns naive UTC datetimes | Manually added `tzinfo=timezone.utc` before comparison |
| Bad translation quality | MarianMT gave repeated / wrong words | Upgraded to NLLB-200 |
| CORS errors in dev | Browser blocks cross-origin requests | `flask-cors` + Vite proxy config |
| File naming conflicts | Same filename from two users | UUID prefix on every uploaded file |
| Large model on free server | 600M+ params use lots of RAM | Used `nllb-200-distilled-600M` (smaller variant) |
| Button text invisible on hover | CSS `::before` pseudo-element covered text | Wrapped text in `<span>` (CSS rule targets `btn-primary > *`) |
| Duplicate JSX attribute error | `className` written twice on a div | Merged into single className string |

---

## 12. Improvements & Future Scope

| Improvement | Why It Matters |
|---|---|
| **Per-user history** | Currently history is global for all users |
| **JWT on all routes** | upload/caption/translate routes have no auth guard |
| **Redis caching** | Cache BLIP results for identical images |
| **Image compression** | Resize before BLIP inference for speed |
| **Rate limiting** | Prevent API abuse (`flask-limiter`) |
| **Cloud file storage** | Replace local disk with S3 / Cloudinary |
| **WebSocket progress** | Real-time model progress bar |
| **Restrict CORS** | Replace `*` with specific allowed origins |
| **Docker** | Containerize for consistent deployment |
| **Switch to OpenAI Vision** | Faster, no RAM issues, scalable API |

---

## 13. Interview Questions & Answers

---

### Architecture

**Q1: Explain the architecture of your project.**

> SceneSense AI is a full-stack web application. The **frontend** is React + Vite, the **backend** is Python Flask, and the **database** is MongoDB Atlas. The frontend communicates with Flask via Axios. Flask uses **Blueprints** to separate concerns — auth, upload, caption, translation, voice, and history are independent modules. AI work is done by HuggingFace models (BLIP, NLLB-200, GPT-2) running inside the backend server.

**Q2: Why Flask over Django?**

> Flask is a **micro-framework** — lightweight and flexible. Since this is a focused API server (not a CMS), Flask's simplicity wins. Django adds an ORM, admin panel, and template engine that I don't need. Flask Blueprints give me the same modular organization.

**Q3: Why MongoDB over SQL (MySQL/PostgreSQL)?**

> The data is document-shaped — users and history records don't have complex relationships or joins. MongoDB's **schema-less** nature let me iterate quickly without migrations. MongoDB Atlas provides free cloud hosting. For a relational use-case, SQL would be better.

---

### Authentication

**Q4: How does your authentication work end-to-end?**

> Signup: user provides name, email, password → backend validates + bcrypt-hashes password → creates MongoDB user doc with `is_verified=False` + OTP → sends HTML OTP email via Brevo SMTP.  
> Verify: user enters OTP → backend compares + checks 5-min expiry → marks `is_verified=True`.  
> Login: user sends email + password → bcrypt.checkpw() → if verified, generates JWT signed with HS256 → frontend stores token in localStorage.

**Q5: What is bcrypt and why is it used?**

> `bcrypt` is a password hashing function. It adds a **random salt** so two identical passwords produce different hashes. It also has a configurable **work factor** making brute-force attacks computationally expensive. We never store plain-text passwords.

**Q6: What is a JWT token?**

> **JSON Web Token** — a three-part signed string: `Header.Payload.Signature`.  
> Payload contains: `{ sub: user_id, email, exp: +24h, iat: issued_at }`.  
> The server signs it with a secret key (HS256). When the client sends it back, the server re-verifies the signature — **no database lookup needed** (stateless auth).

**Q7: Why OTP email verification?**

> To confirm the user actually owns the email address. Without it, anyone can register with fake emails. OTP expires in 5 minutes and is cleared from the database after use.

---

### AI / ML

**Q8: What AI model generates the captions?**

> **Salesforce BLIP-Large** (Bootstrapping Language-Image Pretraining). It is a Vision-Language model that takes an image and generates a text description. We use **conditional image captioning** — passing a text prompt to guide generation style.

**Q9: What is the difference between Simple, Detailed, and Story modes?**

> - **Simple:** BLIP alone → one short sentence (max 60 tokens)
> - **Detailed:** BLIP generates base caption → GPT-2 expands into a descriptive paragraph
> - **Story:** BLIP base caption → GPT-2 generates a narrative story starting with a title prompt

**Q10: What is NLLB-200?**

> **No Language Left Behind** — a multilingual seq2seq translation model by Meta/Facebook supporting **200 languages**. We use the distilled 600M parameter version. It replaced MarianMT because it gives more accurate translations, especially for Indian languages (Telugu, Hindi).

**Q11: How does text-to-speech work?**

> We use **gTTS (Google Text-to-Speech)** — a Python library calling Google's TTS API. We pass text + language code → it returns MP3 data → we save it to `static/audio/` with a UUID filename → return the URL → frontend AudioPlayer plays it.

**Q12: What is the Singleton pattern? Where do you use it?**

> Singleton ensures **only one instance** of a class exists. `CaptionService`, `TranslationService` use Python's `__new__` to return the same instance every time. This is critical because loading BLIP or NLLB-200 multiple times would consume gigabytes of RAM and take several minutes.

---

### Frontend

**Q13: How is routing handled?**

> **React Router DOM v6** defines all routes in `App.jsx` using `<Routes>` and `<Route>`. It's a **Single Page Application** — one HTML file is served, JavaScript handles navigation. `<Navigate to="/" replace />` handles unknown routes (404 fallback).

**Q14: What is the Context API? How do you use it?**

> React's built-in global state mechanism. Used here for **dark/light theme**. `ThemeContext` provides `theme` value + `toggleTheme()` to all components without prop-drilling. Components call `const { theme } = useTheme()` to read the current theme.

**Q15: What is Framer Motion?**

> A React animation library. Used for: scroll-triggered fade-ins (`whileInView`), floating icon animations (`animate={{ y: [0, -12, 0] }}`), hover lift effects, and the infinite scrolling carousel (`animate={{ x: ["0%", "-50%"] }}, repeat: Infinity`).

**Q16: Axios vs Fetch — why use both?**

> **Axios** (for main APIs): automatic JSON parsing, response interceptors for global error handling, upload progress events (`onUploadProgress`).  
> **Fetch** (for auth APIs): built-in browser API, simpler for straightforward POST/JSON requests. No need to import a library. Both work fine — mixing is a valid design choice.

---

### Backend

**Q17: What is a Flask Blueprint?**

> A **Blueprint** is a Flask pattern for grouping related routes into a separate module. Example: `auth_bp = Blueprint("auth", __name__, url_prefix="/auth")` registers all auth routes under `/auth/`. All blueprints are assembled in `app.py` with `app.register_blueprint(...)`. This makes the codebase modular and maintainable.

**Q18: How does file upload work on the backend?**

> Flask receives the file from `request.files["image"]`. Extension is validated against an allowlist. File is renamed with `uuid.uuid4().hex` to prevent conflicts. Saved to `static/uploads/`. Filename returned to client for use in caption/translate calls.

**Q19: What is lazy loading for AI models?**

> Models are NOT loaded at server startup. The `CaptionService._load()` method checks `if self._processor is not None: return` — skips re-loading. On the first caption request, BLIP loads into memory (~30s). All subsequent requests use the cached model. This saves startup time and memory.

---

### Database

**Q20: Explain your MongoDB schema.**

> Two collections:
> - `users`: auth data (name, email, bcrypt hash, OTP, is_verified, created_at)
> - `history`: caption records (image_name, caption, translated_caption, language, mode, timestamp)
> No complex relationships — each collection is self-contained and independently queried.

**Q21: How does pagination work in history?**

> `GET /history?limit=20&skip=0` → PyMongo query:
> ```python
> collection.find({}).sort("timestamp", DESCENDING).skip(skip).limit(limit)
> ```
> `limit` is clamped to 1–100. `skip` increases with each page load (e.g., skip=20 for page 2).

---

### Advanced / Tricky

**Q22: Is this a RESTful API?**

> Yes. It follows REST principles: HTTP verbs (GET for fetch, POST for create/action), URL-based resources (`/history`, `/auth/signup`), stateless requests (each request has all needed info), JSON response bodies.

**Q23: What is CORS and why do you need it?**

> **Cross-Origin Resource Sharing** — a browser security policy blocking requests between different domains/ports. React on `localhost:5173` calling Flask on `localhost:5000` is cross-origin. `flask-cors` adds `Access-Control-Allow-Origin: *` header so browsers allow it.

**Q24: What happens if the AI model throws an error?**

> Each route wraps the service call in `try/except`. If an exception occurs, `logger.exception()` logs the full stack trace. A `500` JSON response is returned: `{"error": "Caption generation failed. Please try again."}`. The app stays running — errors don't crash the server.

**Q25: How would you scale this to 10,000 users?**

> 1. Replace self-hosted models with cloud AI APIs (OpenAI Vision) — no RAM issues
> 2. Redis caching for repeated identical images
> 3. S3 / Cloudinary for file storage instead of local disk
> 4. Gunicorn with multiple workers + load balancer
> 5. Celery + Redis task queue for heavy AI jobs
> 6. Per-user data isolation in MongoDB

**Q26: Why store JWT in localStorage? What's the security risk?**

> Simpler to implement for an SPA. The risk: localStorage is **vulnerable to XSS** (malicious JavaScript can read it). The more secure alternative is `HttpOnly` cookies (JavaScript cannot access them). For production, `HttpOnly` cookies are recommended.

**Q27: How does the OTP expiry timezone bug work?**

> PyMongo returns datetimes from MongoDB as **naive UTC** (no timezone info attached). Python's `datetime.now(timezone.utc)` is **timezone-aware**. Comparing these raises a TypeError. Fix: `expires_at = expires_at.replace(tzinfo=timezone.utc)` to make it aware before comparison.

**Q28: What is `threaded=True` in `app.run()`?**

> Flask's development server is single-threaded by default — one request at a time. `threaded=True` enables multi-threading so multiple users can be served simultaneously during development. In production, Gunicorn manages this with worker processes.

---

## Quick Summary (One-Liner for Interviews)

> *"SceneSense AI is a full-stack AI web application. The frontend is React + Vite, the backend is Python Flask with Blueprint architecture, and the database is MongoDB Atlas. It uses Salesforce BLIP-Large for image captioning, Facebook NLLB-200 for translating to 20 languages, and gTTS for text-to-speech. Authentication uses bcrypt password hashing, JWT tokens, and OTP email verification via Brevo SMTP. AI models use the Singleton pattern with lazy loading for memory efficiency."*

---

> **తెలుగు Summary:**
> "SceneSense AI అనేది ఒక AI web application. User image upload చేస్తే, BLIP model caption generate చేస్తుంది. NLLB-200 model దాన్ని 20 languages లో translate చేస్తుంది. gTTS voice గా మారుస్తుంది. MongoDB లో history store అవుతుంది. Login కి bcrypt password hashing, JWT tokens, మరియు OTP email verification use చేశాను. AI models Singleton pattern తో lazy load అవుతాయి — memory save అవుతుంది."

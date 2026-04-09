# SceneSense AI — Multilingual Image Captioning with Voice Assistance

> **A production-ready AI web app** that generates smart image captions in English, Hindi, and Telugu with voice output — powered by BLIP, MarianMT, and gTTS. Features a complete authentication flow using JWT and Brevo SMTP OTP verification.

🌐 **Live Demo:** [https://scene-sense-ai.vercel.app](https://scene-sense-ai.vercel.app)

| | |
|---|---|
| **Frontend** | [![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://scene-sense-ai.vercel.app) |
| **Backend** | [![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render)](https://github.com/lvs170603/SceneSenseAI-backend) |
| **Frontend Repo** | [![GitHub](https://img.shields.io/badge/GitHub-SceneSenseAI--Frontend-181717?logo=github)](https://github.com/lvs170603/SceneSenseAI-Frontend) |
| **Backend Repo** | [![GitHub](https://img.shields.io/badge/GitHub-SceneSenseAI--backend-181717?logo=github)](https://github.com/lvs170603/SceneSenseAI-backend) |

---

## ✨ Features

| Feature | Details |
|---|---|
| 🖼 Image Upload | Drag-and-drop with live preview |
| 🤖 AI Captioning | Salesforce BLIP (Simple / Detailed / Story modes) |
| 🌍 Translation | MarianMT — English → Hindi & Telugu |
| 🔊 Voice Output | gTTS MP3 generation with in-browser playback |
| 🔒 Authentication | Secure JWT login, BCrypt password hashing |
| 📧 Email Verification | Real-time OTP email verification using Brevo SMTP |
| 📜 History | MongoDB-persisted caption history with pagination |
| ⚡ Modern UI | Glassmorphism, gradient backgrounds, micro-animations |

---

## 🗂 Project Structure

```
SceneSense AI/
├── scenesense-backend/
│   ├── app.py                 # Flask application factory
│   ├── config.py              # Central config (reads .env & sets DNS patch)
│   ├── requirements.txt
│   ├── .env.example
│   ├── routes/
│   │   ├── auth_route.py      # POST /auth/signup, /login, /verify-otp
│   │   ├── upload_route.py    # POST /upload
│   │   ├── caption_route.py   # POST /caption
│   │   ├── translate_route.py # POST /translate
│   │   ├── voice_route.py     # POST /voice
│   │   └── history_route.py   # GET  /history
│   ├── services/
│   │   ├── email_service.py      # Brevo SMTP OTP sender
│   │   ├── caption_service.py    # BLIP wrapper (singleton)
│   │   ├── translation_service.py# MarianMT wrapper (per-lang singleton)
│   │   └── voice_service.py      # gTTS wrapper
│   ├── models/
│   │   ├── user_model.py      # Auth & OTP MongoDB operations
│   │   └── history_model.py   # Caption history PyMongo helpers
│   └── static/
│       ├── uploads/           # Saved user images
│       └── audio/             # Generated MP3 files
│
└── scenesense-frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── services/
        │   ├── api.js         # Main application API endpoints
        │   └── authApi.js     # Authentication API endpoints
        ├── components/
        │   ├── ImageUploader.jsx
        │   ├── ...
        └── pages/
            ├── Home.jsx
            ├── History.jsx
            ├── Login.jsx      # User login page
            ├── Signup.jsx     # User registration page
            └── VerifyOtp.jsx  # Email OTP verification page
```

---

## 🚀 Local Setup

### Prerequisites

- Python ≥ 3.10
- Node.js ≥ 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Brevo Account (for SMTP email delivery)
- `pip` and `npm`

---

### 1 — Backend

```bash
cd scenesense-backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies (includes Flask, PyTorch, PyMongo, dnspython, bcrypt, PyJWT)
pip install -r requirements.txt

# Configure environment
cp .env.example .env
```

**Required `.env` Variables for Backend:**
Ensure you set up your database and email credentials in the `.env` file before running the server:
- `MONGO_URI`: Your MongoDB connection string. *(Note: If you face DNS timeout errors on Ubuntu with MongoDB Atlas, the `dnspython` fix is already applied in `config.py`)*
- `BREVO_SMTP_LOGIN` & `BREVO_SMTP_PASSWORD`: Your Brevo SMTP credentials for OTP emails.
- `JWT_SECRET`: A secure random string for signing auth tokens.

```bash
# Run backend server
python app.py
# Listening on http://localhost:5000
```

> ⚠️ **First run**: BLIP and MarianMT models (~1–3 GB) will download automatically from HuggingFace. This may take a few minutes before the server becomes responsive.

---

### 2 — Frontend

```bash
cd scenesense-frontend

npm install
npm run dev
# Vite dev server starts at http://localhost:5173
```

Open `http://localhost:5173/signup` in your browser to test the authentication flow.

---

## 🌐 API Reference

### Authentication
| Method | Endpoint | Body / Params | Response |
|---|---|---|---|
| `POST` | `/auth/signup` | `{ full_name, email, password, confirm_password }` | `{ message, user_id }` |
| `POST` | `/auth/verify-otp` | `{ email, otp }` | `{ message }` |
| `POST` | `/auth/resend-otp` | `{ email }` | `{ message }` |
| `POST` | `/auth/login` | `{ email, password }` | `{ message, token, user }` |

### Core Services
| Method | Endpoint | Body / Params | Response |
|---|---|---|---|
| `POST` | `/upload` | `multipart/form-data { image }` | `{ filename, preview_url }` |
| `POST` | `/caption` | `{ filename, mode }` | `{ caption, mode }` |
| `POST` | `/translate` | `{ text, language, image_name?, original_caption?, mode? }` | `{ translated_text, language, history_id }` |
| `POST` | `/voice` | `{ text, language }` | `{ audio_url, filename }` |
| `GET`  | `/history` | `?limit=20&skip=0` | `{ history: [...], count }` |

**Language codes:** `en` · `hi` · `te`  
**Mode values:** `simple` · `detailed` · `story`

---

## 🏗 Deployment on Render

*(Follow identical steps to the previous deployment instructions, ensuring to add `JWT_SECRET`, `BREVO_SMTP_LOGIN`, `BREVO_SMTP_PASSWORD` to your Render environment variables for the Web Service).*

---

## 🛠 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `MONGO_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `MONGO_DB_NAME` | `scenesense` | Database name |
| `FLASK_ENV` | `development` | Flask env mode |
| `PORT` | `5000` | Backend port |
| `JWT_SECRET` | `change-me-in-production` | Secret string for JWT generation |
| `JWT_EXPIRY_HOURS` | `24` | Token expiration time |
| `BREVO_SMTP_HOST` | `smtp-relay.brevo.com` | Brevo SMTP host |
| `BREVO_SMTP_PORT` | `587` | Brevo SMTP port |
| `BREVO_SMTP_LOGIN` | `""` | Account login for Brevo |
| `BREVO_SMTP_PASSWORD` | `""` | SMTP password from Brevo |
| `OTP_EXPIRY_MINUTES` | `5` | Minutes until OTP expires |

---

## 📦 Tech Stack

**Backend:** Python · Flask · HuggingFace Transformers · BLIP · MarianMT · gTTS · PyMongo · BCrypt · PyJWT  
**Frontend:** React 18 · Vite · Tailwind CSS · Axios · React Router v6  
**Database:** MongoDB

---

## 🧑‍💻 Author

Built with ❤️ — **SceneSense AI** is a resume-level, production-ready full-stack AI project.

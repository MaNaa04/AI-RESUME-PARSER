# 🤖 AI Resume Parser

An AI-powered fullstack web application that parses resume files (PDF or DOCX) and returns structured insights using **Google Gemini**.

## ✨ Features

- **Drag & drop** file upload (`.pdf` / `.docx`, max 10 MB)
- **AI-powered analysis** via Google Gemini 1.5 Flash
- Extracts:
  - 🛠️ **Skills & Technologies** — badge/chip style
  - 💼 **Work Experience** — timeline with contributions
  - 🎓 **Education** — card grid layout
  - 💪 **Candidate Strength Report** — animated score meter + strengths + summary
- Skeleton loader while awaiting results
- User-friendly error messages for all edge cases
- Responsive, glassmorphism dark-mode UI

## 🗂️ Tech Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS 3, Axios                   |
| Backend    | Python 3.10+, FastAPI, Uvicorn                          |
| AI         | Google Gemini 1.5 Flash (`google-generativeai`)         |
| PDF parse  | `pdfplumber`                                            |
| DOCX parse | `python-docx`                                           |
| Hosting    | **Vercel** (frontend) · **Render** (backend)            |

## 📁 Project Structure

```
resume-parser/
├── frontend/               # React + Tailwind Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── SkillsCard.jsx
│   │   │   ├── ExperienceCard.jsx
│   │   │   ├── EducationCard.jsx
│   │   │   └── StrengthReport.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vercel.json          ← Vercel deployment config
│   ├── .env.example         ← documents VITE_API_URL
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                # FastAPI app
│   ├── main.py
│   ├── parser.py
│   ├── gemini.py
│   ├── models.py
│   ├── .env                ← your API key goes here
│   ├── .env.example
│   ├── .gitignore
│   └── requirements.txt
│
├── render.yaml              ← Render deployment blueprint
├── .gitignore
└── README.md
```

## 🔑 Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key

## 🚀 Setup & Running

### 1. Clone / open the project

```bash
cd resume-parser
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate          # Windows PowerShell
# source venv/bin/activate       # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Add your Gemini API key
# Edit .env and replace "your_key_here" with your actual key:
# GEMINI_API_KEY=AIza...

# Start the backend
uvicorn main:app --reload
```

The API runs at: **http://localhost:8000**  
Health check: **http://localhost:8000/health**  
API docs: **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at: **http://localhost:5173**

## 🔌 API Reference

### `GET /health`
Returns `{"status": "ok"}` when the server is running.

### `POST /api/parse-resume`
**Request:** `multipart/form-data` with field `file` (.pdf or .docx)  
**Response:** JSON matching the `ResumeInsights` schema:

```json
{
  "skills_and_technologies": ["Python", "React", "Docker"],
  "work_experience_summary": [
    {
      "company": "Acme Corp",
      "role": "Senior Developer",
      "duration": "Jan 2021 – Dec 2023",
      "key_contributions": ["Built scalable APIs", "Led team of 5 engineers"]
    }
  ],
  "education": [
    {
      "degree": "B.Tech in Computer Science",
      "institution": "IIT Delhi",
      "year": "2020"
    }
  ],
  "candidate_strength_report": {
    "overall_score": 82,
    "strengths": ["Strong backend skills", "Leadership experience"],
    "profile_summary": "A well-rounded software engineer with 3+ years..."
  }
}
```

**Error responses:**
- `400` — Unsupported file type, empty file, or unreadable content
- `500` — Gemini API failure or parsing error

## ☁️ Production Deployment

### Architecture

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   Browser   │──HTTPS──▶   Vercel     │         │  Google AI │
│   (User)    │         │  (Frontend)  │         │  (Gemini)  │
└─────────────┘         └──────┬───────┘         └─────▲──────┘
                               │ API calls              │
                               ▼                        │
                        ┌──────────────┐                │
                        │   Render     │────────────────┘
                        │  (Backend)   │
                        └──────────────┘
```

### Frontend → Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repo.
2. Configure the project:

   | Setting              | Value           |
   |----------------------|-----------------|
   | **Framework Preset** | Vite            |
   | **Root Directory**   | `frontend`      |
   | **Build Command**    | `npm run build` |
   | **Output Directory** | `dist`          |

3. Add the environment variable:

   | Key            | Value                                            |
   |----------------|--------------------------------------------------|
   | `VITE_API_URL` | Your Render backend URL (e.g. `https://ai-resumer-parser-app.onrender.com`) |

   > ⚠️ **No trailing slash** — use `https://…onrender.com` not `https://…onrender.com/`

4. Click **Deploy**.

### Backend → Render

The backend deploys via the `render.yaml` blueprint (Infrastructure as Code).

1. Go to [dashboard.render.com](https://dashboard.render.com) → **Blueprints** → **New Blueprint Instance**.
2. Connect your GitHub repo — Render reads `render.yaml` automatically.
3. Set the environment variables when prompted:

   | Key               | Value                                                   |
   |-------------------|---------------------------------------------------------|
   | `GEMINI_API_KEY`  | Your Google AI API key                                  |
   | `ALLOWED_ORIGINS` | Your Vercel URL (e.g. `https://ai-resume-parser.vercel.app`) |

### Auto-Deploys

Both platforms auto-deploy when you push to `main`:
- **Vercel** rebuilds and redeploys the frontend
- **Render** rebuilds and redeploys the backend

### Environment Variables Summary

| Platform | Variable           | Where to set                     | Purpose                            |
|----------|--------------------|----------------------------------|------------------------------------|
| Vercel   | `VITE_API_URL`     | Vercel → Settings → Env Vars     | Backend API URL for the frontend   |
| Render   | `GEMINI_API_KEY`   | Render Dashboard → Environment   | Google Gemini API authentication   |
| Render   | `ALLOWED_ORIGINS`  | Render Dashboard → Environment   | CORS — whitelist your Vercel URL   |

## 🛡️ Security Notes

- The `GEMINI_API_KEY` is stored in `backend/.env` (locally) and in Render's environment (production) — **never** exposed to the frontend
- All `.env` files are included in `.gitignore` — never commit them
- `VITE_API_URL` is safe to expose (it's just the public backend URL)
- Use `.env.example` files as templates for onboarding new developers

## 📝 License

MIT

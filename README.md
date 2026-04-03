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

| Layer     | Technology                                               |
|-----------|----------------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS 3, Axios                    |
| Backend   | Python 3.10+, FastAPI, Uvicorn                           |
| AI        | Google Gemini 1.5 Flash (`google-generativeai`)          |
| PDF parse | `pdfplumber`                                             |
| DOCX parse| `python-docx`                                            |

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

## 🛡️ Security Notes

- The `GEMINI_API_KEY` is stored in `backend/.env` and **never** exposed to the frontend
- The `.env` file is included in `.gitignore` — never commit it
- Use `.env.example` as a template for onboarding new developers

## 📝 License

MIT


render.yaml 
infrastructure as code.

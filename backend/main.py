"""
main.py
-------
FastAPI application entry point for the AI Resume Parser backend.
Exposes:
  GET  /health              — Health check
  POST /api/parse-resume    — Upload and parse a resume file
"""

import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import ResumeInsights
from parser import extract_text_from_pdf, extract_text_from_docx
from gemini import analyze_resume

load_dotenv()

app = FastAPI(
    title="AI Resume Parser API",
    description="Parses PDF/DOCX resumes using Google Gemini to extract structured insights.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the React dev server (and production origin) to call the API
# ---------------------------------------------------------------------------
_DEFAULT_ORIGINS = [
    "http://localhost:5173",   # Vite default dev port
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# In production, set ALLOWED_ORIGINS env var to your frontend URL(s),
# comma-separated.  e.g.  "https://ai-resume-parser.vercel.app"
_extra = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = _DEFAULT_ORIGINS + [o.strip() for o in _extra.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

MAX_FILE_SIZE_MB = 10
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Health"])
async def health_check():
    """Simple health-check endpoint."""
    return {"status": "ok"}


@app.post(
    "/api/parse-resume",
    response_model=ResumeInsights,
    tags=["Resume"],
    summary="Upload and parse a resume file",
    description=(
        "Accepts a .pdf or .docx resume file, extracts its text, "
        "and returns AI-generated structured insights via Gemini."
    ),
)
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse an uploaded resume and return structured AI insights.

    - **file**: A .pdf or .docx resume file (max 10 MB)
    """

    # ---- Validate file extension ----
    filename = file.filename or ""
    ext = os.path.splitext(filename)[-1].lower()

    if ext not in (".pdf", ".docx"):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Please upload a .pdf or .docx file.",
        )

    # ---- Read file contents ----
    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {str(e)}")

    # ---- Validate file size ----
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds the {MAX_FILE_SIZE_MB} MB limit.",
        )

    # ---- Extract text ----
    try:
        if ext == ".pdf":
            resume_text = extract_text_from_pdf(file_bytes)
        else:  # .docx
            resume_text = extract_text_from_docx(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while parsing the file: {str(e)}",
        )

    # ---- Analyze with Gemini ----
    try:
        insights = analyze_resume(resume_text)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini API error: {str(e)}",
        )

    return insights

"""
gemini.py
---------
Handles all communication with the Google Gemini API.
Sends extracted resume text and returns structured insights as a ResumeInsights object.
"""

import os
import json
import re
import warnings
# Suppress FutureWarnings from google-generativeai / google.auth libraries
warnings.filterwarnings("ignore", category=FutureWarning)
import google.generativeai as genai  # noqa: E402
from dotenv import load_dotenv
from models import ResumeInsights

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. Please add it to your .env file."
    )

genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.0-flash"

SYSTEM_PROMPT = """You are an expert resume analyzer and career consultant. 
Your task is to analyze resume text and return structured insights in strict JSON format.
Always return ONLY valid JSON — no markdown, no code blocks, no extra text.
"""

ANALYSIS_PROMPT_TEMPLATE = """Analyze the following resume text and extract structured information.

Return ONLY a single valid JSON object with exactly this structure (no markdown, no extra text, no code fences):

{{
  "skills_and_technologies": ["skill1", "skill2", "..."],
  "work_experience_summary": [
    {{
      "company": "Company Name",
      "role": "Job Title",
      "duration": "e.g. Jan 2021 – Dec 2022",
      "key_contributions": ["contribution 1", "contribution 2"]
    }}
  ],
  "education": [
    {{
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University Name",
      "year": "2020"
    }}
  ],
  "candidate_strength_report": {{
    "overall_score": 75,
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "profile_summary": "A concise 2-3 sentence summary of the candidate's overall profile, key strengths, and career trajectory."
  }}
}}

Guidelines:
- overall_score must be an integer between 0 and 100, evaluated based on skills breadth, experience depth, education, and overall presentation
- Extract ALL skills, programming languages, frameworks, tools, and technologies mentioned
- Include ALL work experiences found, even if details are sparse
- Include ALL education entries found
- strengths should be 3-5 specific, concrete strengths
- profile_summary should be 2-4 sentences, professional tone

Resume Text:
---
{resume_text}
---

Return ONLY the JSON object:"""


def analyze_resume(text: str) -> ResumeInsights:
    """
    Send resume text to Gemini API and return structured ResumeInsights.

    Args:
        text: Extracted plain text from the resume.

    Returns:
        ResumeInsights Pydantic model with all parsed fields.

    Raises:
        ValueError: If Gemini returns unparseable or invalid JSON.
        Exception: For API connectivity or quota errors.
    """
    if not text or not text.strip():
        raise ValueError("Resume text is empty — cannot analyze an empty document.")

    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        system_instruction=SYSTEM_PROMPT,
    )

    prompt = ANALYSIS_PROMPT_TEMPLATE.format(resume_text=text[:12000])  # Truncate to stay within token limits

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.2,
                max_output_tokens=4096,
            ),
        )
    except Exception as e:
        raise Exception(f"Gemini API request failed: {str(e)}")

    raw_text = response.text.strip()

    # Strip any accidental markdown code fences
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.MULTILINE)
    raw_text = re.sub(r"\s*```$", "", raw_text, flags=re.MULTILINE)
    raw_text = raw_text.strip()

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError as e:
        # Try to extract JSON object from the response as a fallback
        json_match = re.search(r"\{.*\}", raw_text, re.DOTALL)
        if json_match:
            try:
                data = json.loads(json_match.group())
            except json.JSONDecodeError:
                raise ValueError(
                    f"Gemini returned invalid JSON that could not be parsed. "
                    f"Raw response (first 500 chars): {raw_text[:500]}"
                )
        else:
            raise ValueError(
                f"Gemini did not return a valid JSON object. "
                f"Raw response (first 500 chars): {raw_text[:500]}"
            )

    try:
        insights = ResumeInsights(**data)
    except Exception as e:
        raise ValueError(f"Gemini JSON does not match expected schema: {str(e)}")

    return insights

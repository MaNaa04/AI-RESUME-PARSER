from pydantic import BaseModel, Field
from typing import List, Optional


class WorkExperience(BaseModel):
    company: str = Field(default="", description="Company name")
    role: str = Field(default="", description="Job role/title")
    duration: str = Field(default="", description="Duration of employment")
    key_contributions: List[str] = Field(default_factory=list, description="Key contributions at the company")


class Education(BaseModel):
    degree: str = Field(default="", description="Degree obtained")
    institution: str = Field(default="", description="Name of the institution")
    year: str = Field(default="", description="Year of graduation")


class StrengthReport(BaseModel):
    overall_score: int = Field(default=0, ge=0, le=100, description="Overall candidate score out of 100")
    strengths: List[str] = Field(default_factory=list, description="List of candidate strengths")
    profile_summary: str = Field(default="", description="Summary paragraph of the candidate's profile")


class ResumeInsights(BaseModel):
    skills_and_technologies: List[str] = Field(
        default_factory=list,
        description="List of skills and technologies the candidate has"
    )
    work_experience_summary: List[WorkExperience] = Field(
        default_factory=list,
        description="Summarized work experience entries"
    )
    education: List[Education] = Field(
        default_factory=list,
        description="Education history of the candidate"
    )
    candidate_strength_report: StrengthReport = Field(
        default_factory=StrengthReport,
        description="Overall candidate strength evaluation"
    )

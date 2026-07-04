from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .models import RiskCategory, ProjectStatus

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    ai_app_url: Optional[str] = None
    ai_app_type: Optional[str] = None
    target_age_group: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    ai_app_url: Optional[str] = None
    ai_app_type: Optional[str] = None
    target_age_group: Optional[str] = None
    status: Optional[ProjectStatus] = None

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    ai_app_url: Optional[str] = None
    ai_app_type: Optional[str] = None
    target_age_group: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class TestCaseCreate(BaseModel):
    risk_category: RiskCategory
    question: str
    expected_response: Optional[str] = None
    severity: Optional[str] = "medium"

class TestCaseResponse(BaseModel):
    id: int
    project_id: int
    risk_category: str
    question: str
    expected_response: Optional[str] = None
    severity: str
    created_at: datetime

class EvaluationRequest(BaseModel):
    project_id: int
    test_case_ids: Optional[List[int]] = None

class EvaluationResultResponse(BaseModel):
    id: int
    project_id: int
    test_case_id: int
    ai_response: str
    score: float
    risk_level: str
    judge_reasoning: str
    created_at: datetime

class ReportResponse(BaseModel):
    id: int
    project_id: int
    title: str
    summary: str
    overall_score: float
    risk_summary: dict
    recommendations: str
    generated_at: datetime

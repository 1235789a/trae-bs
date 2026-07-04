from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON, Enum
from sqlalchemy.sql import func
from .database import Base
import enum

class RiskCategory(enum.Enum):
    IMPROPER_COMFORT = "错误安抚/不当心理建议"
    PRIVACY_LEAK = "隐私泄露/收集敏感信息"
    CRISIS_IGNORE = "忽略自伤/危机信号"
    EXCESSIVE_PROMISE = "过度承诺/承诺保密"
    INAPPROPRIATE_CONTENT = "不当内容"

class ProjectStatus(enum.Enum):
    DRAFT = "草稿"
    TESTING = "测试中"
    COMPLETED = "已完成"
    ARCHIVED = "已归档"

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    ai_app_url = Column(String)
    ai_app_type = Column(String)
    target_age_group = Column(String)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class TestCase(Base):
    __tablename__ = "test_cases"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    risk_category = Column(Enum(RiskCategory))
    question = Column(Text)
    expected_response = Column(Text)
    severity = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EvaluationResult(Base):
    __tablename__ = "evaluation_results"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    test_case_id = Column(Integer, ForeignKey("test_cases.id"))
    ai_response = Column(Text)
    score = Column(Float)
    risk_level = Column(String)
    judge_reasoning = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    title = Column(String)
    summary = Column(Text)
    overall_score = Column(Float)
    risk_summary = Column(JSON)
    recommendations = Column(Text)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

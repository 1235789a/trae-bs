from app.database import engine, Base
from app.models import Project, TestCase, EvaluationResult, Report

Base.metadata.create_all(bind=engine)
print("数据库初始化完成")

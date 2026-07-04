from sqlalchemy.orm import Session
from ..models import Project, TestCase, EvaluationResult, Report
from ..schemas import ProjectCreate, ProjectUpdate, TestCaseCreate

def get_projects(db: Session):
    return db.query(Project).order_by(Project.created_at.desc()).all()

def get_project(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()

def create_project(db: Session, project: ProjectCreate):
    db_project = Project(
        name=project.name,
        description=project.description,
        ai_app_url=project.ai_app_url,
        ai_app_type=project.ai_app_type,
        target_age_group=project.target_age_group
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: int, project: ProjectUpdate):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project is None:
        return None
    if project.name is not None:
        db_project.name = project.name
    if project.description is not None:
        db_project.description = project.description
    if project.ai_app_url is not None:
        db_project.ai_app_url = project.ai_app_url
    if project.ai_app_type is not None:
        db_project.ai_app_type = project.ai_app_type
    if project.target_age_group is not None:
        db_project.target_age_group = project.target_age_group
    if project.status is not None:
        db_project.status = project.status
    db.commit()
    db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project is None:
        return False
    db.delete(db_project)
    db.commit()
    return True

def get_test_cases(db: Session, project_id: int = None):
    query = db.query(TestCase)
    if project_id is not None:
        query = query.filter(TestCase.project_id == project_id)
    return query.order_by(TestCase.created_at.desc()).all()

def get_test_case(db: Session, test_case_id: int):
    return db.query(TestCase).filter(TestCase.id == test_case_id).first()

def create_test_case(db: Session, test_case: TestCaseCreate, project_id: int):
    db_test_case = TestCase(
        project_id=project_id,
        risk_category=test_case.risk_category,
        question=test_case.question,
        expected_response=test_case.expected_response,
        severity=test_case.severity
    )
    db.add(db_test_case)
    db.commit()
    db.refresh(db_test_case)
    return db_test_case

def create_test_cases_batch(db: Session, test_cases_data: list, project_id: int):
    db_test_cases = []
    for tc_data in test_cases_data:
        db_test_case = TestCase(
            project_id=project_id,
            risk_category=tc_data['risk_category'],
            question=tc_data['question'],
            expected_response=tc_data.get('expected_response'),
            severity=tc_data.get('severity', 'medium')
        )
        db_test_cases.append(db_test_case)
    db.add_all(db_test_cases)
    db.commit()
    return db_test_cases

def delete_test_case(db: Session, test_case_id: int):
    db_test_case = db.query(TestCase).filter(TestCase.id == test_case_id).first()
    if db_test_case is None:
        return False
    db.delete(db_test_case)
    db.commit()
    return True

def get_evaluation_results(db: Session, project_id: int = None):
    query = db.query(EvaluationResult)
    if project_id is not None:
        query = query.filter(EvaluationResult.project_id == project_id)
    return query.order_by(EvaluationResult.created_at.desc()).all()

def get_evaluation_result(db: Session, evaluation_id: int):
    return db.query(EvaluationResult).filter(EvaluationResult.id == evaluation_id).first()

def create_evaluation_result(db: Session, project_id: int, test_case_id: int, ai_response: str, score: float, risk_level: str, judge_reasoning: str):
    db_result = EvaluationResult(
        project_id=project_id,
        test_case_id=test_case_id,
        ai_response=ai_response,
        score=score,
        risk_level=risk_level,
        judge_reasoning=judge_reasoning
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def delete_evaluation_result(db: Session, evaluation_id: int):
    db_result = db.query(EvaluationResult).filter(EvaluationResult.id == evaluation_id).first()
    if db_result is None:
        return False
    db.delete(db_result)
    db.commit()
    return True

def get_reports(db: Session, project_id: int = None):
    query = db.query(Report)
    if project_id is not None:
        query = query.filter(Report.project_id == project_id)
    return query.order_by(Report.generated_at.desc()).all()

def get_report(db: Session, report_id: int):
    return db.query(Report).filter(Report.id == report_id).first()

def create_report(db: Session, project_id: int, title: str, summary: str, overall_score: float, risk_summary: dict, recommendations: str):
    db_report = Report(
        project_id=project_id,
        title=title,
        summary=summary,
        overall_score=overall_score,
        risk_summary=risk_summary,
        recommendations=recommendations
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def delete_report(db: Session, report_id: int):
    db_report = db.query(Report).filter(Report.id == report_id).first()
    if db_report is None:
        return False
    db.delete(db_report)
    db.commit()
    return True

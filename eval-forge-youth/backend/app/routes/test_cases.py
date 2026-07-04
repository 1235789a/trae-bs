from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud
from ..schemas import TestCaseCreate, TestCaseResponse
from ..database import get_db
from ..services.test_case_generator import generate_test_cases_for_project

router = APIRouter()

@router.get("/", response_model=list[TestCaseResponse])
def get_test_cases(project_id: int = None, db: Session = Depends(get_db)):
    return crud.get_test_cases(db, project_id)

@router.get("/{test_case_id}", response_model=TestCaseResponse)
def get_test_case(test_case_id: int, db: Session = Depends(get_db)):
    tc = crud.get_test_case(db, test_case_id)
    if tc is None:
        raise HTTPException(status_code=404, detail="测试用例不存在")
    return tc

@router.post("/", response_model=TestCaseResponse)
def create_test_case(test_case: TestCaseCreate, project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="项目不存在")
    return crud.create_test_case(db, test_case, project_id)

@router.post("/generate/{project_id}")
def generate_test_cases(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="项目不存在")
    return generate_test_cases_for_project(db, project_id)

@router.delete("/{test_case_id}")
def delete_test_case(test_case_id: int, db: Session = Depends(get_db)):
    success = crud.delete_test_case(db, test_case_id)
    if not success:
        raise HTTPException(status_code=404, detail="测试用例不存在")
    return {"message": "测试用例已删除"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud
from ..schemas import EvaluationRequest, EvaluationResultResponse
from ..database import get_db
from ..services.evaluation_engine import run_evaluation

router = APIRouter()

@router.get("/", response_model=list[EvaluationResultResponse])
def get_evaluation_results(project_id: int = None, db: Session = Depends(get_db)):
    return crud.get_evaluation_results(db, project_id)

@router.post("/run")
def run_project_evaluation(request: EvaluationRequest, db: Session = Depends(get_db)):
    project = crud.get_project(db, request.project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="项目不存在")
    return run_evaluation(db, request.project_id, request.test_case_ids)

@router.get("/{evaluation_id}", response_model=EvaluationResultResponse)
def get_evaluation_result(evaluation_id: int, db: Session = Depends(get_db)):
    result = crud.get_evaluation_result(db, evaluation_id)
    if result is None:
        raise HTTPException(status_code=404, detail="测评结果不存在")
    return result

@router.delete("/{evaluation_id}")
def delete_evaluation_result(evaluation_id: int, db: Session = Depends(get_db)):
    success = crud.delete_evaluation_result(db, evaluation_id)
    if not success:
        raise HTTPException(status_code=404, detail="测评结果不存在")
    return {"message": "测评结果已删除"}

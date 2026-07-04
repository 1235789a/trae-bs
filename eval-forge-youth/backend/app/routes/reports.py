from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from . import crud
from ..schemas import ReportResponse
from ..database import get_db
from ..services.report_generator import generate_report, generate_pdf_report
import os

router = APIRouter()

@router.get("/", response_model=list[ReportResponse])
def get_reports(project_id: int = None, db: Session = Depends(get_db)):
    return crud.get_reports(db, project_id)

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = crud.get_report(db, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="报告不存在")
    return report

@router.post("/generate/{project_id}", response_model=ReportResponse)
def generate_project_report(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="项目不存在")
    return generate_report(db, project_id)

@router.get("/export/{project_id}")
def export_report(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="项目不存在")
    pdf_path = generate_pdf_report(db, project_id)
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=500, detail="报告生成失败")
    return FileResponse(pdf_path, media_type="application/pdf", filename=f"report_{project_id}.pdf")

@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    success = crud.delete_report(db, report_id)
    if not success:
        raise HTTPException(status_code=404, detail="报告不存在")
    return {"message": "报告已删除"}

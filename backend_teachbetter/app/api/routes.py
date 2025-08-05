from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Optional
from fastapi.responses import FileResponse
from app.grading.processor import process_bulk_grading
from app.downloads.download_utils import zip_reports, get_file_response
from app.reports.summary_export import export_summary_to_csv
import os
import json

router = APIRouter()

@router.post("/grade/")
async def grade_assignments(
    answer_sheets: List[UploadFile] = File(...),
    answer_key: UploadFile = File(...),
    grading_level: str = Form(...),
    grading_context: Optional[str] = Form(None),
    report_details: Optional[str] = Form(None),
    output_format: str = Form("pdf")
):
    """
    Handles grading requests.
    """
    result = await process_bulk_grading(
        answer_sheets=answer_sheets,
        answer_key_file=answer_key,
        grading_level=grading_level,
        context=grading_context,
        report_meta=report_details,
        output_format=output_format
    )
    return result


@router.get("/download/report/{student_id}")
def download_individual_report(student_id: str):
    """
    Download a single student report by student_id (e.g., 'John_123')
    """
    pdf_path = f"reports/{student_id}.pdf"
    docx_path = f"reports/{student_id}.docx"

    if os.path.exists(pdf_path):
        return get_file_response(pdf_path)
    elif os.path.exists(docx_path):
        return get_file_response(docx_path)
    else:
        return {"error": f"No report found for {student_id}"}


@router.get("/download/all-reports")
def download_all_reports():
    """
    Download all student reports in a single ZIP file.
    """
    zip_path = zip_reports("reports")
    return get_file_response(zip_path)


@router.get("/download/summary")
def download_summary():
    """
    Download grading summary table as CSV.
    """
    summary_path = "latest_summary.json"

    if not os.path.exists(summary_path):
        return {"error": "No grading results available. Please grade submissions first."}

    with open(summary_path, "r", encoding="utf-8") as f:
        results = json.load(f)

    csv_path = export_summary_to_csv(results)
    return get_file_response(csv_path)

from fastapi import APIRouter, UploadFile, File, Form
from typing import List, Optional, Tuple
from fastapi.responses import StreamingResponse
from app.grading.processor import process_bulk_grading
from app.downloads.download_utils import zip_reports, get_file_response
from app.reports.summary_export import export_summary_to_csv
import os
import json
import io
import shutil

router = APIRouter()

# This will act as a simple in-memory cache for the latest results
latest_results_cache = []

@router.post("/stream-grade/")
async def stream_grade(
    answer_sheets: List[UploadFile] = File(...),
    answer_key: UploadFile = File(...),
    grading_level: str = Form(...),
    grading_context: Optional[str] = Form(None),
    report_details: Optional[str] = Form(None),
    output_format: str = Form("pdf")
):
    global latest_results_cache
    # Clean up old reports before starting a new batch
    if os.path.exists("reports"):
        shutil.rmtree("reports")
    os.makedirs("reports", exist_ok=True)
    
    all_streamed_results = []
    
    answer_key_bytes = await answer_key.read()
    answer_key_filename = answer_key.filename

    in_memory_sheets: List[Tuple[str, bytes]] = []
    for sheet in answer_sheets:
        in_memory_sheets.append((sheet.filename, await sheet.read()))

    async def grade_stream_and_finalize():
        for sheet_filename, sheet_bytes in in_memory_sheets:
            new_answer_key = UploadFile(filename=answer_key_filename, file=io.BytesIO(answer_key_bytes))
            new_sheet = UploadFile(filename=sheet_filename, file=io.BytesIO(sheet_bytes))

            result = await process_bulk_grading(
                answer_sheets=[new_sheet],
                answer_key_file=new_answer_key,
                grading_level=grading_level,
                context=grading_context,
                report_meta=report_details,
                output_format=output_format
            )

            if result and "results" in result and len(result["results"]) > 0:
                student_result = result["results"][0]
                all_streamed_results.append(student_result)
                yield json.dumps(student_result) + "\n"
        
        print("✅ Stream finished. Saving final summary files...")
        if all_streamed_results:
            export_summary_to_csv(all_streamed_results)
            with open("latest_summary.json", "w", encoding="utf-8") as f:
                json.dump(all_streamed_results, f, indent=2)
            
            latest_results_cache.clear()
            latest_results_cache.extend(all_streamed_results)
            print(f"✅ Saved summaries for {len(all_streamed_results)} students.")

    return StreamingResponse(grade_stream_and_finalize(), media_type="application/x-ndjson")

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
    Handles non-streaming grading requests. The final URL will be /api/grade/.
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

# --- ADDED MISSING ENDPOINTS ---

@router.get("/download/report/{student_id}")
def download_individual_report(student_id: str):
    """
    Download a single student report. Final URL: /api/download/report/{student_id}
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
    Download all student reports in a single ZIP file. Final URL: /api/download/all-reports
    """
    zip_path = zip_reports("reports")
    return get_file_response(zip_path)


@router.get("/download/summary")
def download_summary():
    """
    Download grading summary table as CSV. Final URL: /api/download/summary
    """
    summary_path = "latest_summary.json"
    if not os.path.exists(summary_path):
        return {"error": "No grading results available. Please grade submissions first."}

    with open(summary_path, "r", encoding="utf-8") as f:
        results = json.load(f)

    csv_path = export_summary_to_csv(results)
    return get_file_response(csv_path)

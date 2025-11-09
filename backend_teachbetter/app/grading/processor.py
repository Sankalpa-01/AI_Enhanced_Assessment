import os
import shutil
import json
# The base64 module is no longer needed here
# import base64 
from uuid import uuid4
from tempfile import TemporaryDirectory
from app.grading import ai_grader, universal_processor
from app.reports.report_generator import generate_reports

async def process_bulk_grading(
    answer_sheets,
    answer_key_file,
    grading_level,
    context,
    report_meta,
    output_format
):
    results = []

    with TemporaryDirectory() as temp_dir:
        answer_key_path = os.path.join(temp_dir, answer_key_file.filename)
        with open(answer_key_path, "wb") as f:
            await answer_key_file.seek(0)
            f.write(await answer_key_file.read())

        answer_key_text = universal_processor.extract_text_from_file(answer_key_path)
        if not answer_key_text:
            return {"error": "Failed to extract text from answer key."}

        for student_file in answer_sheets:
            student_path = os.path.join(temp_dir, student_file.filename)
            with open(student_path, "wb") as f:
                await student_file.seek(0)
                f.write(await student_file.read())

            print(f"\n📄 Processing {student_file.filename}...")

            student_text = universal_processor.extract_text_from_file(student_path)
            if not student_text:
                print(f"⚠️ Skipping file: Failed to extract student text from {student_file.filename}.")
                continue

            student_info = universal_processor.get_student_info(student_text)
            student_name = student_info.get("name", "Unknown")
            roll_no = student_info.get("roll_no", "Unknown")
            student_id = f"{student_name.replace(' ', '_')}_{roll_no}"

            grading_result = ai_grader.get_ai_grading(
                student_text,
                answer_key_text,
                context or f"Evaluate the submission. Grading level: {grading_level}."
            )
            
            if not isinstance(grading_result, dict):
                print(f"❌ AI response was not a dictionary for {student_file.filename}. Skipping.")
                continue

            breakdown = grading_result.get("detailed_breakdown", [])
            if not isinstance(breakdown, list):
                breakdown = []

            final_result_data = {
                "evaluation_summary": grading_result.get("evaluation_summary", "Not provided."),
                "strengths": grading_result.get("strengths", "Not provided."),
                "areas_for_improvement": grading_result.get("areas_for_improvement", "Not provided."),
                "detailed_breakdown": breakdown,
                "overall_score": grading_result.get("overall_score", 0),
                "total_questions": 50
            }

            # Generate the report and save it to disk. We no longer need the bytes back.
            report_path, _ = generate_reports(
                result=final_result_data,
                student_info=student_info,
                report_meta=report_meta,
                format=output_format,
                student_id=student_id,
                return_bytes=True # Keep this True to ensure file is saved to disk
            )

            # The result no longer needs to include the Base64 data
            results.append({
                "student_id": student_id,
                "student_name": student_name,
                "roll_number": roll_no,
                "marks": final_result_data["overall_score"],
                "report_path": report_path,
                # "pdf_base64": pdf_base64_string # This is removed
            })

    return {"results": results}

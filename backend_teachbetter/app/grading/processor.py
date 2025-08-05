import os
import shutil
import json
from uuid import uuid4
from tempfile import TemporaryDirectory
from app.grading import ai_grader, universal_processor
from app.reports.report_generator import generate_reports
from app.reports.summary_export import export_summary_to_csv

latest_results = []  # Stores last grading results (used in download endpoints)

async def process_bulk_grading(
    answer_sheets,
    answer_key_file,
    grading_level,
    context,
    report_meta,
    output_format
):
    global latest_results
    results = []

    if os.path.exists("reports"):
        shutil.rmtree("reports")
    os.makedirs("reports", exist_ok=True)

    # Save files to a temporary directory for processing
    with TemporaryDirectory() as temp_dir:
        # Save answer key
        answer_key_path = os.path.join(temp_dir, answer_key_file.filename)
        with open(answer_key_path, "wb") as f:
            f.write(await answer_key_file.read())

        # Extract answer key text
        answer_key_text = universal_processor.extract_text_from_file(answer_key_path)
        if not answer_key_text:
            return {"error": "Failed to extract text from answer key."}

        # Process each student file
        for student_file in answer_sheets:
            student_path = os.path.join(temp_dir, student_file.filename)
            with open(student_path, "wb") as f:
                f.write(await student_file.read())

            print(f"\n📄 Processing {student_file.filename}...")

            # 1. Extract student's answer text
            student_text = universal_processor.extract_text_from_file(student_path)
            if not student_text:
                print("⚠️ Skipping file: Failed to extract student text.")
                continue

            # 2. Extract student metadata
            student_info = universal_processor.get_student_info(student_text)
            student_name = student_info.get("name", "Unknown")
            roll_no = student_info.get("roll_no", "Unknown")
            student_id = f"{student_name}_{roll_no}".replace(" ", "_")

            # 3. Call AI model for grading
            grading_result = ai_grader.get_ai_grading(
                student_text,
                answer_key_text,
                context or f"Evaluate the following submission using the given answer key. Grading level: {grading_level}."
            )

            if not grading_result:
                print(f"❌ AI grading failed for {student_file.filename}")
                continue

            breakdown = grading_result.get("detailed_breakdown", [])
            grading_result["overall_score"] = sum(1 for q in breakdown if q["is_correct"])
            grading_result["total_questions"] = len(breakdown)

            # 4. Generate and save student report
            report_path = generate_reports(
                result=grading_result,
                student_info=student_info,
                report_meta=report_meta,
                format=output_format,
                student_id=student_id
            )

            # 5. Append result
            results.append({
                "student_id": student_id,
                "student_name": student_name,
                "roll_number": roll_no,
                "marks": grading_result.get("overall_score"),
                "report_path": report_path
            })

    # Save CSV summary
    export_summary_to_csv(results)

    with open("latest_summary.json", "w", encoding="utf-8") as f:json.dump(results, f, indent=2)

    # Store for downloading summary/report later
    latest_results = results

    return {"results": results}

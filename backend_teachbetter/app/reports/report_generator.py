# import os
# import json
# from reportlab.lib.pagesizes import letter
# from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
# from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
# from reportlab.lib import colors

# def generate_reports(result: dict, student_info: dict, report_meta: str, format: str, student_id: str) -> str:
#     os.makedirs("reports", exist_ok=True)

#     ext = "pdf" if format.lower() in ("pdf", "word") else "json"
#     filename = f"{student_id}.{ext}"
#     file_path = os.path.join("reports", filename)

#     if ext == "json":
#         report_data = {
#             "student_name": student_info.get("name", "Unknown"),
#             "roll_number": student_info.get("roll_no", "Unknown"),
#             "report_meta": report_meta,
#             "grading": result
#         }
#         with open(file_path, "w", encoding="utf-8") as f:
#             json.dump(report_data, f, indent=2)
#         return file_path

#     # === PDF Generation using Platypus ===
#     doc = SimpleDocTemplate(file_path, pagesize=letter)
#     styles = getSampleStyleSheet()
#     custom = ParagraphStyle(name="Custom", fontSize=11, leading=16)
#     table_cell = ParagraphStyle(name="TableCell", fontSize=9, leading=12)
#     elements = []

#     # Title
#     elements.append(Paragraph(f"<b>📘 Student Report: {student_info.get('name', 'Unknown')}</b>", styles["Title"]))
#     elements.append(Spacer(1, 12))

#     # Info
#     elements.append(Paragraph(f"<b>Roll Number:</b> {student_info.get('roll_no', 'Unknown')}", custom))
#     elements.append(Paragraph(f"<b>Meta Info:</b> {report_meta or 'N/A'}", custom))
#     elements.append(Spacer(1, 10))

#     # Summary
#     elements.append(Paragraph(f"<b>Evaluation Summary:</b> {result.get('evaluation_summary')}", custom))
#     elements.append(Paragraph(f"<b>Score:</b> {result.get('overall_score')} / {result.get('total_questions')}", custom))
#     elements.append(Paragraph(f"<b>Strengths:</b> {result.get('strengths')}", custom))
#     elements.append(Paragraph(f"<b>Areas for Improvement:</b> {result.get('areas_for_improvement')}", custom))
#     elements.append(Spacer(1, 16))

#     # Breakdown Table with wrapped cells
#     breakdown_data = [[
#         Paragraph("<b>Q#</b>", table_cell),
#         Paragraph("<b>Student Answer</b>", table_cell),
#         Paragraph("<b>Correct Answer</b>", table_cell),
#         Paragraph("<b>Correct?</b>", table_cell)
#     ]]

#     for q in result.get("detailed_breakdown", []):
#         breakdown_data.append([
#             Paragraph(f"Q{q['question_number']}", table_cell),
#             Paragraph(q["student_answer"], table_cell),
#             Paragraph(q["correct_answer"], table_cell),
#             Paragraph("✓" if q["is_correct"] else "✗", table_cell),
#         ])

#     table = Table(breakdown_data, colWidths=[40, 170, 170, 50], repeatRows=1, hAlign='LEFT')
#     table.setStyle(TableStyle([
#         ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1f77b4")),
#         ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
#         ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
#         ('FONTSIZE', (0, 0), (-1, -1), 9),
#         ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
#         ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
#         ('VALIGN', (0, 0), (-1, -1), 'TOP'),
#     ]))
#     elements.append(table)

#     doc.build(elements)
#     return file_path


# import os
# import json
# import logging
# from reportlab.lib.pagesizes import letter
# from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
# from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
# from reportlab.lib import colors
# from html import escape

# # --- It's a good practice to set up a logger ---
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# def to_str(value, placeholder="N/A"):
#     """
#     Safely converts a value to a string, escaping HTML characters.
#     Handles None, numbers, and other types.
#     """
#     if value is None:
#         return placeholder
#     # Escape special HTML characters to prevent reportlab from crashing
#     return escape(str(value))

# def generate_reports(result: dict, student_info: dict, report_meta: str, format: str, student_id: str) -> str:
#     os.makedirs("reports", exist_ok=True)

#     ext = "pdf" if format.lower() in ("pdf", "word") else "json"
#     filename = f"{student_id}.{ext}"
#     file_path = os.path.join("reports", filename)

#     if ext == "json":
#         # ... (your JSON logic is fine, no changes needed)
#         report_data = {
#             "student_name": student_info.get("name", "Unknown"),
#             "roll_number": student_info.get("roll_no", "Unknown"),
#             "report_meta": report_meta,
#             "grading": result
#         }
#         with open(file_path, "w", encoding="utf-8") as f:
#             json.dump(report_data, f, indent=2)
#         return file_path

#     # === PDF Generation with Error Handling and Sanitization ===
#     try:
#         doc = SimpleDocTemplate(file_path, pagesize=letter)
#         styles = getSampleStyleSheet()
#         custom = ParagraphStyle(name="Custom", fontSize=11, leading=16)
#         table_cell = ParagraphStyle(name="TableCell", fontSize=9, leading=12)
#         elements = []

#         # --- Sanitize all data before creating Paragraphs ---
#         student_name = to_str(student_info.get('name', 'Unknown'))
#         roll_no = to_str(student_info.get('roll_no', 'Unknown'))
#         meta_info = to_str(report_meta)
#         eval_summary = to_str(result.get('evaluation_summary'))
#         score = to_str(result.get('overall_score'))
#         total_q = to_str(result.get('total_questions'))
#         strengths = to_str(result.get('strengths'))
#         improvement_areas = to_str(result.get('areas_for_improvement'))

#         # Title
#         elements.append(Paragraph(f"<b>📘 Student Report: {student_name}</b>", styles["Title"]))
#         elements.append(Spacer(1, 12))

#         # Info
#         elements.append(Paragraph(f"<b>Roll Number:</b> {roll_no}", custom))
#         elements.append(Paragraph(f"<b>Meta Info:</b> {meta_info}", custom))
#         elements.append(Spacer(1, 10))

#         # Summary
#         elements.append(Paragraph(f"<b>Evaluation Summary:</b> {eval_summary}", custom))
#         elements.append(Paragraph(f"<b>Score:</b> {score} / {total_q}", custom))
#         elements.append(Paragraph(f"<b>Strengths:</b> {strengths}", custom))
#         elements.append(Paragraph(f"<b>Areas for Improvement:</b> {improvement_areas}", custom))
#         elements.append(Spacer(1, 16))

#         # Breakdown Table
#         breakdown_data = [[
#             Paragraph("<b>Q#</b>", table_cell),
#             Paragraph("<b>Student Answer</b>", table_cell),
#             Paragraph("<b>Correct Answer</b>", table_cell),
#             Paragraph("<b>Correct?</b>", table_cell)
#         ]]

#         for q in result.get("detailed_breakdown", []):
#             breakdown_data.append([
#                 Paragraph(to_str(q.get('question_number'), 'Q?'), table_cell),
#                 Paragraph(to_str(q.get('student_answer')), table_cell),
#                 Paragraph(to_str(q.get('correct_answer')), table_cell),
#                 Paragraph("✓" if q.get("is_correct") else "✗", table_cell),
#             ])

#         table = Table(breakdown_data, colWidths=[40, 170, 170, 50], repeatRows=1, hAlign='LEFT')
#         table.setStyle(TableStyle([
#             ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1f77b4")),
#             ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
#             ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
#             ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
#             ('VALIGN', (0, 0), (-1, -1), 'TOP'),
#         ]))
#         elements.append(table)

#         # Build the document
#         doc.build(elements)
#         logging.info(f"Successfully generated report: {file_path}")

#     except Exception as e:
#         # --- Catch any error from reportlab and log it ---
#         logging.error(f"Failed to generate PDF for student_id: {student_id}")
#         logging.error(f"Error: {e}")
#         # Optionally, create a simple text file with the error
#         with open(f"{file_path}.error.txt", "w") as f:
#             f.write(f"An error occurred while generating the PDF report for {student_id}.\n")
#             f.write(f"Error details: {e}\n")
#         # Return the path to the error file or raise the exception
#         # For now, we'll just log it and return the original (likely empty) path
#         return file_path

#     return file_path

# report_generator.py

import os
import json
import logging
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from html import escape
from io import BytesIO

# --- It's a good practice to set up a logger ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def to_str(value, placeholder="N/A"):
    """
    Safely converts a value to a string, escaping special XML/HTML characters.
    This is crucial for preventing reportlab from crashing on invalid characters.
    """
    if value is None:
        return placeholder
    # Convert to string and escape special characters that can break ReportLab's XML parser
    return escape(str(value))

def generate_reports(result: dict, student_info: dict, report_meta: str, format: str, student_id: str, return_bytes: bool = False) -> tuple[str, bytes | None]:
    """
    Generates a report file and optionally returns its content as bytes.
    Returns a tuple: (file_path, pdf_bytes). pdf_bytes will be None if return_bytes is False.
    """
    os.makedirs("reports", exist_ok=True)

    ext = "pdf" if format.lower() in ("pdf", "word") else "json"
    filename = f"{student_id}.{ext}"
    file_path = os.path.join("reports", filename)

    if ext == "json":
        report_data = {
            "student_name": student_info.get("name", "Unknown"),
            "roll_number": student_info.get("roll_no", "Unknown"),
            "report_meta": report_meta,
            "grading": result
        }
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=2)
        return file_path, None

    # === PDF Generation with Error Handling and Sanitization ===
    pdf_bytes = None
    output_destination = BytesIO() if return_bytes else file_path
    
    try:
        doc = SimpleDocTemplate(output_destination, pagesize=letter)
        styles = getSampleStyleSheet()
        # Define custom styles for better control
        title_style = styles["Title"]
        custom_style = ParagraphStyle(name="Custom", fontSize=11, leading=16)
        table_cell_style = ParagraphStyle(name="TableCell", fontSize=9, leading=12)
        
        elements = []

        # --- Sanitize all data before creating Paragraphs ---
        student_name = to_str(student_info.get('name', 'Unknown'))
        roll_no = to_str(student_info.get('roll_no', 'Unknown'))
        meta_info = to_str(report_meta)
        
        eval_summary = to_str(result.get('evaluation_summary'))
        score = to_str(result.get('overall_score'))
        total_score = to_str(result.get('total_questions')) # This is now 50
        strengths = to_str(result.get('strengths'))
        improvement_areas = to_str(result.get('areas_for_improvement'))

        # Title and Info
        elements.append(Paragraph(f"<b>Student Report: {student_name}</b>", title_style))
        elements.append(Spacer(1, 12))
        elements.append(Paragraph(f"<b>Roll Number:</b> {roll_no}", custom_style))
        elements.append(Paragraph(f"<b>Meta Info:</b> {meta_info}", custom_style))
        elements.append(Spacer(1, 10))

        # Summary
        elements.append(Paragraph(f"<b>Evaluation Summary:</b> {eval_summary}", custom_style))
        elements.append(Paragraph(f"<b>Score:</b> {score} / {total_score}", custom_style))
        elements.append(Paragraph(f"<b>Strengths:</b> {strengths}", custom_style))
        elements.append(Paragraph(f"<b>Areas for Improvement:</b> {improvement_areas}", custom_style))
        elements.append(Spacer(1, 16))

        # Breakdown Table
        table_header = [
            Paragraph("<b>Q#</b>", table_cell_style),
            Paragraph("<b>Student Answer</b>", table_cell_style),
            Paragraph("<b>Correct Answer</b>", table_cell_style),
            Paragraph("<b>Correct?</b>", table_cell_style)
        ]
        breakdown_data = [table_header]

        for q in result.get("detailed_breakdown", []):
            # Ensure every cell in the table is also sanitized
            row = [
                Paragraph(to_str(q.get('question_number'), 'Q?'), table_cell_style),
                Paragraph(to_str(q.get('student_answer')), table_cell_style),
                Paragraph(to_str(q.get('correct_answer')), table_cell_style),
                Paragraph("✓" if q.get("is_correct") else "✗", table_cell_style),
            ]
            breakdown_data.append(row)

        table = Table(breakdown_data, colWidths=[40, 170, 170, 50], repeatRows=1, hAlign='LEFT')
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1f77b4")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        elements.append(table)

        # Build the document
        doc.build(elements)
        logging.info(f"Successfully generated and built report elements for: {file_path}")

        if return_bytes:
            pdf_bytes = output_destination.getvalue()
            with open(file_path, "wb") as f:
                f.write(pdf_bytes)
            logging.info(f"Saved a copy to disk: {file_path}")

    except Exception as e:
        # --- Catch any error from reportlab and log it with details ---
        logging.error(f"CRITICAL: Failed to build PDF for student_id: {student_id}", exc_info=True)
        # Create a simple text file with the error
        with open(f"{file_path}.error.txt", "w") as f:
            f.write(f"An error occurred while generating the PDF report for {student_id}.\n")
            f.write(f"Error details: {e}\n")
        return file_path, None

    return file_path, pdf_bytes
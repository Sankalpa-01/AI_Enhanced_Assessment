import os
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_reports(result: dict, student_info: dict, report_meta: str, format: str, student_id: str) -> str:
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
        return file_path

    # === PDF Generation using Platypus ===
    doc = SimpleDocTemplate(file_path, pagesize=letter)
    styles = getSampleStyleSheet()
    custom = ParagraphStyle(name="Custom", fontSize=11, leading=16)
    table_cell = ParagraphStyle(name="TableCell", fontSize=9, leading=12)
    elements = []

    # Title
    elements.append(Paragraph(f"<b>📘 Student Report: {student_info.get('name', 'Unknown')}</b>", styles["Title"]))
    elements.append(Spacer(1, 12))

    # Info
    elements.append(Paragraph(f"<b>Roll Number:</b> {student_info.get('roll_no', 'Unknown')}", custom))
    elements.append(Paragraph(f"<b>Meta Info:</b> {report_meta or 'N/A'}", custom))
    elements.append(Spacer(1, 10))

    # Summary
    elements.append(Paragraph(f"<b>Evaluation Summary:</b> {result.get('evaluation_summary')}", custom))
    elements.append(Paragraph(f"<b>Score:</b> {result.get('overall_score')} / {result.get('total_questions')}", custom))
    elements.append(Paragraph(f"<b>Strengths:</b> {result.get('strengths')}", custom))
    elements.append(Paragraph(f"<b>Areas for Improvement:</b> {result.get('areas_for_improvement')}", custom))
    elements.append(Spacer(1, 16))

    # Breakdown Table with wrapped cells
    breakdown_data = [[
        Paragraph("<b>Q#</b>", table_cell),
        Paragraph("<b>Student Answer</b>", table_cell),
        Paragraph("<b>Correct Answer</b>", table_cell),
        Paragraph("<b>Correct?</b>", table_cell)
    ]]

    for q in result.get("detailed_breakdown", []):
        breakdown_data.append([
            Paragraph(f"Q{q['question_number']}", table_cell),
            Paragraph(q["student_answer"], table_cell),
            Paragraph(q["correct_answer"], table_cell),
            Paragraph("✓" if q["is_correct"] else "✗", table_cell),
        ])

    table = Table(breakdown_data, colWidths=[40, 170, 170, 50], repeatRows=1, hAlign='LEFT')
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1f77b4")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(table)

    doc.build(elements)
    return file_path

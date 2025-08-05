import csv
import os

def export_summary_to_csv(results: list, filename: str = "reports/summary_table.csv") -> str:
    """
    Exports a summary of grading results as a CSV file.
    """
    os.makedirs("reports", exist_ok=True)

    # Define CSV column headers
    keys = ["student_id", "student_name", "roll_number", "marks", "report_path"]

    with open(filename, mode="w", newline='', encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        for row in results:
            writer.writerow({key: row.get(key, "") for key in keys})

    return filename

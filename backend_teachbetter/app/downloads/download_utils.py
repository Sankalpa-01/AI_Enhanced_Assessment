import os
import zipfile
from fastapi.responses import FileResponse

def zip_reports(report_folder: str = "reports") -> str:
    """
    Zips all report files in the given folder and returns the zip file path.
    """
    zip_path = os.path.join(report_folder, "all_student_reports.zip")

    # Remove existing zip if any
    if os.path.exists(zip_path):
        os.remove(zip_path)

    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for root, _, files in os.walk(report_folder):
            for file in files:
                if file.endswith((".pdf", ".docx", ".txt")):
                    full_path = os.path.join(root, file)
                    arcname = os.path.basename(file)
                    zipf.write(full_path, arcname=arcname)

    return zip_path


def get_file_response(file_path: str) -> FileResponse:
    """
    Returns a FastAPI FileResponse for the given file.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    filename = os.path.basename(file_path)
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )

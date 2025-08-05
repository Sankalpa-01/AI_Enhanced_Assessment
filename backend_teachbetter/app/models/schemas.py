from pydantic import BaseModel
from typing import List, Optional


class StudentReport(BaseModel):
    student_id: str
    student_name: str
    roll_number: str
    marks: int
    report_path: str


class GradingResponse(BaseModel):
    results: List[StudentReport]


class ErrorResponse(BaseModel):
    error: str


class DownloadLink(BaseModel):
    url: str
    filename: str

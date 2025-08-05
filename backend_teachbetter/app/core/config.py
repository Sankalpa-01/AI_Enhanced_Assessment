import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "TeachBetter AI Grader"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Paths
    REPORT_FOLDER: str = "reports"
    TESSERACT_PATH: str = os.getenv("TESSERACT_PATH", r"C:\Users\sanka\Downloads\tesseract-ocr-w64-setup-5.5.0.20241111.exe")

    # Output format fallback
    DEFAULT_OUTPUT_FORMAT: str = "pdf"

settings = Settings()

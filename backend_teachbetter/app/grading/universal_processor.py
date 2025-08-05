# universal_processor.py
# This module intelligently handles various file types (.docx, .png, .jpg, etc.)

import os
import re
import cv2
import pytesseract
import numpy as np
from PIL import Image
import docx # The python-docx library

# --- OCR Configuration ---
# This line tells the script exactly where to find the tesseract.exe file.
# Make sure this path matches where you installed Tesseract.
TESSERACT_PATH = r'C:\Users\sanka\Downloads\tesseract-ocr-w64-setup-5.5.0.20241111.exe'
if os.path.exists(TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH
else:
    print(f"Warning: Tesseract executable not found at '{TESSERACT_PATH}'. OCR will fail.")


# --- Private Helper Functions ---

def _extract_text_from_image(file_path):
    """Internal function to handle image files using OCR."""
    try:
        with open(file_path, "rb") as f:
            image_bytes = f.read()
        
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return None # Failed to decode image
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        binary_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(Image.fromarray(binary_img), config=custom_config)
        return text
    except Exception as e:
        print(f"An error occurred during OCR processing for {os.path.basename(file_path)}: {e}")
        return None

def _extract_text_from_docx(file_path):
    """Internal function to handle .docx files."""
    try:
        document = docx.Document(file_path)
        full_text = [para.text for para in document.paragraphs]
        return '\n'.join(full_text)
    except Exception as e:
        print(f"An error occurred while reading {os.path.basename(file_path)}: {e}")
        return None

# --- Public Functions ---

def extract_text_from_file(file_path):
    """
    Public function that determines the file type and calls the correct processor.
    """
    if not os.path.exists(file_path):
        print(f"Error: The file '{file_path}' was not found.")
        return None
        
    # Get the file extension and convert to lowercase
    file_extension = os.path.splitext(file_path)[1].lower()
    
    print(f"Processing '{os.path.basename(file_path)}' as type: {file_extension}")

    if file_extension == '.docx':
        return _extract_text_from_docx(file_path)
    elif file_extension in ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']:
        return _extract_text_from_image(file_path)
    else:
        print(f"Unsupported file type: '{file_extension}'. Cannot process.")
        return None

def get_student_info(raw_text):
    """
    Extracts student's name and roll number from raw text.
    """
    if not raw_text:
        return {"name": "Not Found", "roll_no": "Not Found"}

    info = {"name": "Not Found", "roll_no": "Not Found"}
    
    name_match = re.search(r'(?i)Name\s*:\s*(.*)', raw_text)
    if name_match:
        info["name"] = name_match.group(1).strip()

    roll_no_match = re.search(r'(?i)Roll\s*(?:No|Number)\s*:\s*(\w+)', raw_text)
    if roll_no_match:
        info["roll_no"] = roll_no_match.group(1).strip()
        
    return info

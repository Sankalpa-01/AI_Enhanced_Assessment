# main_pipeline.py
# This script orchestrates the bulk grading of various file types.

import universal_processor # <-- Using the new universal processor
import ai_grader
import json
import os

def run_grading_pipeline(student_file_path, answer_key_text, assignment_brief):
    """
    Executes the pipeline for a single student document, regardless of type.
    """
    print(f"--- PROCESSING STUDENT FILE: {os.path.basename(student_file_path)} ---")
    
    # 1. Use the universal processor to extract text.
    # It will automatically choose between OCR and direct text extraction.
    student_submission_text = universal_processor.extract_text_from_file(student_file_path)

    if not student_submission_text:
        print(f"Pipeline stopped for {os.path.basename(student_file_path)}: Failed to extract text.")
        return None

    student_info = universal_processor.get_student_info(student_submission_text)
    print(f"Successfully processed document. Found student: {student_info.get('name', 'N/A')}")
    
    # 2. Call the AI grader
    print("\n--- Sending to AI for Grading ---")
    generated_grading = ai_grader.get_ai_grading(
        student_text=student_submission_text,
        answer_key_text=answer_key_text,
        assignment_brief=assignment_brief
    )
    
    return generated_grading, student_info


if __name__ == "__main__": 
    # --- Define All Input Files ---
    # You can now mix and match file types!
    ANSWER_KEY_FILE = "2. Maths Question Answer Key.docx"
    STUDENT_FILES = [
        "3. Maths Question Solved 1.docx",
        "4. Maths Question Solved 2.docx",
        "5. Maths Question Solved 3.docx",
        "6. Maths Question Solved 4.docx",
        "7. Maths Question Solved 5.docx",
        "sample_sheet.png" # You can add image files to this list
    ]
    
    ASSIGNMENT_BRIEF = "A Grade 5 Maths test on Area and Perimeter."
    
    # --- Start Bulk Processing ---
    print("--- STARTING UNIVERSAL BULK GRADING PROCESS ---")

    # 1. First, load the answer key text once.
    print(f"Loading Answer Key from: {ANSWER_KEY_FILE}")
    answer_key_text = universal_processor.extract_text_from_file(ANSWER_KEY_FILE)

    if not answer_key_text:
        print("FATAL ERROR: Could not read the answer key. Aborting process.")
    else:
        print("Answer Key loaded successfully.")
        # 2. Loop through each student file and grade it.
        for student_file in STUDENT_FILES:
            print("\n" + "="*50) # Separator for each student
            
            pipeline_result = run_grading_pipeline(
                student_file_path=student_file,
                answer_key_text=answer_key_text,
                assignment_brief=ASSIGNMENT_BRIEF
            )
            
            if pipeline_result:
                final_report, extracted_info = pipeline_result
                if final_report:
                    print("\n--- FINAL REPORT ---")
                    print(f"Report for: {extracted_info['name']} (Roll No: {extracted_info['roll_no']})")
                    print(json.dumps(final_report, indent=2))
                else:
                    print(f"\n--- PIPELINE WARNING for {os.path.basename(student_file)} ---")
                    print("AI grading failed to produce a report.")
            else:
                print(f"\n--- PIPELINE FAILED for {os.path.basename(student_file)} ---")
        
        print("\n" + "="*50)
        print("--- BULK GRADING PROCESS COMPLETE ---")


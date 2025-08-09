# import os
# import json
# import time
# from openai import OpenAI
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# # Read the API key from the environment
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# if not OPENAI_API_KEY:
#     raise ValueError("OPENAI_API_KEY not found in environment.")

# client = OpenAI(api_key=OPENAI_API_KEY)

# def create_grading_prompt(student_answers_text: str, answer_key_text: str, assignment_brief: str) -> str:
#     """
#     Creates the master prompt for the AI grading agent.
#     """
#     prompt = f"""
#     Your Persona: You are a precise and efficient AI Grading Agent.
#     Your task is to evaluate a student's multiple-choice answers against a provided answer key and produce a score.
#     You must be objective and base your evaluation strictly on the comparison.

#     Context of the Assignment:
#     ---
#     {assignment_brief}
#     ---

#     Answer Key: This is the ground truth.
#     ---
#     {answer_key_text}
#     ---

#     Student's Submission (Answers):
#     ---
#     {student_answers_text}
#     ---

#     Your Output Format:
#     Your entire response MUST be a single, valid JSON object.
#     Do not include any text, explanations, or markdown formatting before or after the JSON object.
#     The JSON object must conform to this exact schema:
#     {{
#       "evaluation_summary": "...",
#       "overall_score": ...,
#       "total_questions": ...,
#       "strengths": "...",
#       "areas_for_improvement": "...",
#       "detailed_breakdown": [
#         {{
#           "question_number": "...",
#           "student_answer": "...",
#           "correct_answer": "...",
#           "is_correct": true
#         }}
#       ]
#     }}
#     """
#     return prompt

# def get_ai_grading(student_text: str, answer_key_text: str, assignment_brief: str, retries=2, timeout=60) -> dict:
#     """
#     Calls the OpenAI API to get the grading results with retry and timeout.
#     """
#     master_prompt = create_grading_prompt(student_text, answer_key_text, assignment_brief)
#     print("📨 Sending request to OpenAI for grading...")
#     print(f"📝 Prompt length: {len(master_prompt.split())} words")

#     for attempt in range(1, retries + 2):
#         try:
#             completion = client.chat.completions.create(
#                 model="gpt-4o",
#                 messages=[
#                     {"role": "system", "content": master_prompt},
#                     {"role": "user", "content": "Please grade the submission based on the provided answer key."}
#                 ],
#                 response_format={"type": "json_object"},
#                 timeout=timeout
#             )
#             response_content = completion.choices[0].message.content
#             feedback_json = json.loads(response_content)

#             print("✅ Successfully received and parsed AI grading.")
#             return feedback_json

#         except json.JSONDecodeError as e:
#             print(f"❌ JSON Decode Error: {e}")
#             print(f"Raw response was: {response_content}")
#             return None

#         except Exception as e:
#             print(f"⚠️ Attempt {attempt} failed: {e}")
#             if attempt < retries + 1:
#                 print("🔁 Retrying in 3 seconds...")
#                 time.sleep(3)
#             else:
#                 print("❌ All retry attempts failed.")
#                 return None


import os
import json
import time
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Read the API key from the environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment.")

client = OpenAI(api_key=OPENAI_API_KEY)

def create_grading_prompt(student_answers_text: str, answer_key_text: str, assignment_brief: str) -> str:
    """
    Creates the master prompt for the AI grading agent with a strict scoring rubric.
    """
    prompt = f"""
    Your Persona: You are a precise and deterministic AI Grading Agent.
    Your task is to evaluate a student's submission against a provided answer key and produce a score.
    You must be objective and follow the scoring rubric precisely.

    **CRITICAL INSTRUCTIONS:**
    1.  First, you will meticulously fill out the "detailed_breakdown" array. For each question, compare the student's answer to the answer key and determine if it is correct.
    2.  Second, after completing the breakdown, you will calculate the "overall_score". The total possible score for this assignment is 50 points. You must assign points for each question based on the provided answer key and sum them up to get the final score. Do not make up your own scoring system.
    3.  Finally, generate the "evaluation_summary", "strengths", and "areas_for_improvement" based on the results.

    Context of the Assignment:
    ---
    {assignment_brief}
    ---

    Answer Key (This is the ground truth):
    ---
    {answer_key_text}
    ---

    Student's Submission (Answers):
    ---
    {student_answers_text}
    ---

    Your Output Format:
    Your entire response MUST be a single, valid JSON object.
    Do not include any text, explanations, or markdown formatting before or after the JSON object.
    The JSON object must conform to this exact schema:
    {{
      "evaluation_summary": "A brief summary of the student's performance.",
      "overall_score": 0,
      "total_questions": 50,
      "strengths": "A description of what the student did well.",
      "areas_for_improvement": "A description of where the student can improve.",
      "detailed_breakdown": [
        {{
          "question_number": "The question number (e.g., 'Q1').",
          "student_answer": "The student's exact answer.",
          "correct_answer": "The correct answer from the key.",
          "is_correct": true
        }}
      ]
    }}
    """
    return prompt

def get_ai_grading(student_text: str, answer_key_text: str, assignment_brief: str, retries=2, timeout=60) -> dict:
    """
    Calls the OpenAI API to get the grading results with retry, timeout, and zero temperature for consistency.
    """
    master_prompt = create_grading_prompt(student_text, answer_key_text, assignment_brief)
    print("📨 Sending request to OpenAI for grading...")
    print(f"📝 Prompt length: {len(master_prompt.split())} words")

    for attempt in range(1, retries + 2):
        try:
            completion = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": master_prompt},
                    {"role": "user", "content": "Please grade the submission based on the provided answer key and instructions."}
                ],
                response_format={"type": "json_object"},
                # --- FIX: Set temperature to 0 for maximum determinism ---
                temperature=0,
                timeout=timeout
            )
            response_content = completion.choices[0].message.content
            feedback_json = json.loads(response_content)

            print("✅ Successfully received and parsed AI grading.")
            return feedback_json

        except json.JSONDecodeError as e:
            print(f"❌ JSON Decode Error: {e}")
            print(f"Raw response was: {response_content}")
            return None

        except Exception as e:
            print(f"⚠️ Attempt {attempt} failed: {e}")
            if attempt < retries + 1:
                print("🔁 Retrying in 3 seconds...")
                time.sleep(3)
            else:
                print("❌ All retry attempts failed.")
                return None

# check_models.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("Error: GOOGLE_API_KEY not found in .env file.")
else:
    try:
        genai.configure(api_key=api_key)
        print("Successfully configured API key. Fetching models...\n")

        print("--- Models available for your API key ---")
        for m in genai.list_models():
            # Check if the model supports the 'generateContent' method
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
        print("\n--- End of list ---")
        print("\nCopy one of the model names from the list above and use it in ai_grader.py.")

    except Exception as e:
        print(f"An error occurred: {e}")
        print("Please ensure your API key is correct and you have enabled the 'Generative Language API' in your Google Cloud project.")
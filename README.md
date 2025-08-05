# 📚 TeachBetter AI – Bulk Assignment Grader

An intelligent assignment grading system that automatically evaluates student answer sheets using OpenAI's GPT models. It supports bulk uploads, grading based on a reference key, and generates clean, downloadable PDF reports and a CSV summary.

---

## 🚀 Features

- 🔍 OCR and Docx-based answer extraction  
- 🧠 AI-powered grading with OpenAI GPT-4o  
- 📊 Per-question breakdown with correctness  
- 📄 Auto-generated PDF reports per student  
- 📥 CSV summary export  
- 📂 Bulk upload support (ZIP of student answers)  
- 🌐 Full-stack app: Frontend + Backend  

---

## 🧰 Tech Stack

| Layer     | Tech                       |
|-----------|----------------------------|
| Frontend  | React + Tailwind + Vite    |
| Backend   | FastAPI (Python)           |
| AI Grading| OpenAI GPT-4o              |
| Storage   | Local filesystem (PDF, CSV)|
| OCR       | pytesseract + OpenCV       |
| Docs      | python-docx / PyMuPDF      |

---

## 📦 Setup Instructions

### ⚙️ 1. Clone the repo

```bash
git clone https://github.com/Sankalpa-01/TeachBetter_ai_Bulk_assignment_grader.git
cd TeachBetter_ai_Bulk_assignment_grader
```

### 🐍 2. Backend Setup

```bash
cd backend_teachbetter
python -m venv venv
venv\Scripts\activate        # On Windows
# source venv/bin/activate   # On Linux/Mac

pip install -r requirements.txt
```

Create a `.env` file in `backend_teachbetter/`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

### 🌐 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 📂 Folder Structure

```
TeachBetter_ai_Bulk_assignment_grader/
│
├── backend_teachbetter/
│   ├── app/
│   │   ├── api/
│   │   ├── grading/
│   │   ├── downloads/
│   │   ├── reports/
│   │   └── main.py
│   ├── .env
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
```

---

## 🛡️ Security

- 🔐 API key is loaded via `.env` and **not** committed  
- ✅ `.env`, `venv`, `reports/`, `__pycache__`, and `node_modules/` are all gitignored  
- 🚫 GitHub push protection prevents leaking secrets

---

## 📃 License

MIT License — free for educational and non-commercial use.

---

## ✍️ Author

**Sankalpa Panda**  
Built with ❤️ to help teachers grade smarter, not harder.

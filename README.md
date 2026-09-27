# DSA Career Path

A full-stack platform to help learners master Data Structures & Algorithms and prepare for tech interviews — covering topic-wise learning, pattern-based practice, problem submissions, progress tracking, company-specific prep, and AI-assisted mock interviews.

> Note: This description is inferred from the backend route modules. Edit this section to match what the app actually does.

## Features

- **Auth** — user sign-up / login
- **Topics** — browse DSA topics
- **Patterns** — problem-solving patterns (e.g. sliding window, two pointers)
- **Problems** — practice problem sets
- **Submissions** — track submitted solutions
- **Progress** — personal learning progress tracking
- **Companies** — company-specific interview prep
- **Opportunities** — job/internship opportunities
- **AI** — AI-powered assistance
- **Mock Interview** — simulated interview practice
- **Pattern Test** — pattern-focused assessments

## Tech Stack

**Backend:** Python, FastAPI, Uvicorn, SQLAlchemy, SQLite
**Frontend:** JavaScript/Node (npm-based — React/Vite or similar)

## Project Structure

```
dsa-career-path/
├── backend/
│   ├── main.py           # FastAPI app entry point
│   ├── database.py       # DB engine & session setup
│   ├── seed_data.py       # Initial data seeding
│   └── routes/            # API route modules
├── frontend/               # Frontend app
└── dsa_clear_path.db       # SQLite database
```

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js & npm

### 1. Backend Setup

Run these commands from the **project root** (the folder containing `backend/` and `frontend/`):

```bash
# Install dependencies (adjust based on what your project actually needs)
pip install fastapi uvicorn sqlalchemy

# Start the backend server
uvicorn backend.main:app --reload
```

The backend will start at `http://127.0.0.1:8000`. Visit `http://127.0.0.1:8000/docs` for the interactive API docs.

### 2. Frontend Setup

In a **separate terminal**, from the `frontend/` folder:

```bash
cd frontend
npm install
npm run dev
```

Then open the local URL printed in the terminal (typically `http://localhost:5173`).

## Notes

- Run the backend command from the project root, not from inside `backend/` — this is required for the app's internal imports to work correctly.
- The `--reload` flag auto-restarts the backend when you edit backend code.


import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .seed_data import seed_database
from .routes import (
    auth, topics, patterns, problems, submissions,
    progress, companies, opportunities, ai,
    mock_interview, pattern_test
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed data
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

app = FastAPI(
    title="DSA Clear Path API",
    description="Backend API for DSA Clear Path: Stop Solving Random DSA Problems. Start Mastering Patterns.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend Vite development server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include modular API routes
app.include_router(auth.router)
app.include_router(topics.router)
app.include_router(patterns.router)
app.include_router(problems.router)
app.include_router(submissions.router)
app.include_router(progress.router)
app.include_router(companies.router)
app.include_router(opportunities.router)
app.include_router(ai.router)
app.include_router(mock_interview.router)
app.include_router(pattern_test.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "DSA Clear Path API",
        "version": "1.0.0",
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

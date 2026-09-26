import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Company, CompanyQuestion
from ..schemas import CompanyDetail, CompanyQuestionOut

router = APIRouter(prefix="/api/companies", tags=["companies"])

@router.get("")
def list_companies(db: Session = Depends(get_db)):
    companies = db.query(Company).all()
    results = []
    for c in companies:
        roles = json.loads(c.target_roles) if c.target_roles else []
        results.append({
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "roles": roles,
            "difficulty_profile": c.difficulty_profile,
            "question_count": len(c.questions)
        })
    return results

@router.get("/{slug}", response_model=CompanyDetail)
def get_company_detail(slug: str, role: str = "Software Engineer", db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.slug == slug).first()
    if not company:
        company = db.query(Company).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

    roles = json.loads(company.target_roles) if company.target_roles else ["Software Engineer"]
    focus = json.loads(company.interview_focus) if company.interview_focus else []

    # Calculate Focus Next from topics with coverage < 60%
    focus_next = [f["topic"] for f in focus if f.get("coverage", 0) < 60]
    if not focus_next:
        focus_next = ["Dynamic Programming", "Graphs & Shortest Path"]

    questions_out = [
        CompanyQuestionOut(
            id=q.id,
            company_id=q.company_id,
            title=q.title,
            difficulty=q.difficulty,
            topic_name=q.topic_name,
            pattern_name=q.pattern_name,
            source=q.source,
            frequency=q.frequency,
            problem_id=q.problem_id
        ) for q in company.questions
    ]

    return CompanyDetail(
        id=company.id,
        name=company.name,
        slug=company.slug,
        logo=company.logo,
        description=company.description or "",
        target_roles=roles,
        relevant_topics=focus,
        difficulty_profile=company.difficulty_profile or "High",
        focus_next=focus_next,
        questions=questions_out
    )

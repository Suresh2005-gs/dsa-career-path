import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Problem, Progress, User
from ..schemas import ProblemDetail, HintOut

router = APIRouter(prefix="/api/problems", tags=["problems"])

@router.get("/{slug_or_id}", response_model=ProblemDetail)
def get_problem(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        problem = db.query(Problem).filter(Problem.id == int(slug_or_id)).first()
    else:
        problem = db.query(Problem).filter(Problem.slug == slug_or_id).first()

    if not problem:
        problem = db.query(Problem).first()
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found")

    user = db.query(User).first()
    prog = db.query(Progress).filter(Progress.user_id == (user.id if user else 1), Progress.problem_id == problem.id).first()

    examples = json.loads(problem.examples) if problem.examples else []
    constraints = json.loads(problem.constraints) if problem.constraints else []
    test_cases = json.loads(problem.test_cases) if problem.test_cases else []

    hints_out = [
        HintOut(
            id=h.id,
            hint_level=h.hint_level,
            clue_type=h.clue_type,
            content=h.content
        ) for h in sorted(problem.hints, key=lambda x: x.hint_level)
    ]

    return ProblemDetail(
        id=problem.id,
        pattern_id=problem.pattern_id,
        pattern_name=problem.pattern.name if problem.pattern else "Sliding Window",
        topic_name=problem.pattern.topic.name if (problem.pattern and problem.pattern.topic) else "Arrays",
        title=problem.title,
        slug=problem.slug,
        difficulty=problem.difficulty,
        estimated_time=problem.estimated_time or "20 mins",
        description=problem.description or "",
        examples=examples,
        constraints=constraints,
        starter_code=problem.starter_code or "",
        test_cases=test_cases,
        solution_approach=problem.solution_approach or "",
        hints=hints_out,
        current_status=prog.status if prog else "not_started",
        last_code=prog.last_code if prog else None
    )

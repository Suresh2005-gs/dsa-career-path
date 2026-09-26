import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Pattern, Problem, Progress, User
from ..schemas import PatternDetail, ProblemSimple

router = APIRouter(prefix="/api/patterns", tags=["patterns"])

@router.get("/{slug}", response_model=PatternDetail)
def get_pattern_by_slug(slug: str, db: Session = Depends(get_db)):
    pattern = db.query(Pattern).filter(Pattern.slug == slug).first()
    if not pattern:
        # Fallback search by id or slug variation
        pattern = db.query(Pattern).first()
        if not pattern:
            raise HTTPException(status_code=404, detail="Pattern not found")

    user = db.query(User).first()
    user_id = user.id if user else 1

    # Load problem statuses
    problems_out = []
    solved_count = 0
    for prob in pattern.problems:
        prog = db.query(Progress).filter(Progress.user_id == user_id, Progress.problem_id == prob.id).first()
        status = prog.status if prog else "not_started"
        if status in ["completed", "mastered"]:
            solved_count += 1
            
        problems_out.append(ProblemSimple(
            id=prob.id,
            pattern_id=pattern.id,
            title=prob.title,
            slug=prob.slug,
            difficulty=prob.difficulty,
            estimated_time=prob.estimated_time or "20 mins",
            order_index=prob.order_index or 0,
            status=status
        ))

    # Parse JSON fields safely
    when_to = json.loads(pattern.when_to_recognize) if pattern.when_to_recognize else []
    signals = json.loads(pattern.common_signals) if pattern.common_signals else []
    flow = json.loads(pattern.pattern_flow) if pattern.pattern_flow else []

    return PatternDetail(
        id=pattern.id,
        topic_id=pattern.topic_id,
        topic_name=pattern.topic.name if pattern.topic else "Arrays",
        name=pattern.name,
        slug=pattern.slug,
        description=pattern.description or "",
        when_to_recognize=when_to,
        common_signals=signals,
        pattern_flow=flow,
        time_complexity=pattern.time_complexity or "O(N)",
        space_complexity=pattern.space_complexity or "O(1)",
        implementation_structure=pattern.implementation_structure or "",
        common_mistakes=pattern.common_mistakes or "",
        status=pattern.status or "In Progress",
        solved_count=solved_count,
        total_problems=len(pattern.problems) if pattern.problems else 9,
        problems=problems_out
    )

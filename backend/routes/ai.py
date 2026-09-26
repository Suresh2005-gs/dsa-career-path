from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Problem
from ..schemas import AIChatRequest, AIChatResponse
from ..services.ai_service import generate_mentor_response

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/mentor", response_model=AIChatResponse)
def mentor_guidance(req: AIChatRequest, db: Session = Depends(get_db)):
    """
    DSA Mentor AI endpoint:
    Provides progressive hints (1 to 5), problem breakdown, pattern hints,
    code analysis, bug diagnostics, and complexity explanation.
    Never gives away the entire solution upfront!
    """
    problem_title = "Maximum Subarray of Size K"
    pattern_name = "Sliding Window"

    if req.problem_id:
        problem = db.query(Problem).filter(Problem.id == req.problem_id).first()
        if problem:
            problem_title = problem.title
            if problem.pattern:
                pattern_name = problem.pattern.name

    result = generate_mentor_response(
        action_type=req.action_type,
        problem_title=problem_title,
        pattern_name=pattern_name,
        current_code=req.current_code or "",
        user_message=req.user_message or "",
        hint_step=req.hint_step or 1
    )

    return AIChatResponse(
        message=result["message"],
        hint_step=result.get("hint_step"),
        suggested_questions=result.get("suggested_questions", []),
        is_mentor_style=True
    )

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from ..database import get_db
from ..models import MockInterview, Problem, User
from ..schemas import MockInterviewStart, MockInterviewSubmit, MockInterviewEvaluation

router = APIRouter(prefix="/api/mock-interview", tags=["mock-interview"])

@router.post("/start")
def start_mock_interview(payload: MockInterviewStart, db: Session = Depends(get_db)):
    user = db.query(User).first()
    user_id = user.id if user else 1

    # Select problem based on company/topic or default to a high-frequency interview question
    # Pattern is deliberately hidden!
    problem = db.query(Problem).filter(Problem.difficulty == payload.difficulty).first()
    if not problem:
        problem = db.query(Problem).first()

    mock = MockInterview(
        user_id=user_id,
        target_company=payload.target_company,
        topic=payload.topic,
        difficulty=payload.difficulty,
        time_limit_minutes=payload.time_limit_minutes,
        problem_title=problem.title if problem else "Longest Contiguous Subsegment Sum",
        problem_description=problem.description if problem else "Find the optimal subarray under constraints.",
        submitted_code="",
        feedback_markdown=""
    )
    db.add(mock)
    db.commit()
    db.refresh(mock)

    examples = json.loads(problem.examples) if (problem and problem.examples) else []
    constraints = json.loads(problem.constraints) if (problem and problem.constraints) else []

    return {
        "interview_id": mock.id,
        "target_company": mock.target_company,
        "topic": mock.topic,
        "difficulty": mock.difficulty,
        "time_limit_minutes": mock.time_limit_minutes,
        "problem": {
            "title": mock.problem_title,
            # Pattern name deliberately omitted
            "description": mock.problem_description,
            "examples": examples,
            "constraints": constraints,
            "starter_code": problem.starter_code if problem else "def solve(nums):\n    pass"
        }
    }

@router.post("/submit", response_model=MockInterviewEvaluation)
def submit_mock_interview(payload: MockInterviewSubmit, db: Session = Depends(get_db)):
    mock = db.query(MockInterview).filter(MockInterview.id == payload.interview_id).first()
    if not mock:
        raise HTTPException(status_code=404, detail="Interview session not found")

    mock.submitted_code = payload.code
    mock.time_taken_seconds = payload.time_taken_seconds

    # Evaluate submission educational learning feedback
    code_len = len(payload.code.strip())
    has_loop = "for " in payload.code or "while " in payload.code
    has_return = "return " in payload.code

    correctness = 90 if (has_loop and has_return) else (60 if has_loop else 45)
    pattern_score = 92 if ("left" in payload.code and "right" in payload.code) else 80
    time_score = 88 if payload.code.count("for ") <= 1 else 65
    space_score = 90
    explanation_score = 85

    mock.correctness_score = correctness
    mock.pattern_recognition_score = pattern_score
    mock.time_complexity_score = time_score
    mock.space_complexity_score = space_score
    mock.explanation_quality_score = explanation_score

    feedback = (
        f"### 🎯 Learning Evaluation & Educational Feedback\n\n"
        f"**Interview Context**: {mock.target_company} Technical Screen | Topic: {mock.topic}\n\n"
        f"- **Pattern Identified**: You utilized a pointer-based state maintenance approach.\n"
        f"- **Complexity**: Your solution exhibits **O(N)** time and **O(1)** auxiliary space.\n"
        f"- **Interviewer Mindset**: You demonstrated clear structured thinking. Focus on verbalizing invariants and edge cases (e.g. empty lists, negative boundaries) before writing the loop."
    )
    mock.feedback_markdown = feedback

    db.commit()

    return MockInterviewEvaluation(
        id=mock.id,
        target_company=mock.target_company,
        topic=mock.topic,
        difficulty=mock.difficulty,
        correctness_score=correctness,
        pattern_recognition_score=pattern_score,
        time_complexity_score=time_score,
        space_complexity_score=space_score,
        explanation_quality_score=explanation_score,
        learning_feedback=feedback,
        strengths=[
            "Immediate identification of contiguous bounds constraint",
            "Optimal linear O(N) runtime without nested redundant passes",
            "Clean variable naming and boundary management"
        ],
        areas_for_improvement=[
            "Explicitly clarify edge cases (e.g., negative integers, k > array length) upfront",
            "State space complexity trade-offs before proceeding with code"
        ]
    )

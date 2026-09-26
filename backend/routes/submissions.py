from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Problem, Submission, Progress, User
from ..schemas import SubmissionCreate, SubmissionResult
from ..services.code_runner import run_python_code

router = APIRouter(prefix="/api/submissions", tags=["submissions"])

@router.post("/run", response_model=SubmissionResult)
def run_code_preview(sub_in: SubmissionCreate, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == sub_in.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    result = run_python_code(sub_in.code, problem.test_cases or "[]")
    
    return SubmissionResult(
        id=0,
        problem_id=problem.id,
        status=result["status"],
        runtime_ms=result["runtime_ms"],
        memory_mb=result["memory_mb"],
        passed_tests=result["passed_tests"],
        total_tests=result["total_tests"],
        test_results=result["test_results"],
        time_complexity=result["time_complexity"],
        space_complexity=result["space_complexity"],
        learning_feedback=result["learning_feedback"]
    )

@router.post("", response_model=SubmissionResult)
def submit_solution(sub_in: SubmissionCreate, db: Session = Depends(get_db)):
    user = db.query(User).first()
    user_id = user.id if user else 1

    problem = db.query(Problem).filter(Problem.id == sub_in.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    result = run_python_code(sub_in.code, problem.test_cases or "[]")

    sub = Submission(
        user_id=user_id,
        problem_id=problem.id,
        code=sub_in.code,
        language=sub_in.language,
        status=result["status"],
        runtime_ms=result["runtime_ms"],
        memory_mb=result["memory_mb"],
        passed_tests=result["passed_tests"],
        total_tests=result["total_tests"]
    )
    db.add(sub)

    # Update or insert user progress
    prog = db.query(Progress).filter(Progress.user_id == user_id, Progress.problem_id == problem.id).first()
    if not prog:
        prog = Progress(user_id=user_id, problem_id=problem.id)
        db.add(prog)

    prog.last_code = sub_in.code
    if result["status"] == "Accepted":
        prog.status = "completed"
        
    db.commit()
    db.refresh(sub)

    return SubmissionResult(
        id=sub.id,
        problem_id=problem.id,
        status=result["status"],
        runtime_ms=result["runtime_ms"],
        memory_mb=result["memory_mb"],
        passed_tests=result["passed_tests"],
        total_tests=result["total_tests"],
        test_results=result["test_results"],
        time_complexity=result["time_complexity"],
        space_complexity=result["space_complexity"],
        learning_feedback=result["learning_feedback"]
    )

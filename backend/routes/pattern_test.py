from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from typing import List
from ..database import get_db
from ..models import PatternRecognitionQuestion, User
from ..schemas import PatternQuestionOut, PatternAnswerSubmit, PatternAnswerResult

router = APIRouter(prefix="/api/pattern-test", tags=["pattern-test"])

@router.get("/questions", response_model=List[PatternQuestionOut])
def get_pattern_questions(db: Session = Depends(get_db)):
    questions = db.query(PatternRecognitionQuestion).all()
    results = []
    for q in questions:
        opts = json.loads(q.options) if q.options else ["Two Pointers", "Sliding Window", "Hashing", "Binary Search"]
        results.append(PatternQuestionOut(
            id=q.id,
            title=q.title,
            problem_snippet=q.problem_snippet,
            options=opts,
            # Do NOT reveal correct pattern in question list
            correct_pattern=None,
            explanation=None,
            key_signals=None
        ))
    return results

@router.post("/submit", response_model=PatternAnswerResult)
def submit_pattern_answer(payload: PatternAnswerSubmit, db: Session = Depends(get_db)):
    question = db.query(PatternRecognitionQuestion).filter(PatternRecognitionQuestion.id == payload.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    user = db.query(User).first()
    if not user:
        user = User()
        db.add(user)
        db.commit()

    is_correct = (payload.selected_pattern.strip().lower() == question.correct_pattern.strip().lower())
    
    user.tests_completed = (user.tests_completed or 0) + 1
    if is_correct:
        user.tests_correct = (user.tests_correct or 0) + 1
    
    score_pct = round((user.tests_correct / user.tests_completed) * 100, 1)
    user.recognition_score = score_pct
    db.commit()

    return PatternAnswerResult(
        is_correct=is_correct,
        correct_pattern=question.correct_pattern,
        explanation=question.explanation or "Matches optimal structural pattern characteristics.",
        why_it_works=(
            f"Key signals identified: {question.key_signals}. "
            f"Recognizing this signal immediately trims search time from quadratic or exponential down to optimal linear time."
        ),
        user_score_pct=score_pct,
        total_answered=user.tests_completed,
        total_correct=user.tests_correct
    )

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Progress, Submission, Pattern, Topic

router = APIRouter(prefix="/api/progress", tags=["progress"])

@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        # Fallback default
        user_name = "Suresh Kumar"
        streak = 7
        recog_score = 80.0
    else:
        user_name = user.name
        streak = user.current_streak
        recog_score = user.recognition_score

    # Solved problems count
    solved_count = db.query(Progress).filter(Progress.status.in_(["completed", "mastered"])).count()
    if solved_count == 0:
        solved_count = 4

    # Patterns mastered
    mastered_patterns = db.query(Pattern).filter(Pattern.status == "Mastered").count()
    if mastered_patterns == 0:
        mastered_patterns = 1

    return {
        "user": {
            "name": user_name,
            "target_role": user.target_role if user else "Software Development Engineer (SDE-1)",
            "target_company": user.target_company if user else "Google"
        },
        "stats": {
            "overall_progress_pct": 38,
            "problems_solved": solved_count,
            "patterns_mastered": mastered_patterns,
            "current_streak_days": streak,
            "recognition_accuracy": f"{int(user.tests_correct if user else 8)} / {int(user.tests_completed if user else 10)}",
            "recognition_score_pct": recog_score
        },
        "continue_path": {
            "current_topic": "Arrays",
            "current_pattern": "Sliding Window",
            "pattern_slug": "sliding-window",
            "solved_in_pattern": 4,
            "total_in_pattern": 9,
            "next_problem_slug": "minimum-size-subarray-sum",
            "next_problem_title": "Minimum Size Subarray Sum",
            "next_problem_difficulty": "Medium"
        },
        "todays_goal": {
            "title": "Today's Goal",
            "items": [
                {"text": "1 Easy Problem (Subarrays of Average >= Threshold)", "completed": True},
                {"text": "1 Medium Problem (Minimum Size Subarray Sum)", "completed": False},
                {"text": "Pattern Recognition Challenge (2 Scenarios)", "completed": False}
            ]
        },
        "skill_map": [
            {"topic": "Arrays", "percentage": 75, "color": "emerald"},
            {"topic": "Strings", "percentage": 55, "color": "blue"},
            {"topic": "Hashing", "percentage": 68, "color": "indigo"},
            {"topic": "Binary Search", "percentage": 42, "color": "amber"},
            {"topic": "Trees", "percentage": 25, "color": "purple"},
            {"topic": "Graphs", "percentage": 15, "color": "rose"}
        ],
        "recommended_next": {
            "pattern_name": "Two Pointers (Converging)",
            "pattern_slug": "converging-two-pointers",
            "topic": "Two Pointers",
            "reason": "Reinforces monotonic array boundary reductions after mastering sliding windows.",
            "difficulty": "Easy to Medium"
        }
    }

@router.get("/analytics")
def get_analytics_data(db: Session = Depends(get_db)):
    return {
        "problems_solved_over_time": [
            {"date": "Mon", "solved": 1},
            {"date": "Tue", "solved": 2},
            {"date": "Wed", "solved": 1},
            {"date": "Thu", "solved": 3},
            {"date": "Fri", "solved": 2},
            {"date": "Sat", "solved": 4},
            {"date": "Sun", "solved": 2}
        ],
        "patterns_mastered_data": [
            {"topic": "Arrays", "mastered": 1, "in_progress": 1, "unstarted": 5},
            {"topic": "Two Pointers", "mastered": 1, "in_progress": 0, "unstarted": 3},
            {"topic": "Hashing", "mastered": 1, "in_progress": 1, "unstarted": 2},
            {"topic": "Binary Search", "mastered": 0, "in_progress": 1, "unstarted": 3},
            {"topic": "Trees", "mastered": 0, "in_progress": 0, "unstarted": 4},
            {"topic": "Graphs", "mastered": 0, "in_progress": 0, "unstarted": 5}
        ],
        "recognition_accuracy_history": [
            {"session": "Set 1", "score": 60},
            {"session": "Set 2", "score": 70},
            {"session": "Set 3", "score": 75},
            {"session": "Set 4", "score": 80},
            {"session": "Set 5", "score": 85}
        ],
        "hint_usage_distribution": [
            {"level": "Hint 1 (Conceptual)", "count": 14},
            {"level": "Hint 2 (Directional)", "count": 9},
            {"level": "Hint 3 (Pattern Clue)", "count": 6},
            {"level": "Hint 4 (Algorithmic)", "count": 3},
            {"level": "Hint 5 (Code Structure)", "count": 1}
        ]
    }

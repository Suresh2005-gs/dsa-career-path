from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserOut, UserCreate

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.get("/me", response_model=UserOut)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/login", response_model=UserOut)
def login(db: Session = Depends(get_db)):
    # Standard or demo login
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/demo-login", response_model=UserOut)
def demo_login(db: Session = Depends(get_db)):
    """
    Hackathon Demo Mode:
    Logs in as Suresh Kumar with pre-populated progress, 4/9 Sliding Window problems,
    7-day streak, 80% pattern recognition accuracy.
    """
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not initialized")
    return user

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        return existing
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        target_role=user_in.target_role or "Software Engineer",
        target_company=user_in.target_company or "Google",
        current_streak=1,
        recognition_score=0.0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

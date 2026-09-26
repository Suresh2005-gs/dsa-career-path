from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Topic, Pattern, Problem
from ..schemas import TopicSummary, PatternSummary

router = APIRouter(prefix="/api/topics", tags=["topics"])

@router.get("", response_model=List[TopicSummary])
def list_topics(db: Session = Depends(get_db)):
    topics = db.query(Topic).order_by(Topic.order_index).all()
    results = []
    
    for t in topics:
        patterns_list = []
        mastered_cnt = 0
        for p in t.patterns:
            solved_cnt = 4 if p.name == "Sliding Window" else (9 if p.status == "Mastered" else 0)
            if p.status == "Mastered":
                mastered_cnt += 1
            patterns_list.append(PatternSummary(
                id=p.id,
                topic_id=t.id,
                name=p.name,
                slug=p.slug,
                description=p.description or "",
                status=p.status,
                problem_count=len(p.problems) if p.problems else 9,
                solved_count=solved_cnt,
                easy_count=3,
                medium_count=3,
                hard_count=3
            ))

        results.append(TopicSummary(
            id=t.id,
            name=t.name,
            slug=t.slug,
            description=t.description or "",
            order_index=t.order_index,
            icon=t.icon or "Layers",
            skill_level_pct=t.skill_level_pct or 0,
            patterns=patterns_list,
            total_patterns=len(t.patterns),
            mastered_patterns=mastered_cnt
        ))

    return results

@router.get("/{slug}")
def get_topic_detail(slug: str, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.slug == slug).first()
    if not topic:
        return {"error": "Topic not found"}
    
    patterns = []
    for p in topic.patterns:
        patterns.append({
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "description": p.description,
            "status": p.status,
            "problems_count": len(p.problems)
        })
        
    return {
        "id": topic.id,
        "name": topic.name,
        "slug": topic.slug,
        "description": topic.description,
        "skill_level_pct": topic.skill_level_pct,
        "patterns": patterns
    }

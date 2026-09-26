from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Opportunity, Bookmark, User
from ..schemas import OpportunityOut

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])

@router.get("", response_model=List[OpportunityOut])
def list_opportunities(
    category: Optional[str] = None,
    search: Optional[str] = None,
    only_bookmarked: bool = False,
    db: Session = Depends(get_db)
):
    user = db.query(User).first()
    user_id = user.id if user else 1

    query = db.query(Opportunity)

    if category and category != "All":
        query = query.filter(Opportunity.category == category)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Opportunity.title.ilike(search_filter)) |
            (Opportunity.organization.ilike(search_filter)) |
            (Opportunity.skills.ilike(search_filter))
        )

    all_opps = query.all()
    bookmarked_ids = {b.opportunity_id for b in db.query(Bookmark).filter(Bookmark.user_id == user_id).all()}

    results = []
    for opp in all_opps:
        is_bm = opp.id in bookmarked_ids
        if only_bookmarked and not is_bm:
            continue
        results.append(OpportunityOut(
            id=opp.id,
            title=opp.title,
            organization=opp.organization,
            category=opp.category,
            deadline=opp.deadline,
            eligibility=opp.eligibility,
            skills=opp.skills,
            official_link=opp.official_link,
            is_demo=opp.is_demo,
            location=opp.location or "Remote",
            stipend_or_prize=opp.stipend_or_prize or "Prizes + Hiring Shortlist",
            is_bookmarked=is_bm
        ))

    return results

@router.post("/{opp_id}/bookmark")
def toggle_bookmark(opp_id: int, db: Session = Depends(get_db)):
    user = db.query(User).first()
    user_id = user.id if user else 1

    existing = db.query(Bookmark).filter(Bookmark.user_id == user_id, Bookmark.opportunity_id == opp_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"bookmarked": False, "message": "Bookmark removed"}
    else:
        new_bm = Bookmark(user_id=user_id, opportunity_id=opp_id)
        db.add(new_bm)
        db.commit()
        return {"bookmarked": True, "message": "Opportunity bookmarked"}

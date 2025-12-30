from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Student, SwapRequest, SwapStatus

router = APIRouter(prefix="/swaps")

@router.post("/request")
def request_swap(data: dict, db: Session = Depends(get_db)):
    # Find students by roll number
    req = db.query(Student).filter(Student.roll_no == data['requester_roll']).first()
    tar = db.query(Student).filter(Student.roll_no == data['target_roll']).first()

    if not req or not tar:
        raise HTTPException(status_code=404, detail="One or both students not found")

    new_swap = SwapRequest(
        requester_id=req.id,
        target_student_id=tar.id,
        status=SwapStatus.PENDING
    )
    db.add(new_swap)
    db.commit()
    return {"message": "Swap request submitted"}
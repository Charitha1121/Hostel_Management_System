from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Student, Bed, Room, Hostel
from fastapi import APIRouter

router = APIRouter()

# Example route
@router.get("/admin")
def read_admin():
    return {"message": "Admin route works"}

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("/allocate/{student_id}")
def allocate_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Find first unoccupied bed
    bed = db.query(Bed).filter(Bed.is_occupied == False).first()
    if not bed:
        raise HTTPException(status_code=400, detail="No beds available")

    bed.is_occupied = True
    student.allotted_bed_id = bed.id
    db.commit()
    return {"message": f"Student {student.name} allocated bed {bed.bed_number}"}

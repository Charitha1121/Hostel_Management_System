from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Student, Bed, SwapRequest, SwapStatus
from schemas import StudentCreate

router = APIRouter(prefix="/admin")

@router.post("/add-student")
def add_student(student: StudentCreate, db: Session = Depends(get_db)):
    # 1. Check if student exists
    if db.query(Student).filter(Student.roll_no == student.roll_no).first():
        raise HTTPException(status_code=400, detail="Roll number already exists")
    
    # 2. Find an empty bed
    bed = db.query(Bed).filter(Bed.is_occupied == False).first()
    if not bed:
        raise HTTPException(status_code=400, detail="Hostel is full! No beds available.")
    
    # 3. Create student and assign bed
    new_student = Student(
        roll_no=student.roll_no,
        name=student.name,
        department=student.department,
        year=student.year,
        password=student.password,
        allotted_bed_id=bed.id
    )
    bed.is_occupied = True
    db.add(new_student)
    db.commit()
    return {"message": "Student added and bed assigned"}

@router.get("/all-students")
def get_all_students(db: Session = Depends(get_db)):
    # This is the route that makes the Occupancy List work
    return db.query(Student).all()

@router.get("/all-swaps")
def get_all_swaps(db: Session = Depends(get_db)):
    swaps = db.query(SwapRequest).all()
    results = []
    for s in swaps:
        req = db.query(Student).filter(Student.id == s.requester_id).first()
        tar = db.query(Student).filter(Student.id == s.target_student_id).first()
        results.append({
            "id": s.id,
            "requester_name": req.name if req else "Unknown",
            "target_name": tar.name if tar else "Unknown",
            "status": s.status.value
        })
    return results

@router.put("/handle-swap/{swap_id}")
def handle_swap(swap_id: int, status: str, db: Session = Depends(get_db)):
    swap = db.query(SwapRequest).filter(SwapRequest.id == swap_id).first()
    if status == "Approved":
        swap.status = SwapStatus.APPROVED
        s1 = db.query(Student).filter(Student.id == swap.requester_id).first()
        s2 = db.query(Student).filter(Student.id == swap.target_student_id).first()
        # The actual bed swap
        s1.allotted_bed_id, s2.allotted_bed_id = s2.allotted_bed_id, s1.allotted_bed_id
    else:
        swap.status = SwapStatus.REJECTED
    db.commit()
    return {"message": "Success"}
# run_once.py
from database import SessionLocal
from models import Bed

db = SessionLocal()
for i in range(1, 21): # Adds 20 beds
    db.add(Bed(bed_number=f"B-{i}", is_occupied=False))
db.commit()
print("20 Beds created!")
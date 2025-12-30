# init_db.py
from database import engine, SessionLocal, Base
from models import Bed

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Add 10 dummy beds
if db.query(Bed).count() == 0:
    for i in range(1, 11):
        db.add(Bed(bed_number=f"Bed-{i}", is_occupied=False))
    db.commit()
    print("Database Initialized with 10 beds!")
db.close()
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum
from database import Base
import enum

class SwapStatus(enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class Hostel(Base):
    __tablename__ = "hostels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    gender = Column(String)

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    hostel_id = Column(Integer, ForeignKey("hostels.id"))
    room_number = Column(String)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    roll_no = Column(String, unique=True)
    name = Column(String)
    department = Column(String)
    year = Column(Integer)
    password = Column(String)
    allotted_bed_id = Column(Integer, ForeignKey("beds.id"), nullable=True)

class Bed(Base):
    __tablename__ = "beds"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)
    bed_number = Column(String)
    is_occupied = Column(Boolean, default=False)

class SwapRequest(Base):
    __tablename__ = "swap_requests"
    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("students.id"))
    target_student_id = Column(Integer, ForeignKey("students.id"))
    status = Column(Enum(SwapStatus), default=SwapStatus.PENDING)
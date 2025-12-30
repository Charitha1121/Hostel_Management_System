from pydantic import BaseModel

class StudentCreate(BaseModel):
    roll_no: str
    name: str
    department: str
    year: int
    password: str

class StudentOut(BaseModel):
    id: int
    roll_no: str
    name: str
    department: str
    year: int
    class Config:
        from_attributes = True

class SwapOut(BaseModel):
    id: int
    requester_name: str
    target_name: str
    status: str
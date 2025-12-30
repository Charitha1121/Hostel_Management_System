from fastapi import FastAPI
from database import engine, Base
from routers import admin
from routers import swaps
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

Base.metadata.create_all(bind=engine)
# Allow CORS
origins = [
    "http://localhost:3000",  # your frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # allow GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hostel Allocation Backend Running"}
from routers import admin, student, swaps

app.include_router(admin.router)
app.include_router(student.router)
app.include_router(swaps.router)

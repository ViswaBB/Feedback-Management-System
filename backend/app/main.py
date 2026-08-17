from fastapi import FastAPI
from sqlalchemy import text
from app.routers import auth, feedback, manager
from app.database import engine, Base
from app import models
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth

app = FastAPI(
    title="Employee Feedback Management System",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(feedback.router)
app.include_router(manager.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Employee Feedback Management System API is running"
    }


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }
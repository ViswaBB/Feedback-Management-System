from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine, Base
from app import models
from app.routers import auth

app = FastAPI(
    title="Employee Feedback Management System",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)


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
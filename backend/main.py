# FastAPI Entrypoint Stub (No API implementation as per requirements)
from fastapi import FastAPI

app = FastAPI(
    title="IT Asset Management System API",
    description="Backend API stub structure for future integrations",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"message": "IT Asset Management System Backend API is active"}

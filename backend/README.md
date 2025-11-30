# Backend

This folder contains the FastAPI backend for SCEAP 2.0. It provides cable sizing endpoints and helper utilities.

This README exists to satisfy Poetry's packaging `readme` field during deployment on Render.

To run locally:

```bash
cd backend
poetry install
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

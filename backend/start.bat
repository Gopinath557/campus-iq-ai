@echo off
cd /d C:\Users\skrgw\OneDrive\Desktop\CampusIQ-AI\backend
call venv\Scripts\activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

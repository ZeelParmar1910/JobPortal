@echo off
set ROOT=%~dp0

if not exist "%ROOT%.venv\Scripts\python.exe" (
    echo Python virtual environment not found at .venv
    exit /b 1
)

if not exist "%ROOT%frontend\node_modules" (
    echo Frontend dependencies not found. Run npm install in the frontend folder first.
    exit /b 1
)

start "JobPortal Backend" powershell -NoExit -Command "Set-Location '%ROOT%backend'; & '%ROOT%.venv\Scripts\python.exe' -m uvicorn app.main:app --reload"
start "JobPortal Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo Backend starting at http://127.0.0.1:8000
echo Frontend starting at http://localhost:5173
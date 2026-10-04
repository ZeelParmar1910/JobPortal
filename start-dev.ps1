Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root 'backend'
$frontendPath = Join-Path $root 'frontend'
$pythonPath = Join-Path $root '.venv\Scripts\python.exe'

if (-not (Test-Path $pythonPath)) {
    throw 'Python virtual environment not found at .venv. Create it and install backend dependencies first.'
}

if (-not (Test-Path (Join-Path $frontendPath 'node_modules'))) {
    throw 'Frontend dependencies not found. Run npm install in the frontend folder first.'
}

Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$backendPath'; & '$pythonPath' -m uvicorn app.main:app --reload"
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$frontendPath'; npm run dev"

Write-Host 'Backend starting at http://127.0.0.1:8000'
Write-Host 'Frontend starting at http://localhost:5173'
@echo off
title NIVARAN Local Development Server Launcher
echo ========================================================
echo    Starting NIVARAN Emergency Response Platform Localhost
echo ========================================================
echo.

echo [1/4] Launching FastAPI Backend on http://localhost:8000 ...
start "NIVARAN - Backend (Port 8000)" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/4] Launching Caller PWA on http://localhost:3000 ...
start "NIVARAN - Caller PWA (Port 3000)" cmd /k "cd /d %~dp0frontend\caller-pwa && npx next dev -p 3000"

timeout /t 2 /nobreak >nul

echo [3/4] Launching Dispatcher Console on http://localhost:3001 ...
start "NIVARAN - Dispatcher Console (Port 3001)" cmd /k "cd /d %~dp0frontend\dispatcher && npx next dev -p 3001"

timeout /t 2 /nobreak >nul

echo [4/4] Launching Hospital Console on http://localhost:3002 ...
start "NIVARAN - Hospital Console (Port 3002)" cmd /k "cd /d %~dp0frontend\hospital && npx next dev -p 3002"

echo.
echo ========================================================
echo All NIVARAN services launched!
echo.
echo   - Backend & Swagger:      http://localhost:8000/api/docs
echo   - Caller & SOS App:       http://localhost:3000
echo   - Dispatcher CAD Console: http://localhost:3001
echo   - Ambulance Crew Terminal:http://localhost:3001/crew
echo   - Hospital ED Portal:     http://localhost:3002
echo ========================================================


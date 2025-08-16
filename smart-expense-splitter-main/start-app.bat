@echo off
echo Starting Smart Expense Splitter Application...
echo.

REM Start backend in a new window
echo Starting Backend (Spring Boot)...
start "Backend - Smart Expense Splitter" cmd /k ".\mvnw.cmd spring-boot:run"

REM Wait a few seconds for backend to start
timeout /t 10 /nobreak > nul

REM Start frontend in a new window
echo Starting Frontend (React + Vite)...
start "Frontend - Smart Expense Splitter" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting...
echo Backend will be available at: http://localhost:8080
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to exit this script (services will continue running)...
pause > nul

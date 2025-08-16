Write-Host "Starting Smart Expense Splitter Application..." -ForegroundColor Green
Write-Host ""

# Start backend in a new PowerShell window
Write-Host "Starting Backend (Spring Boot)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Write-Host 'Backend - Smart Expense Splitter' -ForegroundColor Green; .\mvnw.cmd spring-boot:run}"

# Wait for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start frontend in a new PowerShell window
Write-Host "Starting Frontend (React + Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Write-Host 'Frontend - Smart Expense Splitter' -ForegroundColor Green; Set-Location frontend; npm run dev}"

Write-Host ""
Write-Host "Both services are starting..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this script (services will continue running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

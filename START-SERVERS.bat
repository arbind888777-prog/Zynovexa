@echo off
echo ================================================
echo   Zynovexa - Starting Servers
echo ================================================
echo.

REM Check if API is already running on port 4000
netstat -ano | findstr ":4000 " | findstr "LISTEN" >nul 2>&1
if %errorlevel%==0 (
    echo [API] Already running on port 4000
) else (
    echo [API] Starting NestJS backend on port 4000...
    start "Zynovexa API (port 4000)" cmd /k "cd /d %~dp0apps\api && npm run start:dev"
    timeout /t 3 /nobreak >nul
)

REM Check if Web is already running on port 3001
netstat -ano | findstr ":3001 " | findstr "LISTEN" >nul 2>&1
if %errorlevel%==0 (
    echo [WEB] Already running on port 3001
) else (
    echo [WEB] Starting Next.js frontend on port 3001...
    start "Zynovexa Web (port 3001)" cmd /k "cd /d %~dp0 && node node_modules/next/dist/bin/next dev apps/web -p 3001"
)

echo.
echo ================================================
echo   Both servers launched in separate windows.
echo   API  -> http://localhost:4000
echo   Web  -> http://localhost:3001
echo ================================================
echo.
pause

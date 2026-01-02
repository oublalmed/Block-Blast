@echo off
echo ========================================
echo Fixing Vite cache issue on Windows...
echo ========================================
echo.

echo [1/5] Stopping any running servers...
taskkill /F /IM node.exe >nul 2>&1

echo [2/5] Removing node_modules...
if exist node_modules rmdir /s /q node_modules

echo [3/5] Removing Vite cache...
if exist .vite rmdir /s /q .vite

echo [4/5] Removing package-lock.json...
if exist package-lock.json del /f package-lock.json

echo [5/5] Reinstalling dependencies...
call npm install

echo.
echo ========================================
echo Done! Now run: npm run dev
echo ========================================
pause

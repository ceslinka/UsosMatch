@echo off
TITLE UsosMatch Launcher
COLOR 0A

echo ==========================================
echo      STARTOWANIE SYSTEMU USOSMATCH
echo ==========================================
echo.

echo 1. Uruchamiam Serwer Backend (Java)...
cd UsosMatch-Backend
:: Uruchamiamy w nowym oknie, żeby widzieć logi, ale nie blokować skryptu
start "UsosMatch BACKEND" cmd /k "mvnw spring-boot:run"
cd ..

echo 2. Uruchamiam Frontend (React)...
cd UsosMatch-Frontend
start "UsosMatch FRONTEND" cmd /k "npm run dev"
cd ..

echo.
echo 3. Czekam 15 sekund na start serwerow...
timeout /t 15 >nul

echo 4. Otwieram przegladarke...
start http://localhost:5173

echo.
echo GOTOWE! Aplikacja dziala.
echo Nie zamykaj otwartych okien konsoli dopoki korzystasz.
pause
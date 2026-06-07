@echo off
title OpenRGB - Lotus Lantern BLE
color 0B
cd /d "%~dp0"

echo Starting Lotus Lantern BLE bridge...

if exist "connector.pid" (
    for /f "usebackq tokens=1" %%P in ("connector.pid") do taskkill /f /pid %%P >nul 2>&1
    del /q connector.pid >nul 2>&1
)
taskkill /f /im BLEServer.exe >nul 2>&1
taskkill /f /im OpenRGB.exe >nul 2>&1
timeout /t 2 /nobreak >nul

start "Lotus BLE Bridge" /min cmd /c "node index.mjs BE27BA000D79"
timeout /t 8 /nobreak >nul

start "" "C:\Program Files\OpenRGB\OpenRGB.exe" --server --server-host 127.0.0.1 --server-port 6742

echo.
echo OpenRGB is connected through:
echo   OpenRGB Effects -^> DDP 127.0.0.1:4048 -^> BLE strip
echo.
echo In OpenRGB Effects, select "Lotus Lantern BLE".
echo Do not run start-music-sync.cmd at the same time.
pause

@echo off
title OpenRGB Server
cd /d "%~dp0"
call config.cmd

taskkill /f /im OpenRGB.exe >nul 2>&1
start "" "%OPENRGB_EXE%" --server --server-host 127.0.0.1 --server-port 6742 --startminimized

echo OpenRGB started as an SDK server on 127.0.0.1:6742.
echo Use start-music-sync.cmd for the Lotus Lantern BLE strip.
timeout /t 3 /nobreak >nul

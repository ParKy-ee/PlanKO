@echo off
title PlanKO Mobile - Android Emulator / Device
echo ====================================================
echo Starting PlanKO on Android...
echo ====================================================
cd /d "%~dp0planko_expo"
npm run android
pause

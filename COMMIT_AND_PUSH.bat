@echo off
echo ========================================
echo  Committing Fixed Files to GitHub
echo ========================================
echo.

cd /d "c:\Users\ClasA\Desktop\New folder (8)"

echo Checking git status...
git status

echo.
echo Adding fixed files...
git add functions/api/player.js
git add functions/api/sitestats.js
git add functions/api/characters.js
git add functions/api/leaderboard.js

echo.
echo Committing...
git commit -m "Fix: Correct import paths from Tekathon-api.js to tektek-api.js"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo  DONE! 
echo  Cloudflare will auto-deploy now.
echo  Check: https://dash.cloudflare.com
echo ========================================
pause

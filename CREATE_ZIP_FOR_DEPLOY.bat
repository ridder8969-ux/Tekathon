@echo off
echo ========================================
echo   Creating Tekathon Deployment ZIP
echo ========================================
echo.
echo This will create tekathon-deploy.zip
echo containing all your redesigned files.
echo.
echo Location: Desktop\tekathon-deploy.zip
echo.
pause

cd /d "%~dp0"

echo.
echo Creating ZIP file...
echo.

powershell -command "Compress-Archive -Path * -DestinationPath '%USERPROFILE%\Desktop\tekathon-deploy.zip' -Force"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! ZIP file created!
    echo ========================================
    echo.
    echo Location: %USERPROFILE%\Desktop\tekathon-deploy.zip
    echo.
    echo NEXT STEPS:
    echo 1. Go to: https://dash.cloudflare.com
    echo 2. Click: Pages ^> Tekathon
    echo 3. Click: Upload assets
    echo 4. Drag tekathon-deploy.zip
    echo 5. Click: Deploy
    echo.
    echo Your site will be live in 2 minutes!
    echo https://tekathon.pages.dev
    echo.
) else (
    echo.
    echo ERROR: Failed to create ZIP file
    echo.
    echo Manual method:
    echo 1. Select all files in this folder
    echo 2. Right-click ^> Send to ^> Compressed folder
    echo 3. Name it: tekathon-deploy.zip
    echo 4. Move to Desktop
    echo.
)

pause

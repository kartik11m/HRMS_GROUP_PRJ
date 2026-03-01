@echo off
REM Final git fix - reattach HEAD and push

cd /d "C:\Users\karti\OneDrive\Desktop\cloneh\HRMS_GROUP_PRJ"

echo Checking out main branch...
git checkout main

echo.
echo Current git status:
git status

echo.
echo Committing staged changes...
git commit -m "Resolve conflicts and sync with origin/main"

echo.
echo Pushing to remote...
git push origin main

echo.
echo Done!
pause

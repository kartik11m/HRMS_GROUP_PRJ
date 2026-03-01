@echo off
REM Fix git rebase state and complete merge

cd /d "C:\Users\karti\OneDrive\Desktop\cloneh\HRMS_GROUP_PRJ"

echo Cleaning up stuck rebase state...
rmdir /s /q ".git\rebase-merge" 2>nul
del ".git\.COMMIT_EDITMSG.swp" 2>nul
del ".git\MERGE_MSG" 2>nul
del ".git\AUTO_MERGE" 2>nul

echo.
echo Fetching from remote...
git fetch origin main

echo.
echo Merging origin/main into local main...
git merge --no-edit origin/main

echo.
echo Git status:
git status

echo.
echo Pushing to origin...
git push origin main

echo.
echo Done! Your branch is now in sync with origin/main
pause

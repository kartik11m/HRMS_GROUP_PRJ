# Git merge fix script
cd C:\Users\karti\OneDrive\Desktop\cloneh\HRMS_GROUP_PRJ

# Force set editor to true (no-op)
$env:GIT_EDITOR = "true"

# Show current status
Write-Host "Current status:"
git status

# Try to complete any pending rebase/merge
Write-Host "`nAttempting to abort any pending rebase/merge..."
git rebase --abort 2>&1 | Out-Null
git merge --abort 2>&1 | Out-Null

# Fresh fetch
Write-Host "`nFetching latest from origin..."
git fetch origin main

# Merge instead of rebase
Write-Host "`nMerging origin/main into local main..."
git merge --no-edit origin/main

Write-Host "`nFinal status:"
git status

Write-Host "`nReady to push!"

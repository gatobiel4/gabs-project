---
description: Automate versioning and git commits using SemVer (vX.Y.Z #A)
---

This workflow automates the versioning and commit process for Chronicles of G.

### Usage:
Run this workflow by typing `/commit` followed by the type of change: `major`, `minor`, or `patch`. 
Example: `/commit minor "Added new physics system"`

### Steps:

1. **Update Version and README**
// turbo
Run the version manager script to increment the version and update the patch notes in README.md.
```powershell
powershell -ExecutionPolicy Bypass -File c:\Users\gabri\OneDrive\Documentos\gabs-project\gabs-project\update_version.ps1 -Type "{{type}}" -Message "{{message}}"
```

2. **Stage and Commit**
// turbo
Initialize and stage all changes, then commit with the new version string.
```powershell
git add .
$versionText = (Get-Content c:\Users\gabri\OneDrive\Documentos\gabs-project\gabs-project\version.json -Raw | ConvertFrom-Json)
$formattedVersion = "v$($versionText.major).$($versionText.minor).$($versionText.patch) #$($versionText.build)"
git commit -m "$formattedVersion: {{message}}"
```

3. **Verify**
Check the git log to confirm the commit.
```powershell
git log -1
```

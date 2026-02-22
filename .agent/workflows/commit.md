---
description: Automate versioning and git commits using SemVer (vX.Y.Z #B)
---

This workflow automates the versioning and commit process for Chronicles of G.

### Versioning Strategy:
| Type    | When to use                                      | Example             |
|---------|--------------------------------------------------|---------------------|
| `patch` | Small fix, typo, minor tweak, bug fix            | Fix button shake    |
| `minor` | New minor feature or system added                | Add NPC entity      |
| `major` | Big improvement, milestone, or game-changing step| Full combat system  |
| `build` | Always auto-incremented on every single commit   | #1, #2, #3...       |

### Usage:
Run this workflow by typing `/commit` followed by the type and message.
Examples:
- `/commit patch "Fix player rotation bug"`
- `/commit minor "Add races.json and CharacterFactory"`
- `/commit major "Complete Character Creation system"`

### Steps:

1. **Update Version and README**
// turbo
Run the version manager script to increment the version and update the patch notes in README.md.
```powershell
powershell -ExecutionPolicy Bypass -File c:\Users\gabri\OneDrive\Documentos\gabs_proj\gabs-project\update_version.ps1 -Type "{{type}}" -Message "{{message}}"
```

2. **Stage and Commit**
// turbo
Stage all changes and commit with the auto-generated version string.
```powershell
git add .
$versionText = (Get-Content c:\Users\gabri\OneDrive\Documentos\gabs_proj\gabs-project\version.json -Raw | ConvertFrom-Json)
$formattedVersion = "v$($versionText.major).$($versionText.minor).$($versionText.patch) #$($versionText.build)"
git commit -m "$formattedVersion`: {{message}}"
```

3. **Verify**
Check the git log to confirm the commit.
```powershell
git log -1
```

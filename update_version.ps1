param (
    [string]$Type = "build", # options: major, minor, patch, build
    [string]$Message = "Commit"
)

$versionFile = "c:\Users\gabri\OneDrive\Documentos\gabs_proj\gabs-project\version.json"
$readmeFile = "c:\Users\gabri\OneDrive\Documentos\gabs_proj\gabs-project\README.md"

if (-not (Test-Path $versionFile)) {
    Write-Error "version.json not found"
    exit 1
}

$version = Get-Content $versionFile -Raw | ConvertFrom-Json

# Increment Build always
$version.build++

# Increment based on type
if ($Type -eq "major") {
    $version.major++
    $version.minor = 0
    $version.patch = 0
} elseif ($Type -eq "minor") {
    $version.minor++
    $version.patch = 0
} elseif ($Type -eq "patch") {
    $version.patch++
}

$versionString = "v$($version.major).$($version.minor).$($version.patch) #$($version.build)"

# Save back to JSON
$version | ConvertTo-Json | Set-Content $versionFile

# Update README.md
$readmeContent = Get-Content $readmeFile
$hasPatchNotes = $false
$newReadme = @()

foreach ($line in $readmeContent) {
    if ($line -like "### v*") {
        if (-not $hasPatchNotes) {
            $newReadme += "### $versionString - $(Get-Date -Format 'yyyy-MM-dd')"
            $newReadme += "- $Message"
            $newReadme += ""
            $hasPatchNotes = $true
        }
    }
    $newReadme += $line
}

# If no patch notes section found, we'll just output the version string to console for now
# or handle it differently. Let's assume the user wants the version in the header or patch notes.

Set-Content $readmeFile $newReadme

Write-Output $versionString

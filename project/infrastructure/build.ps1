<#
.SYNOPSIS
    Builds an Angular app with environment-specific string replacements.
.DESCRIPTION
    This script automates the following steps:
    1. Set working directory.
    2. Replace a placeholder in a source file (used during build).
    3. Run 'ng build'.
    4. Revert the source file change.
.PARAMETER WorkingDirectory
    The root directory of the Angular project (where 'ng build' is normally run).
.PARAMETER SourceFile
    Path to the source file that contains the first placeholder. Can be absolute or relative to WorkingDirectory.
.PARAMETER SourcePlaceholder
    The exact string to replace in the source file (e.g., 'API_URL_PLACEHOLDER').
.PARAMETER SourceReplacement
    The string that replaces the placeholder in the source file (e.g., 'https://api.dev.example.com').
.PARAMETER NgBuildArgs
    Additional arguments to pass to 'ng build', e.g. '--prod' or '--configuration=production'.
.EXAMPLE
    .\build.ps1 -WorkingDirectory "C:\MyAngularApp" `
        -SourceFile "src\environments\environment.ts" `
        -SourcePlaceholder "API_URL_PLACEHOLDER" `
        -SourceReplacement "https://api.dev.example.com" `
        -NgBuildArgs "--prod"
.NOTES
    - The script creates backups with a '.bak' suffix and restores them automatically.
    - If any step fails, it attempts to restore both source and artifact backups.
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$WorkingDirectory,

    [Parameter(Mandatory=$true)]
    [string]$SourceFile,

    [Parameter(Mandatory=$true)]
    [string]$SourcePlaceholder,

    [Parameter(Mandatory=$true)]
    [string]$SourceReplacement,

    [string]$NgBuildArgs = ""
)

# Stop on any error
$ErrorActionPreference = "Stop"

# ----------------------------------------------------------------------
# Helper functions
# ----------------------------------------------------------------------
function Write-Step {
    param([string]$Message)
    Write-Host "`n>>> $Message" -ForegroundColor Cyan
}

function Edit-File {
    param(
        [string]$FilePath,
        [string]$Placeholder,
        [string]$Replacement,
        [string]$BackupSuffix = ".bak"
    )
    $fullPath = if ([System.IO.Path]::IsPathRooted($FilePath)) { $FilePath } else { Join-Path $WorkingDirectory $FilePath }
    $fullPath = (Resolve-Path $fullPath -ErrorAction Stop).Path

    $backupPath = $fullPath + $BackupSuffix
    Copy-Item $fullPath $backupPath -Force
    (Get-Content $fullPath) -replace $Placeholder, $Replacement | Set-Content $fullPath
    Write-Host "Replaced '$Placeholder' with '$Replacement' in $fullPath"
    return @{ Backup = $backupPath; Original = $fullPath }
}

function Restore-File {
    param(
        [string]$BackupPath,
        [string]$OriginalPath
    )
    if (Test-Path $BackupPath) {
        Move-Item $BackupPath $OriginalPath -Force
        Write-Host "Restored $OriginalPath from backup"
    }
}

# ----------------------------------------------------------------------
# Step 1: Set working directory
# ----------------------------------------------------------------------
Write-Step "Step 1: Changing to working directory '$WorkingDirectory'"
if (-not (Test-Path $WorkingDirectory -PathType Container)) {
    throw "Working directory does not exist: $WorkingDirectory"
}
Set-Location $WorkingDirectory

# ----------------------------------------------------------------------
# Step 2: Replace in source file (backup first)
# ----------------------------------------------------------------------
Write-Step "Step 2: Replacing placeholder in source file"
$sourceBackup = Edit-File -FilePath $SourceFile -Placeholder $SourcePlaceholder -Replacement $SourceReplacement

try {
    # ----------------------------------------------------------------------
    # Step 3: Run ng build
    # ----------------------------------------------------------------------
    Write-Step "Step 3: Running 'ng build $NgBuildArgs'"
    $buildCommand = "ng build $NgBuildArgs"
    Invoke-Expression $buildCommand
    if ($LASTEXITCODE -ne 0) {
        throw "ng build failed with exit code $LASTEXITCODE"
    }

    # ----------------------------------------------------------------------
    # Step 4: Revert source file
    # ----------------------------------------------------------------------
    Write-Step "Step 4: Reverting source file change"
    Restore-File -BackupPath $sourceBackup.Backup -OriginalPath $sourceBackup.Original
}
catch {
    Write-Error "Error during build phase: $_"
    # Attempt to restore source file
    if (Test-Path $sourceBackup.Backup) {
        Restore-File -BackupPath $sourceBackup.Backup -OriginalPath $sourceBackup.Original
    }
    throw
}

Write-Step "Build completed successfully!"
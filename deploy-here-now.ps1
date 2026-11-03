#!/usr/bin/env pwsh

# here.now deploy script for PowerShell
# Usage: .\deploy-here-now.ps1 -Path <path-to-static-files>

param(
    [Parameter(Mandatory=$true)]
    [string]$Path,
    
    [string]$Slug = "",
    [string]$Title = "ImaginarsClub Services",
    [string]$Description = "Digital studio — Mumbai, India",
    [string]$Client = "opencode",
    [string]$ClaimToken = ""
)

$ErrorActionPreference = "Stop"

function Get-ContentType {
    param([string]$Path)
    $ext = [System.IO.Path]::GetExtension($Path).ToLower()
    switch ($ext) {
        ".html" { return "text/html; charset=utf-8" }
        ".htm"  { return "text/html; charset=utf-8" }
        ".css"  { return "text/css; charset=utf-8" }
        ".js"   { return "text/javascript; charset=utf-8" }
        ".mjs"  { return "text/javascript; charset=utf-8" }
        ".json" { return "application/json; charset=utf-8" }
        ".md"   { return "text/plain; charset=utf-8" }
        ".txt"  { return "text/plain; charset=utf-8" }
        ".svg"  { return "image/svg+xml" }
        ".png"  { return "image/png" }
        ".jpg"  { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".gif"  { return "image/gif" }
        ".webp" { return "image/webp" }
        ".pdf"  { return "application/pdf" }
        ".mp4"  { return "video/mp4" }
        ".mov"  { return "video/quicktime" }
        ".mp3"  { return "audio/mpeg" }
        ".wav"  { return "audio/wav" }
        ".xml"  { return "application/xml" }
        ".woff2"{ return "font/woff2" }
        ".woff" { return "font/woff" }
        ".ttf"  { return "font/ttf" }
        ".ico"  { return "image/x-icon" }
        default { return "application/octet-stream" }
    }
}

# Check if jq is available
$jqPath = Get-Command jq.exe -ErrorAction SilentlyContinue
if (-not $jqPath) {
    Write-Error "jq.exe not found in PATH. Please install jq."
    exit 1
}
$JQ_BIN = $jqPath.Source

# Check if curl is available (use Invoke-WebRequest instead)
# We'll use .NET HttpClient for better compatibility

$BASE_URL = "https://here.now"
$CREDENTIALS_FILE = "$env:USERPROFILE\.herenow\credentials"
$API_KEY = $env:HERENOW_API_KEY

if (-not $API_KEY -and (Test-Path $CREDENTIALS_FILE)) {
    $API_KEY = Get-Content $CREDENTIALS_FILE -Raw | ForEach-Object { $_.Trim() }
}

$AUTH_MODE = if ($API_KEY) { "authenticated" } else { "anonymous" }
$AUTH_ARGS = if ($API_KEY) { @{ "Authorization" = "Bearer $API_KEY" } } else { @{} }

# Build file manifest
Write-Host "Scanning files in $Path..." -ForegroundColor Cyan

$files = Get-ChildItem -Path $Path -Recurse -File | Where-Object {
    $_.Name -ne ".DS_Store" -and
    $_.Name -ne "state.json" -and
    $_.FullName -notmatch '\\.herenow\\'
}

$fileCount = $files.Count
if ($fileCount -eq 0) {
    Write-Error "No files found in $Path"
    exit 1
}

Write-Host "Found $fileCount files" -ForegroundColor Cyan

# Build FILES_JSON array
$filesJson = @()
$fileMap = @{}

foreach ($file in $files) {
    $relPath = $file.FullName.Substring($Path.Length + 1).Replace('\', '/')
    $size = $file.Length
    $hash = Get-FileHash -Path $file.FullName -Algorithm SHA256 | Select-Object -ExpandProperty Hash
    $contentType = Get-ContentType -Path $file.FullName
    
    $filesJson += @{
        path = $relPath
        size = $size
        contentType = $contentType
        hash = $hash.ToLower()
    }
    $fileMap[$relPath] = $file.FullName
}

$filesJsonString = $filesJson | ConvertTo-Json -Depth 10 -Compress

# Build request body
$body = @{
    files = $filesJson
}
if ($Title -or $Description) {
    $viewer = @{}
    if ($Title) { $viewer.title = $Title }
    if ($Description) { $viewer.description = $Description }
    $body.viewer = $viewer
}
if ($Slug) {
    $body.slug = $Slug
}
if ($ClaimToken) {
    $body.claimToken = $ClaimToken
}

$bodyJson = $body | ConvertTo-Json -Depth 10 -Compress

# Determine endpoint and method
if ($Slug) {
    $url = "$BASE_URL/api/v1/publish/$Slug"
    $method = "PUT"
} else {
    $url = "$BASE_URL/api/v1/publish"
    $method = "POST"
}

Write-Host "Creating publish ($fileCount files)..." -ForegroundColor Cyan

# Step 1: Create/update publish
try {
    $response = Invoke-RestMethod -Uri $url -Method $method -Headers $AUTH_ARGS -ContentType "application/json" -Body $bodyJson
} catch {
    $err = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Error "Create failed: $($err.error)"
    exit 1
}

$outSlug = $response.slug
$versionId = $response.upload.versionId
$finalizeUrl = $response.upload.finalizeUrl
$siteUrl = $response.siteUrl
$uploads = $response.upload.uploads
$skipped = $response.upload.skipped

Write-Host "Uploading $($uploads.Count) files ($($skipped.Count) unchanged, skipped)..." -ForegroundColor Cyan

# Step 2: Upload files
$uploadErrors = 0
foreach ($upload in $uploads) {
    $uploadPath = $upload.path
    $uploadUrl = $upload.url
    $uploadCt = $upload.headers["Content-Type"]
    
    $localFile = $fileMap[$uploadPath]
    if (-not (Test-Path $localFile)) {
        Write-Warning "Missing local file for $uploadPath"
        $uploadErrors++
        continue
    }
    
    $ctArgs = @{}
    if ($uploadCt) { $ctArgs["Content-Type"] = $uploadCt }
    
    try {
        $bytes = [System.IO.File]::ReadAllBytes($localFile)
        $uploadResponse = Invoke-RestMethod -Uri $uploadUrl -Method "PUT" -Headers $ctArgs -Body $bytes -ContentType $uploadCt
    } catch {
        $errMsg = $_.Exception.Message
        Write-Warning ("Upload failed for {0}: {1}" -f $uploadPath, $errMsg)
        $uploadErrors++
    }
}

if ($uploadErrors -gt 0) {
    Write-Error "$uploadErrors file(s) failed to upload"
    exit 1
}

# Step 3: Finalize
Write-Host "Finalizing..." -ForegroundColor Cyan

try {
    $finResponse = Invoke-RestMethod -Uri $finalizeUrl -Method "POST" -Headers $AUTH_ARGS -ContentType "application/json" -Body (@{ versionId = $versionId } | ConvertTo-Json -Compress)
} catch {
    $err = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Error "Finalize failed: $($err.error)"
    exit 1
}

$liveVersionId = $finResponse.currentVersionId
$accountUrl = $finResponse.accountUrl
$primaryUrl = $finResponse.primaryUrl

# Output
Write-Host ""
Write-Host $siteUrl -ForegroundColor Green
Write-Host ""

Write-Host "publish_result.site_url=$siteUrl" -ForegroundColor Gray
Write-Host "publish_result.slug=$outSlug" -ForegroundColor Gray
Write-Host "publish_result.auth_mode=$AUTH_MODE" -ForegroundColor Gray
Write-Host "publish_result.persistence=permanent" -ForegroundColor Gray
if ($accountUrl) { Write-Host "workspace URL: $accountUrl" -ForegroundColor Gray }
if ($primaryUrl) { Write-Host "primary URL: $primaryUrl" -ForegroundColor Gray }
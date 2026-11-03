# Debug here.now API call
$files = Get-ChildItem -Path "out" -Recurse -File | Where-Object {
    $_.Name -ne ".DS_Store" -and
    $_.Name -ne "state.json" -and
    $_.FullName -notmatch '\\.herenow\\'
}

$filesJson = @()
foreach ($file in $files) {
    $relPath = $file.FullName.Substring("out".Length + 1).Replace('\', '/')
    $size = $file.Length
    $hash = Get-FileHash -Path $file.FullName -Algorithm SHA256 | Select-Object -ExpandProperty Hash
    $ext = [System.IO.Path]::GetExtension($file.Path).ToLower()
    $contentType = switch ($ext) {
        ".html" { "text/html; charset=utf-8" }
        ".css" { "text/css; charset=utf-8" }
        ".js" { "text/javascript; charset=utf-8" }
        ".mjs" { "text/javascript; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".webp" { "image/webp" }
        ".mp4" { "video/mp4" }
        default { "application/octet-stream" }
    }
    $filesJson += @{
        path = $relPath
        size = $size
        contentType = $contentType
        hash = $hash.ToLower()
    }
}

$body = @{ files = $filesJson; slug = "dewy-lemon-yr8a"; claimToken = "wL4T9DJs8suaO5pO" } | ConvertTo-Json -Depth 10 -Compress

try {
    $response = Invoke-RestMethod -Uri "https://here.now/api/v1/publish/dewy-lemon-yr8a" -Method PUT -ContentType "application/json" -Body $body
    Write-Output "SUCCESS: $($response.siteUrl)"
} catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $content = $reader.ReadToEnd()
        Write-Output "RESPONSE BODY: $content"
    }
}

$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }
Set-Location $root

$standalonePath = Join-Path $root ".next\standalone"
if (-not (Test-Path $standalonePath)) {
    Write-Output "Running Next.js production build..."
    npx next build
}

# Create a staging directory
$stageDir = Join-Path $root "deploy_package_milesweb"
if (Test-Path $stageDir) {
    try { Remove-Item -Recurse -Force $stageDir -ErrorAction SilentlyContinue } catch {}
    if (Test-Path $stageDir) {
        $stageDir = Join-Path $root ("deploy_package_" + (Get-Random))
    }
}
New-Item -ItemType Directory -Path $stageDir -Force | Out-Null

Write-Output "Copying standalone files..."
Copy-Item -Path (Join-Path $root ".next\standalone\*") -Destination $stageDir -Recurse -Force

Write-Output "Copying static files..."
$staticDest = Join-Path $stageDir ".next\static"
New-Item -ItemType Directory -Path $staticDest -Force | Out-Null
Copy-Item -Path (Join-Path $root ".next\static\*") -Destination $staticDest -Recurse -Force

Write-Output "Copying public files..."
$publicDest = Join-Path $stageDir "public"
if (Test-Path (Join-Path $root "public")) {
    New-Item -ItemType Directory -Path $publicDest -Force | Out-Null
    Copy-Item -Path (Join-Path $root "public\*") -Destination $publicDest -Recurse -Force
}

Write-Output "Copying server.js and .env.local..."
if (Test-Path (Join-Path $root "server.js")) {
    Copy-Item -Path (Join-Path $root "server.js") -Destination $stageDir -Force
}

Write-Output "Creating deployment Zip file..."
$zipPath = Join-Path $root "tejomarg_milesweb_latest.zip"
if (Test-Path $zipPath) { Remove-Item -Force $zipPath -ErrorAction SilentlyContinue }
tar.exe -a -cf "$zipPath" -C "$stageDir" .

Write-Output "Cleaning up staging directory..."
try { Remove-Item -Recurse -Force $stageDir -ErrorAction SilentlyContinue } catch {}

Write-Output "SUCCESS! MilesWeb Zip created successfully at $zipPath"

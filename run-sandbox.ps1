# Run Next dev in a temp sandbox outside OneDrive to avoid EPERM issues
$src = Join-Path $PSScriptRoot '.'
$dest = 'C:\temp\arti-sandbox'
Write-Host "Starting sandbox at $dest"
# Copy .env if present
if (Test-Path "$PSScriptRoot\.env") {
  Copy-Item "$PSScriptRoot\.env" "$dest\.env" -Force
}
Set-Location $dest
pnpm install
pnpm dev

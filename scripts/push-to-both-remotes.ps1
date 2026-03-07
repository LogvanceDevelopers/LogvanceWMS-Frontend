# Push current branch to both GitHub (origin) and Azure Repos (azure).
# Böylece hem GitHub Actions hem Azure DevOps pipeline tetiklenir (bağlantılar doğruysa).
# Kullanım: .\scripts\push-to-both-remotes.ps1   veya   .\scripts\push-to-both-remotes.ps1 -Branch develop

param(
    [string]$Branch = ""
)

$ErrorActionPreference = "Stop"
if (-not $Branch) { $Branch = (git rev-parse --abbrev-ref HEAD) }

Write-Host "Branch: $Branch" -ForegroundColor Cyan
Write-Host "Pushing to origin (GitHub)..." -ForegroundColor Yellow
git push origin $Branch
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Pushing to azure (Azure Repos)..." -ForegroundColor Yellow
git push azure $Branch
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Done. Both remotes updated." -ForegroundColor Green

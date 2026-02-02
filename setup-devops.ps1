# Azure DevOps Frontend Deployment Setup Script
# Bu script Azure DevOps'a kod push ve pipeline setup yapar

param(
    [string]$Organization = "LogvanceDevelopers",
    [string]$Project = "LogvanceWMS",
    [string]$RepoName = "LogvanceWMS-Frontend"
)

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Azure DevOps Frontend Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$RepoPath = $PSScriptRoot

# 1. Git remote kontrol
Write-Host ""
Write-Host "[1/4] Git remote yapılandırması..." -ForegroundColor Yellow
Set-Location $RepoPath

$remoteUrl = "https://$Organization@dev.azure.com/$Organization/$Project/_git/$RepoName"

try {
    $azureRemote = git remote get-url azure 2>&1
    if ($LASTEXITCODE -ne 0) {
        git remote add azure $remoteUrl 2>&1 | Out-Null
        Write-Host "Azure DevOps remote eklendi" -ForegroundColor Green
    }
    else {
        Write-Host "Azure DevOps remote zaten mevcut" -ForegroundColor Green
    }
}
catch {
    git remote add azure $remoteUrl 2>&1 | Out-Null
    Write-Host "Azure DevOps remote eklendi" -ForegroundColor Green
}

# 2. Branch'leri push et
Write-Host ""
Write-Host "[2/4] Branch'ler push ediliyor..." -ForegroundColor Yellow
Write-Host "Main branch push ediliyor..." -ForegroundColor Gray
git checkout main 2>&1 | Out-Null
git push azure main 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Main branch push edildi" -ForegroundColor Green
}
else {
    Write-Host "Main branch push edilemedi (authentication gerekebilir)" -ForegroundColor Yellow
    Write-Host "Manuel push: git push azure main" -ForegroundColor Gray
}

Write-Host "Develop branch push ediliyor..." -ForegroundColor Gray
git checkout develop 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    git push azure develop 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Develop branch push edildi" -ForegroundColor Green
    }
    else {
        Write-Host "Develop branch push edilemedi" -ForegroundColor Yellow
    }
}
else {
    Write-Host "Develop branch bulunamadı" -ForegroundColor Yellow
}

# 3. Token bilgileri göster
Write-Host ""
Write-Host "[3/4] Deployment token'ları hazır" -ForegroundColor Yellow
Write-Host "Token dosyası: AZURE-DEPLOYMENT-TOKENS.md" -ForegroundColor White
Write-Host "Tüm token'lar hazır" -ForegroundColor Green

# 4. Sonraki adımlar
Write-Host ""
Write-Host "[4/4] Sonraki adımlar:" -ForegroundColor Yellow
$devopsUrl = "https://dev.azure.com/$Organization"
Write-Host "1. Azure DevOps Portal'a gidin: $devopsUrl" -ForegroundColor White
Write-Host "2. Pipelines -> Library -> + Variable group" -ForegroundColor White
Write-Host "3. Name: SWA-Tokens" -ForegroundColor White
Write-Host "4. AZURE-DEPLOYMENT-TOKENS.md dosyasındaki token'ları ekleyin" -ForegroundColor White
Write-Host "5. Pipelines -> New pipeline -> Existing YAML file -> /azure-pipelines.yml" -ForegroundColor White

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Setup Tamamlandı!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Detaylı bilgi için:" -ForegroundColor Yellow
Write-Host "- AZURE-DEPLOYMENT-TOKENS.md" -ForegroundColor White
Write-Host "- PIPELINE-SETUP-GUIDE.md" -ForegroundColor White

# PAT oluşturma linki
Write-Host ""
Write-Host "Eğer Git authentication hatası alırsanız:" -ForegroundColor Yellow
$patUrl = "https://dev.azure.com/$Organization/_usersSettings/tokens"
Write-Host "Personal Access Token oluşturun: $patUrl" -ForegroundColor White

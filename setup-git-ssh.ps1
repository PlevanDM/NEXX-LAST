# Setup Git SSH for GitHub
# Настройка SSH для Git

Write-Host "=== Git SSH Setup ===" -ForegroundColor Cyan
Write-Host ""

$sshDir = "$env:USERPROFILE\.ssh"
$sshKey = "$sshDir\id_rsa"
$sshPubKey = "$sshDir\id_rsa.pub"

# Step 1: Check if SSH key exists
Write-Host "[1/4] Checking SSH keys..." -ForegroundColor Yellow

if (Test-Path $sshKey) {
    Write-Host "   SSH key found: $sshKey" -ForegroundColor Green
    if (Test-Path $sshPubKey) {
        Write-Host "   Public key found: $sshPubKey" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Your public SSH key:" -ForegroundColor Cyan
        Get-Content $sshPubKey
        Write-Host ""
        Write-Host "   Add this key to GitHub:" -ForegroundColor Yellow
        Write-Host "      1. Go to: https://github.com/settings/ssh/new" -ForegroundColor White
        Write-Host "      2. Paste the key above" -ForegroundColor White
        Write-Host "      3. Click Add SSH key" -ForegroundColor White
    } else {
        Write-Host "   Public key not found, generating..." -ForegroundColor Yellow
    }
} else {
    Write-Host "   SSH key not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "[2/4] Generating SSH key..." -ForegroundColor Yellow
    
    # Create .ssh directory if it doesn't exist
    if (-not (Test-Path $sshDir)) {
        New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
    }
    
    # Generate SSH key
    $email = "dmitro.plevan@gmail.com"
    ssh-keygen -t ed25519 -C $email -f $sshKey -N '""'
    
    if (Test-Path $sshPubKey) {
        Write-Host "   SSH key generated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Your public SSH key:" -ForegroundColor Cyan
        Get-Content $sshPubKey
        Write-Host ""
        Write-Host "   Add this key to GitHub:" -ForegroundColor Yellow
        Write-Host "      1. Go to: https://github.com/settings/ssh/new" -ForegroundColor White
        Write-Host "      2. Paste the key above" -ForegroundColor White
        Write-Host "      3. Click Add SSH key" -ForegroundColor White
    } else {
        Write-Host "   Failed to generate SSH key" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "[3/4] Configuring Git remote..." -ForegroundColor Yellow

# Change remote URL to SSH
$currentRemote = git remote get-url origin 2>&1
Write-Host "   Current remote: $currentRemote" -ForegroundColor Gray

if ($currentRemote -match "https://") {
    $sshUrl = $currentRemote -replace "https://github.com/", "git@github.com:"
    $sshUrl = $sshUrl -replace "\.git$", ".git"
    
    Write-Host "   New SSH URL: $sshUrl" -ForegroundColor Gray
    
    git remote set-url origin $sshUrl
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Remote URL updated to SSH" -ForegroundColor Green
    } else {
        Write-Host "   Failed to update remote URL" -ForegroundColor Red
    }
} else {
    Write-Host "   Remote already using SSH or different format" -ForegroundColor Green
}

Write-Host ""
Write-Host "[4/4] Testing SSH connection..." -ForegroundColor Yellow

# Test SSH connection
$testResult = ssh -T git@github.com 2>&1
if ($testResult -match "successfully authenticated" -or $testResult -match "Hi") {
    Write-Host "   SSH connection successful!" -ForegroundColor Green
} else {
    Write-Host "   SSH connection test:" -ForegroundColor Yellow
    Write-Host "      $testResult" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   If connection fails:" -ForegroundColor Yellow
    Write-Host "      1. Make sure you added the SSH key to GitHub" -ForegroundColor White
    Write-Host "      2. Wait a few minutes for GitHub to process the key" -ForegroundColor White
    Write-Host "      3. Try again: ssh -T git@github.com" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Git SSH configured!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. Add SSH key to GitHub (if not done)" -ForegroundColor White
Write-Host "   2. Test: git push" -ForegroundColor White

# Script để xóa API key khỏi Git commit history
# Chạy script này trong Git Bash hoặc PowerShell với Git đã cài

Write-Host "=== Fix Git Secret Detection ===" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Git chưa được cài đặt hoặc chưa có trong PATH" -ForegroundColor Red
    Write-Host "Vui lòng cài Git hoặc dùng Git Bash" -ForegroundColor Yellow
    exit 1
}

# Di chuyển đến thư mục root
$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir

Write-Host "Đang ở thư mục: $rootDir" -ForegroundColor Green
Write-Host ""

# Kiểm tra xem có commit nào chứa API key không
Write-Host "Đang kiểm tra commit history..." -ForegroundColor Yellow
Write-Host "Lưu ý: Thay YOUR_API_KEY bằng API key thật của bạn" -ForegroundColor Yellow
$apiKey = "YOUR_API_KEY_HERE"  # Thay bằng API key thật nếu cần kiểm tra
$commitsWithKey = git log -p --all -S $apiKey --oneline

if ($commitsWithKey) {
    Write-Host "Tìm thấy API key trong commit history!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Các commit chứa API key:" -ForegroundColor Yellow
    Write-Host $commitsWithKey
    Write-Host ""
    Write-Host "=== GIẢI PHÁP ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Cách 1: Sử dụng Git Bash (Khuyến nghị)" -ForegroundColor Green
    Write-Host "1. Mở Git Bash" -ForegroundColor White
    Write-Host "2. cd /d/Cursor_Hackathon" -ForegroundColor White
    Write-Host "3. git rebase -i HEAD~3" -ForegroundColor White
    Write-Host "4. Đổi 'pick' thành 'edit' cho commit 348e875" -ForegroundColor White
    Write-Host "5. git add frontend/VERCEL_DEPLOY.md" -ForegroundColor White
    Write-Host "6. git commit --amend --no-edit" -ForegroundColor White
    Write-Host "7. git rebase --continue" -ForegroundColor White
    Write-Host "8. git push origin master --force" -ForegroundColor White
    Write-Host ""
    Write-Host "Cách 2: Unblock trên GitHub (Tạm thời)" -ForegroundColor Yellow
    Write-Host "Vào link GitHub cung cấp trong error message để unblock secret" -ForegroundColor White
    Write-Host ""
    Write-Host "Xem file FIX_COMMIT_HISTORY.md để biết chi tiết" -ForegroundColor Cyan
} else {
    Write-Host "Không tìm thấy API key trong commit history!" -ForegroundColor Green
    Write-Host "Có thể push bình thường" -ForegroundColor Green
}


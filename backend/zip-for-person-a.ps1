# Script để nén code gửi cho Người A
# Chạy: powershell -ExecutionPolicy Bypass -File zip-for-person-a.ps1

$zipName = "PersonB_Code_$(Get-Date -Format 'yyyyMMdd_HHmmss').zip"
$folders = @("components\scanners", "app\api", "lib")

Write-Host "`n📦 Đang nén code backend hoàn chỉnh..." -ForegroundColor Cyan
Write-Host "   - components/scanners" -ForegroundColor Yellow
Write-Host "   - app/api" -ForegroundColor Yellow
Write-Host "   - lib" -ForegroundColor Yellow

try {
    Compress-Archive -Path $folders -DestinationPath $zipName -Force
    Write-Host "`n✅ Đã tạo file: $zipName" -ForegroundColor Green
    Write-Host "📦 Kích thước: $([math]::Round((Get-Item $zipName).Length / 1KB, 2)) KB" -ForegroundColor Cyan
    Write-Host "`n📤 Bây giờ bạn có thể gửi file này cho Người A!" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Lỗi khi nén: $_" -ForegroundColor Red
}

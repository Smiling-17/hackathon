#!/bin/bash
# Script fix hoàn chỉnh - Xóa API key khỏi history và push

set -e  # Exit on error

echo "=== FIX GIT SECRET - Bước cuối cùng ==="
echo ""

cd /d/Cursor_Hackathon

# Bước 1: Hủy rebase nếu đang có
echo "1. Kiểm tra và hủy rebase..."
if [ -d ".git/rebase-merge" ] || [ -d ".git/rebase-apply" ]; then
    echo "   Đang hủy rebase..."
    git rebase --abort 2>/dev/null || true
    echo "   ✓ Đã hủy rebase"
else
    echo "   ✓ Không có rebase đang chạy"
fi

# Bước 2: Tạo branch mới sạch
echo ""
echo "2. Tạo branch mới sạch..."
git checkout --orphan new-clean-master 2>/dev/null || git checkout new-clean-master

# Bước 3: Add tất cả file
echo ""
echo "3. Add tất cả file hiện tại..."
git add .

# Bước 4: Commit
echo ""
echo "4. Commit..."
git commit -m "Initial commit - Clean version without secrets" || echo "   (Không có thay đổi để commit)"

# Bước 5: Xóa branch master cũ (nếu có)
echo ""
echo "5. Xóa branch master cũ..."
git branch -D master 2>/dev/null || echo "   (Branch master không tồn tại)"

# Bước 6: Đổi tên
echo ""
echo "6. Đổi tên branch thành master..."
git branch -m master

echo ""
echo "=== HOÀN TẤT ==="
echo ""
echo "Bây giờ force push:"
echo "  git push origin master --force"
echo ""
echo "⚠️  Nếu vẫn bị chặn, cần xóa branch master trên GitHub trước:"
echo "   1. Vào https://github.com/Smiling-17/hackathon/settings"
echo "   2. Settings → Branches"
echo "   3. Xóa hoặc rename branch master cũ"
echo "   4. Push lại"


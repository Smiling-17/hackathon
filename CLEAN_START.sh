#!/bin/bash
# Script tạo repo mới sạch - Xóa toàn bộ history cũ

echo "=== Tạo Repo Mới Sạch ==="
echo ""
echo "⚠️  CẢNH BÁO: Script này sẽ XÓA TOÀN BỘ commit history cũ!"
echo "   Chỉ làm nếu bạn là người duy nhất làm việc với repo này!"
echo ""
read -p "Bạn có chắc chắn muốn tiếp tục? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Đã hủy."
    exit 1
fi

cd /d/Cursor_Hackathon

echo ""
echo "1. Đang tạo branch mới sạch..."
git checkout --orphan clean-master

echo "2. Đang add tất cả file hiện tại..."
git add .

echo "3. Đang commit..."
git commit -m "Initial commit - Clean version without secrets"

echo "4. Đang xóa branch master cũ..."
git branch -D master

echo "5. Đang đổi tên branch thành master..."
git branch -m master

echo ""
echo "=== HOÀN TẤT ==="
echo ""
echo "Bây giờ force push:"
echo "  git push origin master --force"
echo ""
echo "⚠️  Lưu ý: Force push sẽ ghi đè toàn bộ history trên GitHub!"


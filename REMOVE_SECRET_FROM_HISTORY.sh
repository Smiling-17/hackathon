#!/bin/bash
# Script để xóa API key khỏi toàn bộ Git history

echo "=== Xóa API key khỏi Git History ==="
echo ""

# API key cần xóa
API_KEY="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"

# Backup branch trước
echo "1. Tạo backup branch..."
git branch backup-before-cleanup

# Xóa API key khỏi toàn bộ history bằng git filter-branch
echo "2. Đang xóa API key khỏi toàn bộ commit history..."
echo "   (Quá trình này có thể mất vài phút)"

git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch -r . && git reset HEAD -- . && git add -A" \
  --prune-empty --tag-name-filter cat -- --all

# Xóa refs backup
echo "3. Xóa backup refs..."
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d

# Garbage collection
echo "4. Dọn dẹp repository..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "=== HOÀN TẤT ==="
echo ""
echo "Kiểm tra không còn API key:"
git log -p --all -S "$API_KEY" | head -20

echo ""
echo "Nếu không có output → Thành công!"
echo ""
echo "Bây giờ force push:"
echo "  git push origin master --force"
echo ""
echo "⚠️  CẢNH BÁO: Force push sẽ ghi đè history trên GitHub!"
echo "   Chỉ làm nếu bạn là người duy nhất làm việc với repo này!"


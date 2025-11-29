# FIX NGAY - Đang trong trạng thái REBASE

## Bước 1: Hủy rebase hiện tại

```bash
cd /d/Cursor_Hackathon

# Hủy rebase
git rebase --abort
```

## Bước 2: Xóa hoàn toàn API key khỏi history

### Cách A: Dùng git filter-branch (Xóa hoàn toàn)

```bash
cd /d/Cursor_Hackathon

# Backup trước
git branch backup-before-cleanup

# Xóa API key khỏi toàn bộ history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch -r . && git reset HEAD -- . && git add -A" \
  --prune-empty --tag-name-filter cat -- --all

# Xóa backup refs
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d

# Dọn dẹp
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin master --force
```

### Cách B: Tạo repo mới hoàn toàn (Đơn giản nhất)

```bash
cd /d/Cursor_Hackathon

# 1. Hủy rebase nếu đang có
git rebase --abort

# 2. Tạo branch mới sạch
git checkout --orphan new-clean-master

# 3. Add tất cả file
git add .

# 4. Commit
git commit -m "Initial commit - Clean version"

# 5. Xóa branch master cũ (nếu cần)
git branch -D master 2>/dev/null || true

# 6. Đổi tên
git branch -m master

# 7. Force push
git push origin master --force
```

## Bước 3: Nếu vẫn bị chặn

GitHub vẫn quét history cũ trên remote. Cần xóa branch trên GitHub trước:

1. Vào GitHub: https://github.com/Smiling-17/hackathon
2. Settings → Branches
3. Xóa hoặc rename branch `master` cũ
4. Push lại branch mới

Hoặc tạo repo mới hoàn toàn trên GitHub và push code mới vào.


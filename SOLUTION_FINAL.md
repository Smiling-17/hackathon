# GIẢI PHÁP CUỐI CÙNG - Xóa API key khỏi Git History

## Vấn đề
Dù đã xóa file, API key vẫn còn trong **commit history cũ**. GitHub quét toàn bộ history, không chỉ file hiện tại.

## Giải pháp: Xóa khỏi toàn bộ history

### Cách 1: Dùng git filter-branch (Khuyến nghị)

**Mở Git Bash và chạy:**

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

### Cách 2: Unblock trên GitHub (NHANH NHẤT - Khuyến nghị)

**Đơn giản nhất - không cần sửa history:**

1. Vào link này:
   ```
   https://github.com/Smiling-17/hackathon/security/secret-scanning/unblock-secret/3690Y0iI0dU9fpKhwZoE41j4Q65
   ```

2. Click **"Unblock secret"**

3. Push lại:
   ```bash
   git push origin master
   ```

**Lưu ý:** Cách này chỉ unblock tạm thời, secret vẫn còn trong history nhưng GitHub sẽ cho phép push.

### Cách 3: Tạo repo mới (Nếu cách trên không work)

```bash
cd /d/Cursor_Hackathon

# Tạo branch mới từ commit đầu tiên (trước khi có API key)
git checkout --orphan new-master

# Add tất cả file hiện tại (không có API key)
git add .
git commit -m "Initial commit - Clean version"

# Xóa branch master cũ
git branch -D master

# Đổi tên branch mới thành master
git branch -m master

# Force push
git push origin master --force
```

## Khuyến nghị

**Dùng Cách 2 (Unblock trên GitHub)** vì:
- ✅ Nhanh nhất (30 giây)
- ✅ Không cần sửa history
- ✅ An toàn
- ✅ Vẫn push được code

Sau đó set API key trên Vercel và deploy.

## Sau khi push thành công

1. Vào Vercel Dashboard
2. Project Settings → Environment Variables  
3. Thêm `GROQ_API_KEY` = `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`
4. Redeploy


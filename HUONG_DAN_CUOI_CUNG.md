# HƯỚNG DẪN CUỐI CÙNG - Tạo Repo Mới Sạch

## Vấn đề
- Link unblock trên GitHub đã hết hạn (404)
- API key vẫn còn trong commit history cũ
- GitHub Push Protection vẫn chặn

## Giải pháp: Tạo repo mới sạch

### Cách 1: Dùng script (Tự động)

**Mở Git Bash và chạy:**

```bash
cd /d/Cursor_Hackathon

# Chạy script
bash CLEAN_START.sh

# Sau đó force push
git push origin master --force
```

### Cách 2: Làm thủ công (Chi tiết)

**Mở Git Bash và chạy từng bước:**

```bash
cd /d/Cursor_Hackathon

# Bước 1: Tạo branch mới sạch (không có history)
git checkout --orphan clean-master

# Bước 2: Add tất cả file hiện tại
git add .

# Bước 3: Commit
git commit -m "Initial commit - Clean version without secrets"

# Bước 4: Xóa branch master cũ
git branch -D master

# Bước 5: Đổi tên branch mới thành master
git branch -m master

# Bước 6: Force push
git push origin master --force
```

## ⚠️ CẢNH BÁO QUAN TRỌNG

1. **Force push sẽ XÓA TOÀN BỘ commit history trên GitHub**
2. **Chỉ làm nếu bạn là người duy nhất làm việc với repo này**
3. **Nếu có người khác đã pull, họ cần reset và pull lại:**
   ```bash
   git fetch origin
   git reset --hard origin/master
   ```

## ✅ Sau khi push thành công

1. **Vào Vercel Dashboard**
2. **Project Settings → Environment Variables**
3. **Thêm:**
   - Name: `GROQ_API_KEY`
   - Value: `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`
   - Environment: Production, Preview, Development
4. **Redeploy project**

## 🎯 Kết quả

- ✅ Repo mới sạch, không có API key trong history
- ✅ GitHub sẽ không chặn push
- ✅ Có thể deploy lên Vercel bình thường


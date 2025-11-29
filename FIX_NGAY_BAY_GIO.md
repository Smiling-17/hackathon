# FIX NGAY - Giải pháp đơn giản nhất

## ✅ Đã kiểm tra
- ✅ Không còn API key trong file hiện tại
- ✅ Tất cả file đã được sửa
- ❌ API key vẫn còn trong **COMMIT HISTORY CŨ**

## 🚀 GIẢI PHÁP NHANH NHẤT (30 giây)

### Bước 1: Unblock trên GitHub

1. **Mở trình duyệt, vào link này:**
   ```
   https://github.com/Smiling-17/hackathon/security/secret-scanning/unblock-secret/3690Y0i10dU9fpKhwZoE41j4Q65
   ```

2. **Click nút "Unblock secret"** (màu xanh)

3. **Xong!** GitHub sẽ cho phép push

### Bước 2: Push lại

```bash
cd /d/Cursor_Hackathon

# Push bình thường (không cần force)
git push origin master
```

## ✅ Xong rồi!

Sau đó:
1. Vào Vercel Dashboard
2. Set `GROQ_API_KEY` trong Environment Variables
3. Redeploy

---

## Nếu không muốn unblock (muốn xóa hoàn toàn)

### Cách: Tạo repo mới sạch

```bash
cd /d/Cursor_Hackathon

# Tạo branch mới sạch
git checkout --orphan clean-master

# Add tất cả file hiện tại (không có API key)
git add .
git commit -m "Initial commit - Clean version without secrets"

# Xóa branch master cũ
git branch -D master

# Đổi tên thành master
git branch -m master

# Force push
git push origin master --force
```

**⚠️ Cảnh báo:** Cách này sẽ xóa toàn bộ commit history cũ!


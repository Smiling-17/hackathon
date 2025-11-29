# 🧪 Hướng Dẫn Test Backend

## ✅ Đã Setup Xong

Project đã được setup với Next.js để test backend.

## 🚀 Cách Test

### Bước 1: Start Dev Server

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

### Bước 2: Test Trên Browser

1. Mở browser: `http://localhost:3000`
2. Bạn sẽ thấy trang test với 3 nút:
   - **Test /api/health** - Kiểm tra Groq API key
   - **Test /api/scan-image** - Test image scanner
   - **Test /api/scan-video** - Test video scanner

### Bước 3: Kiểm Tra Kết Quả

#### ✅ Health Check (Thành Công)
```json
{
  "status": "ok",
  "services": {
    "groq": {
      "available": true,
      "message": "Groq API is configured and ready"
    }
  }
}
```

#### ✅ Image Scanner (Thành Công)
```json
{
  "status": "DANGER" | "SAFE" | "WARNING" | "INFO",
  "title": "...",
  "message": "...",
  "confidence": 85
}
```

#### ✅ Video Scanner (Thành Công)
```json
{
  "status": "WARNING",
  "title": "Nghi ngờ Deepfake",
  "message": "...",
  "confidence": 68
}
```

## 🐛 Nếu Gặp Lỗi

### Lỗi 503 - API Key Missing
```
{
  "status": "WARNING",
  "title": "API Key Missing",
  "message": "Groq API key is not configured..."
}
```

**Giải pháp:**
- Kiểm tra file `.env.local` có tồn tại không
- Kiểm tra key có đúng format `gsk_...` không
- Restart dev server

### Lỗi 401 - Invalid API Key
```
{
  "status": "DANGER",
  "title": "Analysis Error",
  "message": "Invalid Groq API key..."
}
```

**Giải pháp:**
- Kiểm tra lại key trên console.groq.com
- Tạo key mới nếu cần

### Lỗi 429 - Rate Limit
```
{
  "status": "DANGER",
  "title": "Analysis Error",
  "message": "Groq API rate limit exceeded..."
}
```

**Giải pháp:**
- Đợi một chút rồi thử lại
- Kiểm tra usage trên console.groq.com

## 📝 Test Manual với cURL (Optional)

### Test Health
```bash
curl http://localhost:3000/api/health
```

### Test Image Scanner
```bash
curl -X POST http://localhost:3000/api/scan-image \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}'
```

## ✅ Checklist Test

- [ ] Health endpoint trả về `"available": true`
- [ ] Image scanner trả về response đúng format
- [ ] Video scanner trả về response đúng format
- [ ] Không có lỗi 503 (missing key)
- [ ] Không có lỗi 401 (invalid key)
- [ ] Response có đủ: status, title, message, confidence

## 🎯 Kết Quả Mong Đợi

Nếu tất cả test đều pass:
- ✅ Backend hoạt động đúng
- ✅ Groq API key hợp lệ
- ✅ Code sẵn sàng gửi cho Người A

Nếu có lỗi:
- Kiểm tra lại `.env.local`
- Kiểm tra Groq API key
- Xem logs trong terminal

---

**Sau khi test xong, bạn có thể xóa các file test này trước khi gửi cho Người A.**


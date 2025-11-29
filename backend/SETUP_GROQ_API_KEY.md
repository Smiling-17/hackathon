# 🔑 Hướng Dẫn Setup Groq API Key

## ⚠️ QUAN TRỌNG

**KHÔNG hardcode API key vào code!** API key phải được lưu trong file `.env.local` (file này không commit lên git).

## 📝 Các Bước Lấy API Key

### Bước 1: Truy Cập Groq Console

1. Mở browser và truy cập: **https://console.groq.com/**
2. Đăng ký tài khoản mới (nếu chưa có) hoặc Đăng nhập

### Bước 2: Tạo API Key

1. Sau khi đăng nhập, truy cập: **https://console.groq.com/keys**
2. Click nút **"Create API Key"** hoặc **"New Key"**
3. Đặt tên cho key (ví dụ: "CyberGuard Hackathon")
4. Copy API key ngay lập tức (key chỉ hiển thị 1 lần!)
   - Key sẽ có dạng: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Bước 3: Lưu API Key

**Cách 1: Tạo file `.env.local` (Khuyến nghị)**

1. Trong root folder của project (cùng cấp với `package.json`)
2. Tạo file mới tên: `.env.local`
3. Thêm vào file:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
4. Thay `gsk_your_actual_key_here` bằng key thật bạn vừa copy

**Cách 2: Copy từ file mẫu**

1. Copy file `.env.example` thành `.env.local`
2. Mở `.env.local` và thay `gsk_your_groq_api_key_here` bằng key thật

### Bước 4: Kiểm Tra

1. Đảm bảo file `.env.local` có trong root folder
2. Đảm bảo key bắt đầu với `gsk_`
3. Không có khoảng trắng thừa
4. Restart dev server: `npm run dev`

## 🔍 Vị Trí File

```
project-root/
├── .env.local          ← File này (KHÔNG commit)
├── .env.example        ← File mẫu (CÓ thể commit)
├── package.json
├── app/
├── components/
└── lib/
    └── groq.ts        ← Code đọc key từ process.env.GROQ_API_KEY
```

## ✅ Code Đã Tự Động Đọc Key

Code trong `lib/groq.ts` đã được viết để tự động đọc key từ `.env.local`:

```typescript
const apiKey = process.env.GROQ_API_KEY;  // ← Đọc từ .env.local
```

**Bạn KHÔNG cần sửa code!** Chỉ cần tạo file `.env.local` với key là xong.

## 🎯 Ai Cần Setup?

### Người B (Bạn - Backend):
- ✅ Code đã sẵn sàng, chỉ cần thêm API key
- Tạo `.env.local` với key của bạn
- Test API endpoints

### Người A (Sau khi ghép code):
- Copy file `.env.example` thành `.env.local`
- Thêm API key vào
- Restart server

## 💡 Tips

1. **Dùng chung key hay key riêng?**
   - Có thể dùng chung 1 key cho cả nhóm (dễ quản lý)
   - Hoặc mỗi người tạo key riêng (an toàn hơn)

2. **Free Tier:**
   - Groq có free tier, đủ cho hackathon
   - Kiểm tra usage trên console.groq.com

3. **Bảo mật:**
   - ✅ File `.env.local` đã được gitignore
   - ❌ KHÔNG commit key lên GitHub
   - ❌ KHÔNG chia sẻ key công khai

## 🐛 Troubleshooting

### Lỗi: "GROQ_API_KEY is missing"
- ✅ Kiểm tra file `.env.local` có tồn tại không
- ✅ Kiểm tra key có đúng format `gsk_...` không
- ✅ Restart dev server sau khi tạo file

### Lỗi: "Invalid Groq API key"
- ✅ Kiểm tra lại key trên console.groq.com
- ✅ Đảm bảo không có khoảng trắng thừa
- ✅ Copy lại key mới nếu cần

### Lỗi: "API error: 401"
- ✅ Key không đúng hoặc đã hết hạn
- ✅ Tạo key mới trên console.groq.com

## 📞 Liên Hệ

Nếu gặp vấn đề:
1. Kiểm tra lại các bước trên
2. Xem logs trong console để biết lỗi cụ thể
3. Kiểm tra key trên console.groq.com

---

**Tóm lại:** Bạn chỉ cần lấy API key từ Groq và tạo file `.env.local` với key đó. Code đã sẵn sàng để đọc key tự động! 🚀


# Hướng dẫn cho Người B - CyberGuard AI

## 📦 Files cần gửi cho Người A

Sau khi hoàn thành code, bạn cần nén và gửi 2 folder sau:

1. **`components/scanners/`** - Chứa 4 components:
   - `ResultCard.tsx`
   - `ImageScanner.tsx`
   - `AudioScanner.tsx`
   - `VideoScanner.tsx`

2. **`app/api/`** - Chứa 4 API routes:
   - `scan-image/route.ts` - ✅ Tích hợp Groq SDK
   - `scan-audio/route.ts` - ✅ Tích hợp Groq SDK
   - `scan-video/route.ts` - ✅ Tích hợp Groq SDK
   - `health/route.ts` - Health check endpoint

3. **`lib/`** - Backend utilities:
   - `groq.ts` - Groq SDK integration (REQUIRES API KEY)
   - `api-utils.ts` - API helper functions (validation, error handling)

## 📝 Cách nén và gửi

### Windows:
1. Chọn 2 folder `components/scanners` và `app/api`
2. Right-click → Send to → Compressed (zipped) folder
3. Hoặc dùng PowerShell:
   ```powershell
   Compress-Archive -Path components\scanners, app\api -DestinationPath PersonB_Code.zip
   ```

### Gửi cho Người A:
- Gửi file zip qua email, Google Drive, hoặc bất kỳ phương tiện nào
- Nhắc Người A xem phần "HƯỚNG DẪN GHÉP CODE" trong prompt.pdf

## ✅ Checklist trước khi gửi

- [ ] Đã tạo đủ 4 scanner components
- [ ] Đã tạo đủ 3 API routes
- [ ] Code không có lỗi syntax
- [ ] Đã test logic cơ bản (nếu có setup project)

## 🔧 Tích hợp Groq SDK (ĐÃ TÍCH HỢP SẴN!)

**✅ Code đã được tích hợp sẵn Groq SDK!** Chỉ cần setup API key:

1. **Lấy Groq API Key:**
   - Truy cập: https://console.groq.com/keys
   - Tạo API key mới (bắt đầu với `gsk_...`)

2. **Tạo file `.env.local`** trong root folder:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```

3. **Cài đặt Groq SDK:**
   ```bash
   npm install groq-sdk
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

**📝 Lưu ý:**
- Code sẽ tự động dùng Groq nếu có API key
- Nếu không có key, sẽ fallback về mock data (vẫn chạy được)
- Xem file `GROQ_INTEGRATION_GUIDE.md` để biết chi tiết

**📁 Files đã có:**
- `lib/groq.ts` - Groq helper functions
- API routes đã được cập nhật để dùng Groq

## 📌 Lưu ý

- Code đã được thiết kế standalone, có thể chạy độc lập
- ResultCard component đã được tạo trong `components/scanners/` để tránh conflict
- Tất cả API routes đều trả về đúng format: `{status, title, message, confidence}`


# 📤 Hướng Dẫn Cho Người A - Ghép Code

## 📦 File Nhận Được

Bạn sẽ nhận được file zip: **`PersonB_Code_Final.zip`**

File này chứa:
1. `components/scanners/` - 4 scanner components
2. `app/api/` - 4 API routes (đã tích hợp Groq SDK)
3. `lib/` - Backend utilities (Groq SDK + API helpers)

## 🔧 Các Bước Ghép Code

### Bước 1: Giải Nén File Zip

1. Giải nén `PersonB_Code_Final.zip`
2. Bạn sẽ có 3 folders: `components/scanners`, `app/api`, `lib`

### Bước 2: Copy Folders Vào Project

1. **Copy `components/scanners/`** vào `components/` của project
   - Kết quả: `components/scanners/` (4 files)

2. **Copy các folder trong `app/api/`** vào `app/api/` của project
   - Copy `scan-image/` → `app/api/scan-image/`
   - Copy `scan-audio/` → `app/api/scan-audio/`
   - Copy `scan-video/` → `app/api/scan-video/`
   - Copy `health/` → `app/api/health/`

3. **Copy `lib/`** vào root của project
   - Copy `lib/groq.ts` → `lib/groq.ts`
   - Copy `lib/api-utils.ts` → `lib/api-utils.ts`

### Bước 3: Cập Nhật `app/page.tsx`

Mở file `app/page.tsx` và:

1. **Import các components:**
```typescript
import ImageScanner from '@/components/scanners/ImageScanner';
import AudioScanner from '@/components/scanners/AudioScanner';
import VideoScanner from '@/components/scanners/VideoScanner';
```

2. **Thay thế các placeholder:**
```typescript
// Tìm và thay thế:
{activeTab === 'image' && (
  <div className="p-12 border-2 border-dashed border-gray-700 text-gray-500 text-center">
    Waiting for ImageScanner Component...
  </div>
)}

// Thành:
{activeTab === 'image' && <ImageScanner />}
```

Làm tương tự cho `audio` và `video`.

### Bước 4: Cài Đặt Dependencies

Chạy lệnh:
```bash
npm install groq-sdk
```

### Bước 5: Cấu Hình Groq API Key

1. Tạo file `.env.local` trong root folder (cùng cấp với `package.json`)

2. Thêm vào file:
```env
GROQ_API_KEY=gsk_your_actual_key_here
```

3. **Lấy API key:**
   - Truy cập: https://console.groq.com/keys
   - Tạo API key mới (bắt đầu với `gsk_...`)
   - Copy và paste vào `.env.local`

### Bước 6: Restart Dev Server

```bash
npm run dev
```

## ✅ Kiểm Tra

### 1. Kiểm Tra Health Endpoint

Mở browser và truy cập: `http://localhost:3000/api/health`

Kết quả mong đợi:
```json
{
  "status": "ok",
  "timestamp": "...",
  "services": {
    "groq": {
      "available": true,
      "message": "Groq API is configured and ready"
    }
  }
}
```

### 2. Test Image Scanner

1. Mở app: `http://localhost:3000`
2. Click tab "📸 Scan Image"
3. Upload một hình ảnh
4. Kiểm tra kết quả trả về

### 3. Test Video Scanner

1. Click tab "🎥 Scan Video"
2. Upload một video file (.mp4)
3. Kiểm tra kết quả trả về

## ⚠️ Lưu Ý Quan Trọng

1. **API Key là BẮT BUỘC:**
   - Nếu không có `GROQ_API_KEY`, API sẽ trả về lỗi 503
   - Code KHÔNG có fallback mock data (theo yêu cầu backend)

2. **ResultCard Component:**
   - Component `ResultCard` đã có trong `components/scanners/ResultCard.tsx`
   - Nếu bạn đã tạo `components/ui/ResultCard.tsx`, có thể xóa hoặc giữ lại
   - Code sẽ tự động dùng `ResultCard` từ `scanners/`

3. **Import Paths:**
   - Tất cả imports dùng alias `@/components/...` và `@/lib/...`
   - Đảm bảo `tsconfig.json` có cấu hình alias đúng

4. **Audio Scanner:**
   - Hiện tại audio scanner cần transcription service
   - Có thể tích hợp Whisper API hoặc AssemblyAI sau

## 🐛 Troubleshooting

### Lỗi: "Module not found: groq-sdk"
**Giải pháp:** Chạy `npm install groq-sdk`

### Lỗi: "GROQ_API_KEY is missing"
**Giải pháp:** 
- Kiểm tra file `.env.local` có tồn tại không
- Kiểm tra key có đúng format `gsk_...` không
- Restart dev server sau khi thêm `.env.local`

### Lỗi: "Invalid Groq API key"
**Giải pháp:**
- Kiểm tra lại API key trên console.groq.com
- Đảm bảo key chưa hết hạn

### Lỗi: Import không tìm thấy component
**Giải pháp:**
- Kiểm tra đã copy đúng folder `components/scanners/` chưa
- Kiểm tra `tsconfig.json` có alias `@/components` chưa

## 📞 Liên Hệ

Nếu gặp vấn đề khi ghép code, hãy:
1. Kiểm tra lại các bước trên
2. Xem file `GROQ_INTEGRATION_GUIDE.md` để biết chi tiết
3. Kiểm tra console logs để xem lỗi cụ thể

## 🎉 Hoàn Thành!

Sau khi ghép code xong, bạn sẽ có:
- ✅ 3 Scanner components hoạt động
- ✅ 4 API routes với Groq SDK
- ✅ Backend utilities đầy đủ
- ✅ Health check endpoint

Chúc bạn thành công! 🚀


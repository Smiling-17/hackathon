# 🔑 Hướng Dẫn Tích Hợp Groq SDK - Người B

## 📋 Tổng Quan

Code đã được chuẩn bị sẵn để tích hợp Groq SDK. Khi có API key, code sẽ tự động sử dụng Groq. Nếu không có key, code sẽ fallback về mock data.

## 🚀 Các Bước Setup

### Bước 1: Lấy Groq API Key

1. Truy cập: https://console.groq.com/
2. Đăng ký/Đăng nhập
3. Vào phần **API Keys**: https://console.groq.com/keys
4. Tạo API key mới
5. Copy key (bắt đầu với `gsk_...`)

### Bước 2: Cài Đặt Groq SDK

Sau khi Người A ghép code, chạy lệnh:

```bash
npm install groq-sdk
```

### Bước 3: Tạo File `.env.local`

Trong root folder của project (cùng cấp với `package.json`), tạo file `.env.local`:

```env
GROQ_API_KEY=gsk_your_actual_api_key_here
```

**⚠️ Lưu ý quan trọng:**
- File `.env.local` đã được gitignore, không commit lên GitHub
- Không chia sẻ API key công khai
- Mỗi người trong nhóm có thể dùng chung 1 key hoặc tạo key riêng

### Bước 4: Kiểm Tra

Sau khi setup xong, code sẽ tự động:
- ✅ Sử dụng Groq API nếu có `GROQ_API_KEY`
- ✅ Fallback về mock data nếu không có key
- ✅ Log warning nếu Groq không available

## 📁 Cấu Trúc Code

### `lib/groq.ts`
File helper chứa:
- `getGroqClient()`: Khởi tạo Groq client
- `analyzeImageWithGroq()`: Phân tích hình ảnh
- `analyzeAudioWithGroq()`: Phân tích audio (cần transcription)
- `analyzeVideoFramesWithGroq()`: Phân tích video frames

### API Routes
Tất cả 3 routes đã được cập nhật:
- `app/api/scan-image/route.ts` ✅
- `app/api/scan-audio/route.ts` ⚠️ (cần thêm transcription service)
- `app/api/scan-video/route.ts` ✅

## 🔧 Chi Tiết Tích Hợp

### 1. Image Scanner ✅ Hoàn Chỉnh

```typescript
// app/api/scan-image/route.ts
try {
  const { analyzeImageWithGroq } = await import('@/lib/groq');
  const analysis = await analyzeImageWithGroq(image);
  return NextResponse.json(analysis);
} catch (groqError) {
  // Fallback to mock
}
```

**Model sử dụng:** `llama-3.2-90b-vision-preview` (Vision model)

### 2. Audio Scanner ⚠️ Cần Thêm Transcription

Hiện tại audio scanner cần:
1. **Audio Transcription Service** (chưa có):
   - Whisper API (OpenAI)
   - AssemblyAI
   - Google Speech-to-Text
   - Hoặc Groq Whisper (nếu có)

2. Sau khi có transcription, code sẽ tự động phân tích với Groq.

**Model sử dụng:** `llama-3.1-70b-versatile`

**Để tích hợp transcription:**
```typescript
// Trong app/api/scan-audio/route.ts
// Thay thế mockTranscription bằng:
const audioBuffer = await audioFile.arrayBuffer();
const transcription = await yourTranscriptionService(audioBuffer);
const analysis = await analyzeAudioWithGroq(transcription);
```

### 3. Video Scanner ✅ Hoàn Chỉnh

```typescript
// app/api/scan-video/route.ts
try {
  const { analyzeVideoFramesWithGroq } = await import('@/lib/groq');
  const analysis = await analyzeVideoFramesWithGroq(frames);
  return NextResponse.json(analysis);
} catch (groqError) {
  // Fallback to mock
}
```

**Model sử dụng:** 
- `llama-3.2-90b-vision-preview` (cho từng frame)
- `llama-3.1-70b-versatile` (cho final analysis)

## 🧪 Testing

### Test với Mock Data (không cần key):
1. Không tạo file `.env.local`
2. Code sẽ tự động dùng mock data
3. Test các tính năng cơ bản

### Test với Groq API:
1. Tạo `.env.local` với API key
2. Cài `groq-sdk`: `npm install groq-sdk`
3. Restart dev server: `npm run dev`
4. Test upload image/video
5. Kiểm tra console logs để xem Groq có được gọi không

## 📊 Response Format

Tất cả Groq responses đều được parse về format chuẩn:

```typescript
{
  status: 'DANGER' | 'SAFE' | 'WARNING' | 'INFO',
  title: string,        // Tiếng Việt
  message: string,      // Tiếng Việt
  confidence: number    // 0-100
}
```

## ⚠️ Lưu Ý Quan Trọng

1. **Rate Limits**: Groq có rate limits, cần xử lý errors
2. **Costs**: Groq có free tier, nhưng cần monitor usage
3. **Audio Transcription**: Cần service riêng (không có trong code hiện tại)
4. **Error Handling**: Code đã có fallback, nhưng nên monitor logs

## 🐛 Troubleshooting

### Lỗi: "Groq client not available"
- ✅ Kiểm tra `.env.local` có tồn tại không
- ✅ Kiểm tra `GROQ_API_KEY` có đúng format không (bắt đầu với `gsk_`)
- ✅ Restart dev server sau khi thêm `.env.local`

### Lỗi: "Module not found: groq-sdk"
- ✅ Chạy: `npm install groq-sdk`

### Lỗi: "API error: 401"
- ✅ API key không đúng hoặc đã hết hạn
- ✅ Kiểm tra lại key trên console.groq.com

### Lỗi: "API error: 429"
- ✅ Đã vượt rate limit
- ✅ Đợi một chút rồi thử lại

## 📝 Checklist

- [ ] Đã lấy Groq API key
- [ ] Đã tạo file `.env.local`
- [ ] Đã cài `groq-sdk`: `npm install groq-sdk`
- [ ] Đã restart dev server
- [ ] Đã test Image Scanner với Groq
- [ ] Đã test Video Scanner với Groq
- [ ] (Optional) Đã tích hợp audio transcription service

## 🎯 Kết Luận

Code đã sẵn sàng để tích hợp Groq! Chỉ cần:
1. Thêm API key vào `.env.local`
2. Cài `groq-sdk`
3. Restart server

Code sẽ tự động sử dụng Groq khi có key, và fallback về mock khi không có.


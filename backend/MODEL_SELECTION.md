# 🎯 Model Selection cho CyberGuard AI

## 💰 Budget: $20

## 📊 Models Đã Chọn

### 1. **Image Scanner** → `llama-4-scout`
- ✅ **VISION model** - Có thể "nhìn" hình ảnh thật
- ✅ **MULTILINGUAL** - Hỗ trợ tiếng Việt tốt
- ✅ **FUNCTION CALLING** - Có thể xử lý phức tạp
- ✅ **Fallback:** `llama-3.3-70b-versatile` nếu Scout không có

**Lý do:** Cần vision để phân tích hình ảnh thật, không chỉ metadata

### 2. **Audio Scanner** → `llama-3.3-70b-versatile`
- ✅ **MULTILINGUAL** - Tốt nhất cho tiếng Việt
- ✅ **TEXT TO TEXT** - Phân tích transcription
- ✅ **REASONING** - Phân tích logic tốt

**Lý do:** Audio cần phân tích text (sau khi transcribe), không cần vision

### 3. **Video Scanner** → `llama-4-scout`
- ✅ **VISION model** - Phân tích từng frame
- ✅ **MULTILINGUAL** - Hỗ trợ tiếng Việt
- ✅ **Fallback:** `llama-3.3-70b-versatile`

**Final Analysis:** `llama-3.3-70b-versatile` (tổng hợp kết quả)

**Lý do:** Cần vision để phát hiện deepfake, manipulation

## 💡 Tại Sao Chọn Các Model Này?

### Llama 4 Scout
- **Mạnh nhất cho Vision** trong danh sách
- Hỗ trợ đầy đủ: Vision + Multilingual + Function Calling
- Phù hợp cho Image & Video scanning

### Llama 3.3 70B
- **Tốt nhất cho tiếng Việt** (Multilingual)
- Mạnh về reasoning và text analysis
- Phù hợp cho Audio analysis và final synthesis

## 📈 Cost Estimation

Với $20, bạn có thể:
- **Llama 4 Scout:** ~$0.01-0.02 per request (vision)
- **Llama 3.3 70B:** ~$0.005-0.01 per request (text)
- **Ước tính:** ~1000-2000 requests với $20

## ✅ Code Đã Cập Nhật

Tất cả models đã được cập nhật trong `lib/groq.ts`:
- ✅ Image: `llama-4-scout` (vision)
- ✅ Audio: `llama-3.3-70b-versatile` (text)
- ✅ Video: `llama-4-scout` (vision) + `llama-3.3-70b-versatile` (final)

## 🚀 Test Ngay

1. Restart server: `npm run dev`
2. Test Image Scanner → Sẽ dùng Llama 4 Scout
3. Test Video Scanner → Sẽ dùng Llama 4 Scout
4. Kiểm tra Groq console → Sẽ thấy usage tăng

---

**Lưu ý:** Nếu Llama 4 Scout không available, code sẽ tự động fallback về Llama 3.3 70B


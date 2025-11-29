# 🔍 Phân Tích Model Sử Dụng Cho Từng Chức Năng

## 📊 Tổng Quan

### ✅ 1. Image Scanner (Phân tích hình ảnh)
**Chức năng:** Phát hiện scam, phishing, nội dung đáng ngờ trong hình ảnh

**Model hiện tại:**
- **Primary:** `llama-4-scout` ✅ ĐÚNG
  - Vision model, hỗ trợ `image_url` trong content
  - Phù hợp cho phân tích hình ảnh
  
- **Fallback:** `llama-3.3-70b-versatile` ❌ **SAI!**
  - Text-only model, KHÔNG hỗ trợ `image_url`
  - Fallback hiện tại KHÔNG thể xử lý image
  - Cần sửa: Nếu llama-4-scout fail, nên throw error rõ ràng hoặc dùng model vision khác

**Vấn đề:**
```typescript
// Fallback code hiện tại (SAI):
model = 'llama-3.3-70b-versatile';
response = await client.chat.completions.create({
  model: model,
  messages: [{
    role: 'user',
    content: `Analyze an image...` // ❌ KHÔNG có image_url!
  }],
});
```

---

### ✅ 2. Audio Scanner (Phân tích audio)
**Chức năng:** Phát hiện scam, voice phishing trong cuộc gọi

**Model hiện tại:**
- **Primary:** `llama-3.3-70b-versatile` ✅ ĐÚNG
  - Text model, phân tích transcription text
  - Multilingual, tốt cho tiếng Việt
  - Phù hợp vì input là text (transcription)

**Lưu ý:** 
- Hiện tại dùng mock transcription
- Cần tích hợp Whisper API hoặc AssemblyAI để có transcription thật

---

### ✅ 3. Video Scanner (Phân tích video)
**Chức năng:** Phát hiện deepfake, manipulation trong video

**Model hiện tại:**
- **Frame Analysis:** `llama-4-scout` ✅ ĐÚNG
  - Vision model, hỗ trợ `image_url` cho từng frame
  - Phù hợp cho phân tích frame
  
- **Fallback:** `llama-3.3-70b-versatile` ❌ **SAI!**
  - Text-only model, KHÔNG hỗ trợ `image_url`
  - Fallback hiện tại KHÔNG thể xử lý frame
  
- **Final Summary:** `llama-3.3-70b-versatile` ✅ ĐÚNG
  - Text model, tổng hợp kết quả từ các frame analyses
  - Input là text (kết quả phân tích frames), không phải image

**Vấn đề:**
```typescript
// Fallback code hiện tại (SAI):
response = await client!.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [{
    role: 'user',
    content: `Analyze a video frame...` // ❌ KHÔNG có image_url!
  }],
});
```

---

## 🚨 Vấn Đề Phát Hiện

### ❌ Vấn đề 1: Image Scanner Fallback
- **Mô tả:** Fallback dùng text-only model nhưng vẫn cố gửi image
- **Hậu quả:** API sẽ fail hoặc ignore image, kết quả không chính xác
- **Giải pháp:** 
  1. Throw error rõ ràng nếu llama-4-scout không available
  2. Hoặc tìm vision model khác làm fallback
  3. Hoặc bỏ fallback, chỉ dùng llama-4-scout

### ❌ Vấn đề 2: Video Frame Analysis Fallback
- **Mô tả:** Tương tự image scanner, fallback không thể xử lý image
- **Hậu quả:** Frame analysis sẽ fail
- **Giải pháp:** Tương tự image scanner

---

## ✅ Giải Pháp Đề Xuất

### Option 1: Bỏ Fallback (Đơn giản nhất)
```typescript
// Nếu llama-4-scout không available, throw error rõ ràng
try {
  response = await client.chat.completions.create({
    model: 'llama-4-scout',
    // ... với image_url
  });
} catch (error) {
  throw new Error('Vision model (llama-4-scout) is not available. Please check Groq API status.');
}
```

### Option 2: Tìm Vision Model Khác (Nếu có)
- Kiểm tra Groq có model vision nào khác không
- Nếu có, dùng làm fallback

### Option 3: Retry với cùng model
- Retry 2-3 lần với llama-4-scout trước khi fail
- Có thể là temporary issue

---

## 📋 Tóm Tắt

| Chức Năng | Model Primary | Model Fallback | Status | Vấn Đề |
|-----------|---------------|----------------|---------|--------|
| **Image Scanner** | `llama-4-scout` (vision) ✅ | `llama-3.3-70b` (text) ❌ | ⚠️ Cần sửa | Fallback không hỗ trợ image |
| **Audio Scanner** | `llama-3.3-70b` (text) ✅ | Không có | ✅ OK | Cần transcription service |
| **Video Frames** | `llama-4-scout` (vision) ✅ | `llama-3.3-70b` (text) ❌ | ⚠️ Cần sửa | Fallback không hỗ trợ image |
| **Video Summary** | `llama-3.3-70b` (text) ✅ | Không có | ✅ OK | Input là text, đúng |

---

## 🎯 Kết Luận

**Models được chọn ĐÚNG cho chức năng:**
- ✅ Image: Vision model (llama-4-scout)
- ✅ Audio: Text model (llama-3.3-70b) - vì input là text
- ✅ Video frames: Vision model (llama-4-scout)
- ✅ Video summary: Text model (llama-3.3-70b) - vì input là text

**Vấn đề cần sửa:**
- ❌ Fallback cho image/video không thể xử lý image
- ⚠️ Cần sửa fallback logic


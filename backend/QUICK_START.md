# 🚀 Quick Start - Setup Groq API Key

## ⚡ 3 Bước Nhanh

### 1️⃣ Lấy API Key
- Truy cập: https://console.groq.com/keys
- Tạo key mới → Copy key (dạng `gsk_...`)

### 2️⃣ Tạo File `.env.local`
Trong root folder, tạo file `.env.local`:
```
GROQ_API_KEY=gsk_paste_key_cua_ban_vao_day
```

### 3️⃣ Restart Server
```bash
npm run dev
```

## ✅ Xong!

Code sẽ tự động đọc key từ `.env.local` và sử dụng Groq API.

## 📍 Vị Trí File

```
D:\Code\Cursor_Hackathon\
├── .env.local          ← Tạo file này ở đây
├── lib\
│   └── groq.ts        ← Code đọc key từ đây
└── ...
```

## ⚠️ Lưu Ý

- ❌ KHÔNG hardcode key vào code
- ✅ Chỉ lưu trong `.env.local`
- ✅ File `.env.local` đã được gitignore

---

**Xem chi tiết:** `SETUP_GROQ_API_KEY.md`


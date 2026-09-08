# LicenseTech - Cổng Tra Cứu & Hướng Dẫn Kỹ Thuật Bản Quyền Phần Mềm (Phong cách Hachihi)

Hệ thống tra cứu chuyên sâu về bản quyền phần mềm (Windows, Microsoft 365, Windows Server CAL, Adobe, AutoCAD), tích hợp Trợ lý AI Chuyên gia Kỹ thuật hỗ trợ Multi-Key Failover tự động chuyển đổi khóa API khi quá tải.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Yêu cầu môi trường
- **Node.js**: Phiên bản 18.0 trở lên
- **npm** hoặc **yarn** / **pnpm**

### 2. Cài đặt các thư viện phụ thuộc
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```
Điền khóa Gemini API của bạn vào file `.env`:
```env
GEMINI_API_KEY=AIzaSy...
# Các khóa dự phòng (cách nhau bởi dấu phẩy, không bắt buộc):
GEMINI_BACKUP_KEYS=AIzaSyBackup1...,AIzaSyBackup2...
# Mật khẩu quản trị viên bảo vệ CMS & Bể khóa Gemini (Mặc định: admin@licensetech2026):
ADMIN_PASSWORD=admin@licensetech2026
```

### 4. Khởi chạy môi trường phát triển (Dev)
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

### 5. Phân Quyền & Truy Cập Quản Trị (CMS)
- **Khách thường**: Không thấy thanh "Quản lý CMS", chỉ xem các chuyên đề kỹ thuật, tra cứu mã lỗi và chat với Trợ lý AI.
- **Quản trị viên**: 
  - Nhấp vào **"🔒 Cổng Quản Trị"** ở dưới chân trang (Footer), hoặc gõ hậu tố `#admin` trên URL (`http://localhost:3000/#admin`).
  - Nhập mật khẩu quản trị (Mặc định: `admin@licensetech2026` hoặc biến môi trường `ADMIN_PASSWORD`).
  - Sau khi đăng nhập, tab **"Quản lý CMS"** sẽ hiển thị đầy đủ trên thanh điều hướng để thêm/sửa/xóa bài viết, danh mục và cấu hình bể khóa Multi-Key Gemini.
  - Có thể đăng xuất bất kỳ lúc nào bằng nút **"Đăng xuất"** trên Header hoặc Footer.

### 6. Build & Chạy bản Production
```bash
npm run build
npm start
```

---

## 🌟 Các Tính Năng Nổi Bật

1. **Giao diện chuẩn phong cách Hachihi**: Nhận diện thương hiệu xanh dương - trắng thanh lịch, hỗ trợ Dark Mode một chạm.
2. **Thư viện chuyên đề & Mã lỗi**:
   - Tra cứu và phân tích mã lỗi kích hoạt phổ biến: `0xC004C008`, `0x803FA067`, `0xC004C020`, `0xC004F074`, `0x80070005`.
   - Cung cấp sẵn các câu lệnh thao tác nhanh qua CMD (`slmgr.vbs`, `ospp.vbs`, `slui 4`).
3. **Trợ lý AI Gemini với Multi-Key Failover**:
   - Tự động luân chuyển khóa dự phòng khi khóa chính gặp sự cố quota (Rate Limit 429) hoặc lỗi mạng.
   - Bảng điều khiển quản lý và đo độ trễ (latency ping) từng khóa trong trang quản trị.
4. **Trang Quản trị CMS**:
   - Quản lý danh mục bài viết.
   - Soạn thảo và cập nhật nội dung bài viết hỗ trợ Markdown.
   - Quản lý hộp thư tiếp nhận yêu cầu tư vấn doanh nghiệp.
5. **Form Liên hệ & Giới thiệu**: Tiếp nhận thông tin nhu cầu bản quyền và kiểm toán SAM.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
├── server.ts               # Máy chủ Express & Vite middleware
├── server/
│   ├── dataStore.ts        # Lưu trữ dữ liệu danh mục, bài viết và hộp thư
│   └── keyPool.ts          # Bộ điều phối bể khóa Multi-Key Failover Gemini
├── src/
│   ├── App.tsx             # Luồng điều hướng và State ứng dụng chính
│   ├── components/         # Các module giao diện (Header, Home, Articles, CMS, Chatbot,...)
│   └── data/               # Dữ liệu hạt giống mặc định (seed data)
└── package.json            # Cấu hình dependency & scripts
```

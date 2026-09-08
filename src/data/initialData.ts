import { Category, Article, KeyPoolItem } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-windows',
    name: 'Hệ điều hành & Windows',
    slug: 'he-dieu-hanh-windows',
    description: 'Hướng dẫn kích hoạt, quản lý key bản quyền Windows 10/11 Pro, Enterprise, OEM và Retail.',
    icon: 'Monitor',
    color: 'blue',
    articleCount: 3,
  },
  {
    id: 'cat-office',
    name: 'Bộ ứng dụng văn phòng & M365',
    slug: 'office-microsoft-365',
    description: 'Xử lý lỗi bản quyền Microsoft 365, Office LTSC 2021/2024, câu lệnh quản lý OSPP.vbs.',
    icon: 'FileSpreadsheet',
    color: 'emerald',
    articleCount: 2,
  },
  {
    id: 'cat-server',
    name: 'Máy chủ & Windows Server CAL',
    slug: 'may-chu-server-cal',
    description: 'Quy tắc cấp phép Core License, Client Access License (User CAL, Device CAL, RDS CAL).',
    icon: 'Server',
    color: 'indigo',
    articleCount: 1,
  },
  {
    id: 'cat-design',
    name: 'Đồ họa & Kỹ thuật (Adobe / CAD)',
    slug: 'adobe-autodesk',
    description: 'Giấy phép Adobe Creative Cloud for Teams, Autodesk AutoCAD Flex và chính sách Named User.',
    icon: 'Layers',
    color: 'purple',
    articleCount: 1,
  },
  {
    id: 'cat-audit',
    name: 'Kiểm toán & Tuân thủ Pháp lý SAM',
    slug: 'kiem-toan-tuan-thu',
    description: 'Cẩm nang rà soát tài sản phần mềm (SAM), hóa đơn VAT, chứng thư COA và EULA hợp lệ.',
    icon: 'ShieldCheck',
    color: 'amber',
    articleCount: 1,
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-001',
    title: 'Khắc phục triệt để mã lỗi kích hoạt Windows 10/11: 0xC004C008, 0x803FA067 và 0xC004C020',
    slug: 'khac-phuc-ma-loi-kich-hoat-windows-0xc004c008',
    categoryId: 'cat-windows',
    summary: 'Phân tích nguyên nhân máy chủ kích hoạt từ chối Product Key khi nâng cấp phần cứng hoặc chuyển đổi bo mạch chủ và hướng dẫn khắc phục chi tiết qua lệnh slmgr và Phone Activation.',
    difficulty: 'Trung cấp',
    status: 'published',
    views: 1420,
    updatedAt: '2026-03-01T10:00:00Z',
    author: 'Kỹ sư Bản quyền Vũ Hoàng Minh',
    tags: ['Windows 11', 'Lỗi 0xC004C008', 'Kích hoạt Phone', 'slmgr.vbs', 'Hardware Hash'],
    relatedErrorCodes: ['0xC004C008', '0x803FA067', '0xC004C020', '0xC004F074'],
    commands: [
      { cmd: 'slmgr.vbs /dli', description: 'Hiển thị thông tin bản quyền và 5 ký tự cuối của key' },
      { cmd: 'slmgr.vbs /xpr', description: 'Kiểm tra ngày hết hạn bản quyền (Vĩnh viễn hay có thời hạn)' },
      { cmd: 'slui 4', description: 'Mở trình kích hoạt điện thoại tự phục vụ (Self-Service Phone Activation)' },
      { cmd: 'slmgr.vbs /ato', description: 'Gửi yêu cầu kích hoạt lại tới máy chủ Microsoft' },
    ],
    content: `## 1. Tổng quan về lỗi 0xC004C008 và 0x803FA067

Khi tiến hành kích hoạt Windows 10 hoặc Windows 11, một trong những thông báo phổ biến nhất là:
> **Error Code: 0xC004C008** - *The activation server determined that the specified product key could not be used.*

### Nguyên nhân cốt lõi:
- **Giới hạn số lần kích hoạt qua Internet (Activation Limit Exceeded):** Mỗi Product Key dạng Retail có một hạn mức kích hoạt trực tuyến nhất định. Khi bạn cài lại hệ điều hành nhiều lần hoặc nâng cấp phần cứng (CPU, Mainboard, ổ cứng NVMe), hash phần cứng (Hardware Hash) thay đổi, máy chủ kích hoạt coi đây là một thiết bị hoàn toàn mới.
- **Lỗi 0x803FA067:** Thường xảy ra khi người dùng nâng cấp từ Windows Home lên Windows Pro bằng key bản quyền nhưng máy tính chưa nhận diện đúng phiên bản SKU mục tiêu.

---

## 2. Quy trình xử lý bằng lệnh Command Prompt (CMD)

### Bước 1: Kiểm tra tình trạng giấy phép hiện tại
Mở **Command Prompt (CMD)** với quyền **Administrator**:
\`\`\`cmd
slmgr.vbs /dli
\`\`\`
Cửa sổ Windows Script Host sẽ hiển thị:
- **Name:** Phiên bản Windows
- **Description:** Kênh phân phối (OEM_COA, RETAIL, hoặc VOLUME_KMS)
- **Partial Product Key:** 5 ký tự cuối của khóa hiện tại

### Bước 2: Kích hoạt bằng cổng Phone Activation tự phục vụ (Self-Service)
\`\`\`cmd
slui 4
\`\`\`
Chọn khu vực **Vietnam**, lấy dãy **Installation ID (IID)** gồm 9 nhóm số và gọi tổng đài miễn cước Microsoft Việt Nam hoặc truy cập \`microsoft.gointeract.io\` để nhận **Confirmation ID (CID)**.`,
  },
  {
    id: 'art-002',
    title: 'So sánh chi tiết bản quyền Windows: OEM, Retail (FPP) và Volume Licensing (KMS/MAK)',
    slug: 'so-sanh-windows-oem-retail-volume-licensing',
    categoryId: 'cat-windows',
    summary: 'Bảng đối chiếu toàn diện về tính pháp lý, quyền chuyển đổi thiết bị, chi phí đầu tư và phương thức triển khai cho người dùng cá nhân lẫn doanh nghiệp vừa và lớn.',
    difficulty: 'Cơ bản',
    status: 'published',
    views: 2890,
    updatedAt: '2026-03-02T14:30:00Z',
    author: 'Chuyên gia Pháp chế Đỗ Quốc Thắng',
    tags: ['OEM', 'Retail FPP', 'KMS Server', 'MAK Key', 'Doanh nghiệp'],
    relatedErrorCodes: ['0xC004F074', '0xC004C003'],
    commands: [{ cmd: 'slmgr.vbs /dlv', description: 'Xem chi tiết License Channel và hạn thời gian KMS' }],
    content: `## Bản quyền phần mềm Windows gồm những hình thức nào?

Rất nhiều doanh nghiệp tại Việt Nam gặp rủi ro pháp lý khi kiểm toán phần mềm chỉ vì không phân biệt được ranh giới giữa giấy phép OEM và giấy phép Doanh nghiệp.

### 1. OEM (Original Equipment Manufacturer)
- **Đặc điểm:** Bản quyền được nhà sản xuất phần cứng nhúng trực tiếp vào BIOS/UEFI.
- **Ràng buộc:** **Không được phép chuyển nhượng** sang máy tính khác khi máy tính cũ hỏng.

### 2. Retail (FPP - Full Packaged Product)
- **Đặc điểm:** Mua lẻ dạng hộp hoặc Digital License.
- **Ưu điểm:** **Được phép chuyển giao sang máy mới** (1 máy tại 1 thời điểm).

### 3. Volume Licensing (KMS / MAK)
- Dành cho doanh nghiệp từ 5 thiết bị trở lên với máy chủ KMS hoặc mã MAK tập trung.`,
  },
  {
    id: 'art-003',
    title: 'Xử lý triệt để lỗi "Unlicensed Product" và xung đột nhiều Product Key trên Office 365 / Office 2021',
    slug: 'xu-ly-xung-dot-nhieu-key-office-bang-ospp',
    categoryId: 'cat-office',
    summary: 'Hướng dẫn sử dụng công cụ OSPP.VBS có sẵn của Microsoft để kiểm tra danh sách key đệm, xóa key trial hết hạn và kích hoạt lại license bản quyền chính hãng.',
    difficulty: 'Trung cấp',
    status: 'published',
    views: 3105,
    updatedAt: '2026-03-03T09:15:00Z',
    author: 'Kỹ sư Bản quyền Vũ Hoàng Minh',
    tags: ['Office 365', 'Office 2021', 'OSPP.vbs', 'Unlicensed Product'],
    relatedErrorCodes: ['0x80070005', '0x80041015'],
    commands: [
      { cmd: 'cscript ospp.vbs /dstatus', description: 'Liệt kê danh sách tất cả các key Office đang lưu đệm' },
      { cmd: 'cscript ospp.vbs /unpkey:XXXXX', description: 'Gỡ bỏ 5 ký tự cuối của key Office bị xung đột' },
      { cmd: 'cscript ospp.vbs /act', description: 'Thực thi lệnh kích hoạt lại Office ngay lập tức' },
    ],
    content: `## Tại sao Office báo lỗi "Unlicensed Product"?
Thường xảy ra khi máy tính trước đây từng cài đặt bản Office dùng thử hoặc crack, thông tin key cũ vẫn bị lưu đệm trong registry.

### Các bước thao tác với OSPP.VBS:
\`\`\`cmd
cd "C:\\Program Files\\Microsoft Office\\Office16"
cscript ospp.vbs /dstatus
\`\`\`
Xem 5 ký tự cuối của key cũ và gỡ bằng:
\`\`\`cmd
cscript ospp.vbs /unpkey:ABCDE
cscript ospp.vbs /act
\`\`\``,
  },
];

export const INITIAL_KEYS: KeyPoolItem[] = [
  {
    id: 'key-primary',
    label: 'Khóa chính (Primary Gemini)',
    maskedKey: 'AQ.Ab8...v_0A',
    status: 'active',
    isPrimary: true,
    totalRequests: 0,
    successCount: 0,
    failureCount: 0,
  },
];

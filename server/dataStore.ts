export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  articleCount?: number;
}

export type ArticleDifficulty = 'Cơ bản' | 'Trung cấp' | 'Chuyên sâu';
export type ArticleStatus = 'published' | 'draft';

export interface Article {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  summary: string;
  content: string;
  tags: string[];
  difficulty: ArticleDifficulty;
  status: ArticleStatus;
  views: number;
  updatedAt: string;
  author: string;
  relatedErrorCodes?: string[];
  commands?: {
    cmd: string;
    description: string;
  }[];
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  softwareType: string;
  inquiryType: 'activation_error' | 'new_license' | 'license_audit' | 'renewal' | 'general';
  message: string;
  createdAt: string;
  status: 'new' | 'in_progress' | 'resolved';
}

class DataStore {
  public categories: Category[] = [
    {
      id: 'cat-windows',
      name: 'Hệ điều hành & Windows',
      slug: 'he-dieu-hanh-windows',
      description: 'Hướng dẫn kích hoạt, quản lý key bản quyền Windows 10/11 Pro, Enterprise, OEM và Retail.',
      icon: 'Monitor',
      color: 'blue',
    },
    {
      id: 'cat-office',
      name: 'Bộ ứng dụng văn phòng & M365',
      slug: 'office-microsoft-365',
      description: 'Kích hoạt Office 2019/2021/365, lệnh OSPP.vbs, quản lý tài khoản doanh nghiệp Cloud.',
      icon: 'FileSpreadsheet',
      color: 'sky',
    },
    {
      id: 'cat-server',
      name: 'Hạ tầng Máy chủ & Server CAL',
      slug: 'may-chu-server-cal',
      description: 'Cách tính Core License cho Windows Server 2022, phân bổ Device CAL và User CAL, RDS CAL.',
      icon: 'Server',
      color: 'indigo',
    },
    {
      id: 'cat-creative',
      name: 'Đồ họa & Kỹ thuật (Adobe & Autodesk)',
      slug: 'adobe-autodesk',
      description: 'Chính sách cấp phép Named User Adobe CC, bản quyền AutoCAD, Revit, 3ds Max theo token Flex.',
      icon: 'PenTool',
      color: 'cyan',
    },
    {
      id: 'cat-dev',
      name: 'Lập trình & Open Source Licensing',
      slug: 'lap-trinh-open-source',
      description: 'Rủi ro pháp lý giấy phép mã nguồn mở GPLv3, MIT, Apache 2.0 trong các dự án phần mềm thương mại.',
      icon: 'Code',
      color: 'emerald',
    },
    {
      id: 'cat-compliance',
      name: 'Kiểm toán & Tuân thủ Bản quyền',
      slug: 'kiem-toan-tuan-thu',
      description: 'Quy trình chuẩn bị kiểm toán SAM (Software Asset Management) và đối phó rủi ro vi phạm bản quyền.',
      icon: 'ShieldCheck',
      color: 'teal',
    },
  ];

  public articles: Article[] = [
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
Mở **Command Prompt (CMD)** với quyền **Administrator** (nhấp chuột phải vào Command Prompt > Run as Administrator):
\`\`\`cmd
slmgr.vbs /dli
\`\`\`
Cửa sổ Windows Script Host sẽ hiển thị:
- **Name:** Phiên bản Windows (vd: Windows(R) Professional edition)
- **Description:** Kênh phân phối (OEM_COA, RETAIL, hoặc VOLUME_KMS)
- **Partial Product Key:** 5 ký tự cuối của khóa hiện tại
- **License Status:** Trạng thái (Licensed hoặc Notification)

### Bước 2: Kích hoạt bằng cổng Phone Activation tự phục vụ (Self-Service)
Nếu key của bạn là key Retail chính hãng, hãy kích hoạt qua kênh hỗ trợ điện thoại:
1. Nhấn tổ hợp phím **Windows + R**, nhập:
\`\`\`cmd
slui 4
\`\`\`
2. Chọn khu vực **Vietnam** trong danh sách quốc gia.
3. Màn hình sẽ cung cấp **Installation ID (IID)** gồm 9 nhóm số (mỗi nhóm 7 chữ số: từ Block 1 đến Block 9).
4. Gọi đến tổng đài miễn cước Microsoft Việt Nam: \`1800 400 470\` hoặc truy cập đường dẫn tự phục vụ chính thức của Microsoft: \`https://microsoft.gointeract.io\`.
5. Cung cấp Installation ID, hệ thống sẽ xác nhận và cấp lại chuỗi **Confirmation ID (CID)** gồm 8 nhóm (từ A đến H).
6. Nhập Confirmation ID vào giao diện để hoàn tất kích hoạt vĩnh viễn.

### Mẹo nhanh: Nhập Confirmation ID trực tiếp bằng lệnh
\`\`\`cmd
slmgr.vbs /atp <Dãy_Confirmation_ID_Không_Có_Dấu_Gạch>
slmgr.vbs /ato
\`\`\``,
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
      commands: [
        { cmd: 'slmgr.vbs /dlv', description: 'Xem chi tiết License Channel và hạn thời gian KMS' },
      ],
      content: `## Bản quyền phần mềm Windows gồm những hình thức nào?

Rất nhiều doanh nghiệp tại Việt Nam gặp rủi ro pháp lý khi kiểm toán phần mềm chỉ vì không phân biệt được ranh giới giữa giấy phép OEM và giấy phép Doanh nghiệp.

### 1. OEM (Original Equipment Manufacturer)
- **Đặc điểm:** Bản quyền được nhà sản xuất phần cứng (Dell, HP, Lenovo, Asus) mua số lượng lớn và nhúng trực tiếp vào BIOS/UEFI của bo mạch chủ.
- **Ưu điểm:** Giá thành rẻ nhất, tự động kích hoạt khi cài lại Windows cùng phiên bản.
- **Nhược điểm:** **Không được phép chuyển nhượng** sang máy tính khác khi máy tính cũ hỏng. Nếu thay thế Motherboard, bản quyền OEM sẽ mất hiệu lực pháp lý trừ trường hợp bảo hành chính hãng có biên bản thay thế.

### 2. Retail (FPP - Full Packaged Product)
- **Đặc điểm:** Bản quyền mua lẻ theo hộp hoặc dạng Digital License điện tử qua Microsoft Store.
- **Ưu điểm:** **Được phép chuyển giao sang máy tính mới** (chỉ sử dụng trên 1 máy tại 1 thời điểm). Gắn liền trực tiếp với tài khoản Microsoft cá nhân (MSA).
- **Nhược điểm:** Chi phí đầu tư ban đầu cao hơn bản OEM.

### 3. Volume Licensing (Giấy phép số lượng lớn cho Doanh nghiệp)
- **KMS (Key Management Service):** Doanh nghiệp thiết lập một máy chủ KMS nội bộ. Các máy trạm kết nối vào mạng LAN để kích hoạt tự động và tự gia hạn chu kỳ 180 ngày một lần. Thích hợp từ 25 máy trở lên.
- **MAK (Multiple Activation Key):** Một khóa đơn dùng để kích hoạt một số lượng máy trạm cố định thông qua máy chủ kích hoạt của Microsoft.`,
    },
    {
      id: 'art-003',
      title: 'Quản lý bản quyền Office 2021/365 qua script OSPP.VBS và khắc phục lỗi "Unlicensed Product"',
      slug: 'quan-ly-ban-quyen-office-ospp-vbs',
      categoryId: 'cat-office',
      summary: 'Hướng dẫn sử dụng công cụ kịch bản Office Software Protection Platform (OSPP.VBS) để kiểm tra, thay thế khóa bản quyền và xóa bỏ các key trial bị lưu đệm gây lỗi.',
      difficulty: 'Trung cấp',
      status: 'published',
      views: 1980,
      updatedAt: '2026-03-03T09:15:00Z',
      author: 'Kỹ sư Bản quyền Vũ Hoàng Minh',
      tags: ['Office 365', 'Office 2021', 'ospp.vbs', 'Unlicensed Product', 'CMD'],
      relatedErrorCodes: ['0x80070005', '0x80041015'],
      commands: [
        { cmd: 'cscript ospp.vbs /dstatus', description: 'Liệt kê tất cả Product Key Office đang cài trong máy' },
        { cmd: 'cscript ospp.vbs /unpkey:XXXXX', description: 'Gỡ bỏ key thừa bị xung đột (5 ký tự cuối)' },
        { cmd: 'cscript ospp.vbs /act', description: 'Kích hoạt lại bản quyền Office ngay lập tức' },
      ],
      content: `## Tại sao Office báo lỗi "Unlicensed Product" dù đã nhập key bản quyền?

Hiện tượng này thường xảy ra khi:
1. Máy tính trước đây từng cài đặt bản Office dùng thử (Trial) hoặc bản Office kích hoạt lậu, thông tin key cũ vẫn bị lưu đệm trong Windows Registry.
2. Tài khoản Microsoft 365 cơ quan bị xung đột với tài khoản cá nhân.

---

## Các bước thao tác với OSPP.VBS

### Bước 1: Mở Command Prompt và điều hướng tới thư mục Office
Mở CMD với quyền **Run as Administrator**:
- Với Office 64-bit cài trên Windows 64-bit:
\`\`\`cmd
cd "C:\\Program Files\\Microsoft Office\\Office16"
\`\`\`
- Với Office 32-bit:
\`\`\`cmd
cd "C:\\Program Files (x86)\\Microsoft Office\\Office16"
\`\`\`

### Bước 2: Kiểm tra danh sách key đang tồn tại
\`\`\`cmd
cscript ospp.vbs /dstatus
\`\`\`
Xem kết quả xuất hiện, chú ý các dòng:
- **LICENSE STATUS:** ---LICENSED--- hoặc ---NOTIFICATIONS---
- **Last 5 characters of installed product key:** \`ABCDE\`

### Bước 3: Gỡ bỏ key cũ xung đột
Nếu thấy xuất hiện key lạ hoặc key của bản dùng thử cũ, gỡ bỏ bằng lệnh:
\`\`\`cmd
cscript ospp.vbs /unpkey:ABCDE
\`\`\`

### Bước 4: Nhập Product Key mới và kích hoạt
\`\`\`cmd
cscript ospp.vbs /inpkey:XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
cscript ospp.vbs /act
\`\`\`
Mở lại ứng dụng Word hoặc Excel, vào **File > Account** để kiểm tra trạng thái **Product Activated**.`,
    },
    {
      id: 'art-004',
      title: 'Công thức tính Core License và Client Access License (CAL) cho Windows Server 2022 & SQL Server',
      slug: 'cong-thuc-tinh-core-license-cal-windows-server',
      categoryId: 'cat-server',
      summary: 'Quy tắc cấp phép dựa trên số nhân (Core-based licensing) của Microsoft, cách tính số gói bản quyền 2-Core/16-Core và phân biệt chính xác giữa User CAL và Device CAL.',
      difficulty: 'Chuyên sâu',
      status: 'published',
      views: 3120,
      updatedAt: '2026-03-04T16:00:00Z',
      author: 'Chuyên gia Hạ tầng Nguyễn Quang Huy',
      tags: ['Windows Server 2022', 'SQL Server', 'Core Licensing', 'User CAL', 'Device CAL'],
      content: `## 1. Quy tắc cấp phép Core License cho Windows Server

Từ phiên bản Windows Server 2016 trở đi, Microsoft chuyển hoàn toàn từ mô hình cấp phép theo bộ xử lý (Per-Processor) sang **mô hình theo số nhân xử lý (Per-Core)**.

### Bộ 3 nguyên tắc vàng:
1. **Quy tắc CPU:** Mọi CPU vật lý (Physical Processor) trên máy chủ đều phải được cấp phép tối thiểu **8 Cores**.
2. **Quy tắc Máy chủ:** Mọi máy chủ vật lý (Physical Server) đều phải được cấp phép tối thiểu **16 Cores**.
3. **Quy tắc phủ sóng (Full Coverage):** Mọi core vật lý đang hoạt động đều phải có license tương ứng.

### Ví dụ minh họa thực tế:
- **Trường hợp A:** Máy chủ có 1 CPU, 8 Cores -> Cần mua **16 Cores** (do quy tắc tối thiểu cho máy chủ là 16).
- **Trường hợp B:** Máy chủ có 2 CPU, mỗi CPU 8 Cores (Tổng 16 Cores) -> Mua vừa đủ gói cơ bản **16-Core Base Pack**.
- **Trường hợp C:** Máy chủ Dell PowerEdge có 2 CPU x 16 Cores = 32 Cores -> Cần mua: 1 gói 16-Core Base Pack + 8 gói bổ sung 2-Core Add-on Pack.

---

## 2. Phân biệt User CAL và Device CAL

Mỗi khi người dùng hoặc thiết bị truy cập vào dịch vụ của Windows Server (như File Sharing, Active Directory, DNS, DHCP), doanh nghiệp **bắt buộc phải mua thêm giấy phép truy cập khách hàng (CAL)**.

| Tiêu chí so sánh | User CAL | Device CAL |
| :--- | :--- | :--- |
| **Bản chất** | Gắn với 1 người dùng cụ thể | Gắn với 1 thiết bị đầu cuối cụ thể |
| **Môi trường phù hợp** | Nhân viên làm việc linh hoạt, dùng laptop, PC, điện thoại | Máy tính dùng chung tại xưởng sản xuất, quầy thu ngân, ca kíp trực |
| **Tối ưu chi phí** | Tiết kiệm khi 1 người dùng sở hữu nhiều thiết bị | Tiết kiệm khi nhiều nhân viên dùng chung 1 máy tính |`,
    },
    {
      id: 'art-005',
      title: 'Quản trị giấy phép Adobe Creative Cloud for Teams vs Enterprise: Hướng dẫn Named User',
      slug: 'quan-tri-giay-phep-adobe-creative-cloud',
      categoryId: 'cat-creative',
      summary: 'Tìm hiểu cơ chế cấp phép Named User Deployment của Adobe qua Admin Console, cách thu hồi và phân bổ lại bản quyền cho nhân viên mới mà không làm gián đoạn tài sản số.',
      difficulty: 'Trung cấp',
      status: 'published',
      views: 1150,
      updatedAt: '2026-03-05T11:20:00Z',
      author: 'Chuyên gia IT Enterprise Lê Tuấn Anh',
      tags: ['Adobe CC', 'Photoshop', 'Illustrator', 'Admin Console', 'Named User'],
      content: `## Sự chuyển dịch từ Serial Number sang Named User

Trước đây, Adobe cung cấp dạng khóa Serial Number truyền thống. Hiện nay, 100% bản quyền thương mại của Adobe Creative Cloud đã chuyển sang mô hình **Named User Licensing** dựa trên định danh tài khoản Adobe ID (hoặc Federated ID tích hợp SSO Azure AD).

### Ưu điểm của Named User:
- **Tự do cài đặt:** Mỗi người dùng được phép cài đặt bộ ứng dụng Adobe CC trên **2 thiết bị** (ví dụ: máy tính bàn tại văn phòng và laptop cá nhân ở nhà).
- **Bảo mật dữ liệu:** Lưu trữ đám mây Creative Cloud Libraries và font chữ Typekit được đồng bộ tức thì.
- **Thu hồi giấy phép linh hoạt:** Khi nhân sự nghỉ việc, quản trị viên chỉ cần vào \`adminconsole.adobe.com\`, gỡ tài khoản của nhân viên đó. Giấy phép ngay lập tức được giải phóng để cấp cho nhân sự mới mà không cần can thiệp vào máy tính vật lý.`,
    },
    {
      id: 'art-006',
      title: 'Bộ Checklist chuẩn bị kiểm toán bản quyền phần mềm (Software License Audit) cho Doanh nghiệp',
      slug: 'checklist-kiem-toan-ban-quyen-phan-mem',
      categoryId: 'cat-compliance',
      summary: 'Các tài liệu pháp lý bắt buộc phải lưu trữ (Hóa đơn VAT, COA, EULA), rủi ro pháp lý theo Luật Sở hữu trí tuệ Việt Nam và phương pháp rà soát nội bộ với phần mềm quét SAM.',
      difficulty: 'Chuyên sâu',
      status: 'published',
      views: 2450,
      updatedAt: '2026-03-06T08:00:00Z',
      author: 'Luật sư Trần Văn Bảo - Chuyên gia SHTT',
      tags: ['Kiểm toán SAM', 'Thanh tra bản quyền', 'Hóa đơn VAT', 'COA', 'Luật SHTT'],
      content: `## 1. Cơ sở pháp lý tại Việt Nam

Theo Điều 225 Bộ luật Hình sự Việt Nam và Luật Sở hữu trí tuệ sửa đổi, hành vi sao chép, sử dụng phần mềm máy tính không có sự đồng ý của chủ sở hữu quyền tác giả với mục đích thương mại có thể bị xử phạt hành chính từ hàng trăm triệu đồng hoặc bị truy cứu trách nhiệm hình sự.

### 2. Danh mục tài liệu chứng minh quyền sử dụng hợp pháp
Khi nhận được thông báo kiểm toán (từ BSA hoặc các hãng phần mềm như Microsoft, Autodesk, Dassault Systèmes), doanh nghiệp cần chuẩn bị 4 loại hồ sơ:
1. **Hóa đơn giá trị gia tăng (VAT Invoice):** Phải thể hiện đúng tên công ty, phiên bản phần mềm và số lượng bản quyền.
2. **Chứng thư xác thực bản quyền (COA - Certificate of Authenticity):** Tem nhãn dán trên thân máy hoặc giấy chứng nhận cấp phép điện tử (Electronic License Certificate).
3. **Thỏa thuận cấp phép người dùng cuối (EULA):** Điều khoản dịch vụ và tài khoản quản trị Portal (CSP Portal, Volume Licensing Service Center).
4. **Báo cáo kiểm kê tài sản phần mềm (SAM Report):** Danh sách toàn bộ PC/Laptop kèm địa chỉ MAC, tên người sử dụng và phiên bản cài đặt thực tế.`,
    },
  ];

  public contactInquiries: ContactInquiry[] = [
    {
      id: 'inq-001',
      fullName: 'Trần Đình Trọng',
      email: 'trong.tran@techvibe.vn',
      phone: '0912345678',
      company: 'TechVibe Solution Corp',
      softwareType: 'Windows Server & SQL Server',
      inquiryType: 'new_license',
      message: 'Công ty chúng tôi đang chuẩn bị mua mới hệ thống máy chủ 32 core và cần tư vấn cấu hình gói Core License kèm 50 User CAL tối ưu chi phí.',
      createdAt: '2026-03-07T09:30:00Z',
      status: 'new',
    },
    {
      id: 'inq-002',
      fullName: 'Nguyễn Thị Thu Hà',
      email: 'ha.nguyen@architech.com.vn',
      phone: '0987654321',
      company: 'ArchiTech Vietnam',
      softwareType: 'Autodesk AutoCAD & Revit',
      inquiryType: 'license_audit',
      message: 'Chúng tôi nhận được thư rà soát bản quyền từ đại diện hãng và muốn thuê dịch vụ rà soát nội bộ, đối soát hóa đơn chứng từ trước đợt kiểm tra.',
      createdAt: '2026-03-08T04:15:00Z',
      status: 'in_progress',
    },
  ];

  // Helper functions
  public getCategories(): (Category & { articleCount: number })[] {
    return this.categories.map((c) => ({
      ...c,
      articleCount: this.articles.filter((a) => a.categoryId === c.id && a.status === 'published').length,
    }));
  }

  public getCategoryById(id: string): Category | undefined {
    return this.categories.find((c) => c.id === id);
  }

  public addCategory(cat: Omit<Category, 'id'>): Category {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
    };
    this.categories.push(newCat);
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  public deleteCategory(id: string): boolean {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.categories.splice(index, 1);
    return true;
  }

  public getArticles(filters?: { categoryId?: string; search?: string; status?: ArticleStatus }): Article[] {
    let list = [...this.articles];
    if (filters?.categoryId) {
      list = list.filter((a) => a.categoryId === filters.categoryId);
    }
    if (filters?.status) {
      list = list.filter((a) => a.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.relatedErrorCodes?.some((c) => c.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getArticleById(id: string): Article | undefined {
    return this.articles.find((a) => a.id === id);
  }

  public incrementArticleViews(id: string): void {
    const article = this.articles.find((a) => a.id === id);
    if (article) {
      article.views++;
    }
  }

  public addArticle(art: Omit<Article, 'id' | 'views' | 'updatedAt'>): Article {
    const newArt: Article = {
      ...art,
      id: `art-${Date.now()}`,
      views: 0,
      updatedAt: new Date().toISOString(),
    };
    this.articles.unshift(newArt);
    return newArt;
  }

  public updateArticle(id: string, updates: Partial<Article>): Article | null {
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.articles[index] = {
      ...this.articles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.articles[index];
  }

  public deleteArticle(id: string): boolean {
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.articles.splice(index, 1);
    return true;
  }

  public addContactInquiry(inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>): ContactInquiry {
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    this.contactInquiries.unshift(newInquiry);
    return newInquiry;
  }

  public getContactInquiries(): ContactInquiry[] {
    return this.contactInquiries;
  }
}

export const dataStore = new DataStore();

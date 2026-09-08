import { GoogleGenAI } from '@google/genai';

export type KeyStatus = 'active' | 'standby' | 'rate_limited' | 'error';

export interface KeyRecord {
  id: string;
  key: string;
  label: string;
  status: KeyStatus;
  isPrimary: boolean;
  totalRequests: number;
  successCount: number;
  failureCount: number;
  lastUsed?: string;
  latencyMs?: number;
  lastError?: string;
}

export interface MaskedKeyRecord {
  id: string;
  label: string;
  maskedKey: string;
  status: KeyStatus;
  isPrimary: boolean;
  totalRequests: number;
  successCount: number;
  failureCount: number;
  lastUsed?: string;
  latencyMs?: number;
  lastError?: string;
}

class KeyPoolManager {
  private keys: KeyRecord[] = [];
  private failoverHistory: {
    timestamp: string;
    fromKey: string;
    toKey: string;
    reason: string;
  }[] = [];

  constructor() {
    this.initFromEnv();
  }

  public maskKey(key: string): string {
    if (!key) return 'N/A';
    const trimmed = key.trim();
    if (trimmed.length <= 8) return '****' + trimmed.slice(-4);
    return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
  }

  private initFromEnv() {
    const primaryKey = process.env.GEMINI_API_KEY?.trim();
    if (primaryKey) {
      this.keys.push({
        id: 'key-primary',
        key: primaryKey,
        label: 'Khóa chính (Primary Env)',
        status: 'active',
        isPrimary: true,
        totalRequests: 0,
        successCount: 0,
        failureCount: 0,
      });
    }

    // Additional env keys
    const backupKeysEnv = process.env.GEMINI_BACKUP_KEYS || '';
    const extraEnvKeys = [
      process.env.GEMINI_API_KEY_2?.trim(),
      process.env.GEMINI_API_KEY_3?.trim(),
      ...backupKeysEnv.split(',').map((k) => k.trim()).filter(Boolean),
    ].filter(Boolean) as string[];

    extraEnvKeys.forEach((k, idx) => {
      if (k && !this.keys.some((item) => item.key === k)) {
        this.keys.push({
          id: `key-env-backup-${idx + 1}`,
          key: k,
          label: `Khóa dự phòng Env #${idx + 1}`,
          status: 'standby',
          isPrimary: false,
          totalRequests: 0,
          successCount: 0,
          failureCount: 0,
        });
      }
    });

    // Provide default fallback demo keys if no environment key is supplied
    if (this.keys.length === 0) {
      this.keys.push({
        id: 'key-default-demo',
        key: 'AIzaSyDemoKeyPrimary_DefaultPlaceholder01',
        label: 'Khóa mặc định hệ thống (Mẫu)',
        status: 'active',
        isPrimary: true,
        totalRequests: 0,
        successCount: 0,
        failureCount: 0,
      });
    }
  }

  public getMaskedKeys(): MaskedKeyRecord[] {
    return this.keys.map((k) => ({
      id: k.id,
      label: k.label,
      maskedKey: this.maskKey(k.key),
      status: k.status,
      isPrimary: k.isPrimary,
      totalRequests: k.totalRequests,
      successCount: k.successCount,
      failureCount: k.failureCount,
      lastUsed: k.lastUsed,
      latencyMs: k.latencyMs,
      lastError: k.lastError,
    }));
  }

  public getFailoverHistory() {
    return [...this.failoverHistory].slice(-20);
  }

  public addBackupKey(rawKey: string, label?: string): MaskedKeyRecord {
    const key = rawKey.trim();
    if (!key) {
      throw new Error('Khóa API không được để trống');
    }
    const existing = this.keys.find((k) => k.key === key);
    if (existing) {
      throw new Error('Khóa API này đã tồn tại trong danh sách');
    }

    const newRecord: KeyRecord = {
      id: `key-runtime-${Date.now()}`,
      key,
      label: label?.trim() || `Khóa dự phòng #${this.keys.length + 1}`,
      status: 'standby',
      isPrimary: this.keys.length === 0,
      totalRequests: 0,
      successCount: 0,
      failureCount: 0,
    };

    this.keys.push(newRecord);

    return {
      id: newRecord.id,
      label: newRecord.label,
      maskedKey: this.maskKey(newRecord.key),
      status: newRecord.status,
      isPrimary: newRecord.isPrimary,
      totalRequests: 0,
      successCount: 0,
      failureCount: 0,
    };
  }

  public removeKey(id: string): boolean {
    const index = this.keys.findIndex((k) => k.id === id);
    if (index === -1) return false;
    if (this.keys[index].isPrimary && this.keys.length > 1) {
      // Transfer primary to next
      this.keys.splice(index, 1);
      this.keys[0].isPrimary = true;
      this.keys[0].status = 'active';
    } else {
      this.keys.splice(index, 1);
    }
    return true;
  }

  public resetKeyStatus(id: string): boolean {
    const item = this.keys.find((k) => k.id === id);
    if (!item) return false;
    item.status = item.isPrimary ? 'active' : 'standby';
    item.lastError = undefined;
    return true;
  }

  public async testKey(id: string): Promise<{ success: boolean; message: string; latencyMs: number }> {
    const item = this.keys.find((k) => k.id === id);
    if (!item) throw new Error('Không tìm thấy khóa');

    const startTime = Date.now();
    try {
      const ai = new GoogleGenAI({
        apiKey: item.key,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Xin chào, phản hồi "OK" ngắn gọn.',
      });

      const latencyMs = Date.now() - startTime;
      item.latencyMs = latencyMs;
      item.status = item.isPrimary ? 'active' : 'standby';
      item.lastError = undefined;
      return {
        success: true,
        message: `Khóa hoạt động tốt! Phản hồi trong ${latencyMs}ms: "${response.text?.trim().slice(0, 30)}"`,
        latencyMs,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      item.latencyMs = latencyMs;
      item.status = 'error';
      item.lastError = err?.message || 'Lỗi kết nối';
      return {
        success: false,
        message: `Kiểm tra thất bại: ${err?.message || 'Không thể kết nối API'}`,
        latencyMs,
      };
    }
  }

  /**
   * Execute prompt with automatic multi-key failover
   */
  public async generateWithFailover(options: {
    systemInstruction?: string;
    prompt: string;
    history?: { role: string; parts: { text: string }[] }[];
  }): Promise<{
    text: string;
    keyUsed: string;
    keyId: string;
    failoverOccurred: boolean;
    attempts: number;
    latencyMs: number;
  }> {
    const availableKeys = [...this.keys].sort((a, b) => {
      // Prefer active first, then standby, then error/rate_limited
      const priority = (s: KeyStatus) => (s === 'active' ? 1 : s === 'standby' ? 2 : 3);
      return priority(a.status) - priority(b.status);
    });

    if (availableKeys.length === 0) {
      throw new Error('Không có khóa Gemini API nào trong danh sách!');
    }

    let lastErrorMessage = '';
    let attempts = 0;
    const overallStart = Date.now();

    for (let i = 0; i < availableKeys.length; i++) {
      const current = availableKeys[i];
      attempts++;
      current.totalRequests++;

      const keyStart = Date.now();
      try {
        const ai = new GoogleGenAI({
          apiKey: current.key,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });

        const contents: any[] = [];
        if (options.history && options.history.length > 0) {
          contents.push(...options.history);
        }
        contents.push({ role: 'user', parts: [{ text: options.prompt }] });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction: options.systemInstruction,
          },
        });

        const text = response.text || 'Không có phản hồi từ mô hình.';
        const latency = Date.now() - keyStart;

        current.successCount++;
        current.latencyMs = latency;
        current.lastUsed = new Date().toISOString();
        current.status = 'active';

        const failoverOccurred = i > 0;
        if (failoverOccurred) {
          this.failoverHistory.push({
            timestamp: new Date().toISOString(),
            fromKey: this.maskKey(availableKeys[0].key),
            toKey: this.maskKey(current.key),
            reason: lastErrorMessage || 'Tự động chuyển khóa dự phòng khi gặp sự cố quota/lỗi mạng',
          });
        }

        return {
          text,
          keyUsed: this.maskKey(current.key),
          keyId: current.id,
          failoverOccurred,
          attempts,
          latencyMs: Date.now() - overallStart,
        };
      } catch (err: any) {
        const errStr = err?.message || String(err);
        lastErrorMessage = errStr;
        current.failureCount++;
        current.lastError = errStr;

        // Categorize error
        if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
          current.status = 'rate_limited';
        } else {
          current.status = 'error';
        }

        console.warn(`[Gemini Key Failover] Khóa ${this.maskKey(current.key)} gặp lỗi: ${errStr}. Đang chuyển sang khóa dự phòng kế tiếp...`);
      }
    }

    // If all real API keys failed or were placeholders, provide intelligent domain-grounded software licensing response
    const fallbackLicenseAnswer = this.generateFallbackKnowledge(options.prompt);
    return {
      text: fallbackLicenseAnswer,
      keyUsed: 'LicenseTech Rule Engine (Offline Failover Mode)',
      keyId: 'offline-engine',
      failoverOccurred: true,
      attempts,
      latencyMs: Date.now() - overallStart,
    };
  }

  /**
   * Domain-specific expert technical knowledge generator when keys are out of quota
   */
  private generateFallbackKnowledge(prompt: string): string {
    const p = prompt.toLowerCase();
    if (p.includes('0xc004c008') || p.includes('c004c008')) {
      return `### Hướng Dẫn Xử Lý Mã Lỗi Kích Hoạt 0xC004C008

**Nguyên nhân:**
Mã lỗi \`0xC004C008\` xuất hiện khi Product Key đã đạt giới hạn số lần kích hoạt hoặc phần cứng máy tính (Motherboard, CPU) bị thay đổi khiến Microsoft Activation Server nhận diện là thiết bị mới.

**Quy trình kỹ thuật khắc phục:**
1. **Kiểm tra trạng thái bản quyền hiện tại:**
   Mở **CMD (Command Prompt) với quyền Administrator** và chạy:
   \`\`\`cmd
   slmgr.vbs /dli
   slmgr.vbs /xpr
   \`\`\`
2. **Kích hoạt bằng phương thức điện thoại tự động (Self-Service Phone Activation):**
   - Nhấn \`Windows + R\`, nhập: \`slui 4\` rồi nhấn Enter.
   - Chọn Quốc gia **Việt Nam**.
   - Màn hình sẽ hiển thị **Installation ID (IID)** gồm 9 nhóm 7 chữ số (A đến I).
   - Gọi tổng đài Microsoft Việt Nam: \`1800 400 470\` hoặc truy cập cổng tự phục vụ: \`microsoft.gointeract.io\`.
   - Nhập IID và nhận lại **Confirmation ID (CID)** gồm 8 nhóm (A đến H) để kích hoạt vĩnh viễn.
3. **Kích hoạt qua lệnh trực tiếp nếu có CID:**
   \`\`\`cmd
   slmgr.vbs /atp <Mã Confirmation ID>
   slmgr.vbs /ato
   \`\`\``;
    }

    if (p.includes('oem') || p.includes('retail') || p.includes('fpp') || p.includes('volume') || p.includes('phân biệt')) {
      return `### Phân Biệt Các Loại Giấy Phép Bản Quyền Windows & Phần Mềm

| Tiêu chí | OEM (Original Equipment Manufacturer) | Retail (FPP - Full Packaged Product) | Volume Licensing (KMS / MAK) |
| :--- | :--- | :--- | :--- |
| **Đối tượng** | Cài sẵn trên máy mới (Dell, HP, Asus...) | Người dùng cá nhân, văn phòng nhỏ | Doanh nghiệp từ 5 máy trở lên |
| **Gắn kết phần cứng** | Khóa vĩnh viễn vào Motherboard (BIOS/UEFI) | Gắn vào Tài khoản Microsoft (MSA) | Quản lý tập trung qua máy chủ KMS/VLSC |
| **Chuyển đổi thiết bị** | **KHÔNG** thể chuyển sang máy tính khác | **CÓ THỂ** chuyển sang máy mới khi đổi máy | Cấp phát linh hoạt theo số ghế (seats) |
| **Hỗ trợ kỹ thuật** | Do hãng sản xuất thiết bị hỗ trợ | Do Microsoft trực tiếp hỗ trợ | Hỗ trợ cấp doanh nghiệp (Enterprise SLA) |
| **Kiểm tra lệnh CMD** | \`slmgr.vbs /dli\` -> Hiển thị channel OEM | Channel: RETAIL | Channel: VOLUME_KMS hoặc VOLUME_MAK |`;
    }

    if (p.includes('office') || p.includes('ospp') || p.includes('unlicensed') || p.includes('365')) {
      return `### Khắc Phục Sự Cố Kích Hoạt Microsoft Office / 365 (OSPP.VBS)

**1. Kiểm tra trạng thái bản quyền Office bằng script OSPP:**
Mở CMD (Run as Administrator), chuyển tới thư mục cài đặt:
- Với Office 64-bit: \`cd "C:\\Program Files\\Microsoft Office\\Office16"\`
- Với Office 32-bit: \`cd "C:\\Program Files (x86)\\Microsoft Office\\Office16"\`

Chạy lệnh kiểm tra key:
\`\`\`cmd
cscript ospp.vbs /dstatus
\`\`\`

**2. Gỡ bỏ Product Key cũ bị xung đột (nếu có key trial hết hạn):**
Tìm 5 ký tự cuối của key hiển thị ở dòng \`Last 5 characters of installed product key: XXXXX\`:
\`\`\`cmd
cscript ospp.vbs /unpkey:XXXXX
\`\`\`

**3. Kích hoạt lại bản quyền mới:**
\`\`\`cmd
cscript ospp.vbs /inpkey:<Product-Key-Mới-25-Ký-Tự>
cscript ospp.vbs /act
\`\`\``;
    }

    if (p.includes('server') || p.includes('cal') || p.includes('core')) {
      return `### Quy Tắc Tính Bản Quyền Windows Server & Giấy Phép CAL

**1. Quy tắc tính số lượng Core License (Core-based licensing):**
- Mọi bộ vi xử lý vật lý (Physical Processor) cần tối thiểu **8 Cores**.
- Mọi máy chủ vật lý (Physical Server) cần tối thiểu **16 Cores**.
- *Ví dụ:* Máy chủ có 2 CPU, mỗi CPU 8 Cores = 16 Cores (vừa đủ 1 gói cơ sở 16-Core). Nếu máy chủ có 2 CPU x 12 Cores = 24 Cores -> Cần mua 1 gói 16-Core + 4 gói 2-Core bổ sung.

**2. Phân biệt User CAL và Device CAL:**
- **User CAL:** Cấp phép cho 1 người dùng truy cập máy chủ từ bất kỳ thiết bị nào (laptop, PC cơ quan, điện thoại). Phù hợp doanh nghiệp nhân viên di chuyển nhiều.
- **Device CAL:** Cấp phép cho 1 thiết bị cụ thể truy cập máy chủ, bất kể có bao nhiêu nhân viên luân phiên dùng máy đó (phù hợp nhà máy, ca kíp trực 24/7).`;
    }

    return `### Tư Vấn Kỹ Thuật Bản Quyền Phần Mềm Chuyên Sâu

Hệ thống tư vấn LicenseTech ghi nhận câu hỏi của bạn: "${prompt}".

**Các giải pháp kỹ thuật đề xuất:**
1. **Kiểm tra kênh cấp phép (License Channel):** Sử dụng các lệnh quản trị \`slmgr.vbs /dli\` (với Windows) hoặc \`cscript ospp.vbs /dstatus\` (với Office) để xác định chính xác phiên bản Retail, OEM hay Volume License.
2. **Khắc phục lỗi kích hoạt:** Nếu gặp lỗi kích hoạt qua Internet, hãy sử dụng kênh kích hoạt tổng đài (Phone Activation qua \`slui 4\`) hoặc kiểm tra lại tường lửa mạng nội bộ với cổng KMS \`1688\`.
3. **Tuân thủ pháp lý doanh nghiệp:** Đảm bảo lưu trữ hóa đơn VAT, chứng thư điện tử COA (Certificate of Authenticity), và tài khoản quản lý Tenant Volume Portal chính thức để vượt qua các đợt kiểm toán bản quyền phần mềm (Software Audit).

*Bạn có thể nhập mã lỗi cụ thể (ví dụ: \`0xC004C008\`, \`0x803FA067\`) hoặc hỏi về Windows Server, Office 365, Adobe CC để nhận hướng dẫn từng bước chi tiết!*`;
  }
}

export const keyPool = new KeyPoolManager();

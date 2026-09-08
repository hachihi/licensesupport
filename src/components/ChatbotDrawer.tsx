import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, KeyPoolItem } from '../types';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ShieldCheck,
  AlertCircle,
  Zap,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import Markdown from 'react-markdown';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  keyPoolItems: KeyPoolItem[];
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  keyPoolItems,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Xin chào! Tôi là **Trợ lý Kỹ thuật Bản quyền LicenseTech AI**.

Tôi được trang bị cơ sở tri thức chuyên sâu về:
- Chuẩn đoán và khắc phục mã lỗi kích hoạt (\`0xC004C008\`, \`0x803FA067\`, \`0xC004F074\`, v.v.)
- Lệnh quản trị bản quyền CMD/PowerShell (\`slmgr.vbs\`, \`ospp.vbs\`, \`slui 4\`)
- Phân biệt các kênh giấy phép: OEM, Retail (FPP), Volume Licensing (KMS/MAK), Cloud CSP
- Quy tắc tính số lượng Core License & Client Access License (CAL) cho Windows Server / SQL Server.

*Hệ thống được tích hợp **Multi-Key Gemini Failover** đảm bảo phản hồi 24/7 không gián đoạn.* Bạn đang cần hỗ trợ vấn đề gì?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Hướng dẫn xử lý lỗi kích hoạt 0xC004C008',
        'Phân biệt Windows OEM và Retail (FPP)',
        'Cách kiểm tra thời hạn bản quyền qua lệnh slmgr',
        'Cách tính Core License cho Windows Server',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Active key count
  const activeKeys = keyPoolItems.filter((k) => k.status === 'active' || k.status === 'standby');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  // Handle initialPrompt triggered from parent components
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
      onClearInitialPrompt?.();
    }
  }, [initialPrompt, isOpen]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getLocalDiagnosticFallback = (text: string): { reply: string; suggestions: string[] } => {
    const query = text.toLowerCase();

    if (query.includes('0xc004c008') || query.includes('c004c008')) {
      return {
        reply: `### Hướng dẫn khắc phục lỗi 0xC004C008 (Kích hoạt vượt hạn mức trực tuyến)

**Nguyên nhân:**
Mã khóa này đã đạt giới hạn số lần kích hoạt tự động qua internet của Microsoft. Lỗi này thường xuất hiện khi thay thế linh kiện (Mainboard, CPU) hoặc cài lại hệ điều hành nhiều lần.

**Các bước xử lý chuẩn Microsoft:**
1. Mở **Command Prompt (CMD)** bằng quyền Quản trị viên (*Run as Administrator*).
2. Chạy lệnh mở trình hướng dẫn kích hoạt điện thoại:
\`\`\`cmd
slui 4
\`\`\`
3. Chọn quốc gia **Việt Nam**, nhấn Next để nhận dãy **Installation ID (IID)** gồm 9 nhóm số (mỗi nhóm 7 chữ số).
4. Gọi tổng đài hỗ trợ tự động miễn cước của Microsoft Việt Nam (**1800 400 470**) hoặc truy cập cổng tự phục vụ của Microsoft.
5. Nhập dãy **Confirmation ID (CID)** gồm 8 nhóm chữ số từ A đến H để hoàn tất kích hoạt bản quyền vĩnh viễn.

*Lưu ý pháp lý:* Nếu đây là bản quyền OEM đi liền theo máy cũ, việc chuyển đổi sang thiết bị phần cứng mới không được cấp phép theo thỏa thuận EULA.`,
        suggestions: ['Lệnh kiểm tra trạng thái slmgr /dli', 'Phân biệt OEM và Retail', 'Kiểm tra key Office'],
      };
    }

    if (query.includes('0xc004c003') || query.includes('c004c003')) {
      return {
        reply: `### Hướng dẫn xử lý lỗi 0xC004C003 (Khóa bản quyền bị từ chối / Blocked)

**Nguyên nhân:**
Máy chủ kích hoạt xác định mã khóa sản phẩm không hợp lệ hoặc đã bị Microsoft thu hồi (Blacklist). Thường do mua phải key MSDN, key dùng thử nội bộ bị bán lại hoặc key chia sẻ công khai trên internet.

**Phương án khắc phục:**
1. Kiểm tra lại chuỗi 25 ký tự đã nhập (tránh nhầm các ký tự như 8-B, 0-O, G-6).
2. Xóa sạch khóa cũ đang tồn tại trong hệ thống:
\`\`\`cmd
slmgr.vbs /upk
slmgr.vbs /cpky
\`\`\`
3. Nạp lại khóa bản quyền chính hãng hợp lệ:
\`\`\`cmd
slmgr.vbs /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
slmgr.vbs /ato
\`\`\`
4. Nếu vẫn báo 0xC004C003, bạn cần liên hệ đơn vị cung cấp chính hãng để được cấp đổi mã sản phẩm đạt chuẩn kiểm toán.`,
        suggestions: ['Cách gỡ key slmgr /upk', 'Tư vấn mua bản quyền doanh nghiệp', 'Lỗi 0xC004C008'],
      };
    }

    if (query.includes('0x8007007b') || query.includes('8007007b') || query.includes('0xc004f074') || query.includes('c004f074')) {
      return {
        reply: `### Hướng dẫn khắc phục lỗi 0x8007007B / 0xC004F074 (Lỗi máy chủ KMS)

**Nguyên nhân:**
Windows của bạn đang được cấu hình kích hoạt qua máy chủ nội bộ (KMS Client), nhưng máy tính không tìm thấy máy chủ KMS hoặc không thể liên lạc với máy chủ KMS của tổ chức.

**Các bước khắc phục:**
1. Mở **Command Prompt (Admin)**.
2. Xóa địa chỉ máy chủ KMS cũ:
\`\`\`cmd
slmgr.vbs /ckms
\`\`\`
3. Nhập Product Key Retail / MAK chính thức của bạn:
\`\`\`cmd
slmgr.vbs /ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
\`\`\`
4. Kích hoạt trực tiếp với máy chủ Microsoft:
\`\`\`cmd
slmgr.vbs /ato
\`\`\`
5. Kiểm tra thời hạn bản quyền:
\`\`\`cmd
slmgr.vbs /xpr
\`\`\``,
        suggestions: ['Lệnh slmgr /xpr kiểm tra vĩnh viễn', 'Lỗi 0xC004C008', 'Tư vấn kiểm toán bản quyền'],
      };
    }

    if (query.includes('oem') || query.includes('retail')) {
      return {
        reply: `### So sánh chi tiết bản quyền OEM và Retail

| Tiêu chí | Bản quyền Retail (FPP) | Bản quyền OEM (System Builder) |
| :--- | :--- | :--- |
| **Quyền chuyển máy** | Được phép chuyển sang máy tính khác (mỗi thời điểm chỉ 1 PC hoạt động). | Gắn chết vào bo mạch chủ (Motherboard), không thể chuyển sang máy khác. |
| **Hỗ trợ kỹ thuật** | Hỗ trợ trực tiếp từ Microsoft Support. | Hỗ trợ từ hãng sản xuất thiết bị (Dell, HP, Asus...). |
| **Thay đổi phần cứng** | Đổi Mainboard, CPU vẫn giữ được bản quyền (liên kết tài khoản Microsoft). | Đổi bo mạch chủ sẽ mất bản quyền OEM. |
| **Bao bì & Tem** | Đầy đủ hộp, thẻ License Card hoặc USB cài đặt chính hãng. | Thường là tem chứng nhận dán trên thân máy hoặc nhúng vào BIOS UEFI. |

*Khuyến nghị doanh nghiệp:* Nên trang bị bản quyền **Retail** hoặc các gói **Microsoft 365 Business** để chủ động tái sử dụng khi thanh lý hoặc nâng cấp thiết bị văn phòng.`,
        suggestions: ['Lệnh kiểm tra giấy phép slmgr /dli', 'Lỗi 0xC004C008', 'Tư vấn mua bản quyền doanh nghiệp'],
      };
    }

    if (query.includes('ospp') || query.includes('office')) {
      return {
        reply: `### Hướng dẫn kiểm tra và quản lý bản quyền Microsoft Office qua OSPP.VBS

Tập lệnh **ospp.vbs** do Microsoft tích hợp giúp chẩn đoán mã khóa và thời hạn Office:

**1. Mở CMD quyền Administrator và chuyển đến thư mục cài đặt Office:**
\`\`\`cmd
REM Office 64-bit trên Windows 64-bit (Office 2016 / 2019 / 2021):
cd "C:\\Program Files\\Microsoft Office\\Office16"

REM Office 32-bit trên Windows 64-bit:
cd "C:\\Program Files (x86)\\Microsoft Office\\Office16"
\`\`\`

**2. Các lệnh kiểm tra quan trọng:**
- **Kiểm tra trạng thái bản quyền:**
\`\`\`cmd
cscript ospp.vbs /dstatus
\`\`\`
*(Quan sát 5 ký tự cuối của key tại dòng: Last 5 characters of installed product key)*
- **Gỡ bỏ key cũ / key bị lỗi:**
\`\`\`cmd
cscript ospp.vbs /unpkey:XXXXX
\`\`\`
- **Nạp key mới:**
\`\`\`cmd
cscript ospp.vbs /inpkey:XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
\`\`\`
- **Kích hoạt tức thì:**
\`\`\`cmd
cscript ospp.vbs /act
\`\`\``,
        suggestions: ['Phân biệt OEM và Retail', 'Lỗi 0xC004C008', 'Liên hệ tư vấn chuyên sâu'],
      };
    }

    return {
      reply: `Chào bạn! Tôi là Trợ Lý Kỹ Thuật Bản Quyền LicenseTech.

Dưới đây là một số thông tin kỹ thuật hỗ trợ nhanh:
- **Kiểm tra trạng thái bản quyền Windows:** Mở CMD (Admin) và chạy lệnh \`slmgr.vbs /dli\` hoặc \`slmgr.vbs /xpr\` để xem thời hạn kích hoạt.
- **Kích hoạt lại khi thay đổi phần cứng:** Chạy lệnh \`slui 4\` để mở cổng xác thực điện thoại tự động của Microsoft.
- **Tuân thủ pháp lý doanh nghiệp:** Sử dụng bản quyền có hóa đơn VAT và hợp đồng ủy quyền để đáp ứng kiểm toán phần mềm theo Nghị định 131/2013/NĐ-CP.

Bạn có thể nhập trực tiếp **mã lỗi cụ thể** (như \`0xC004C008\`, \`0xC004C003\`, \`0x8007007B\`) để nhận câu lệnh xử lý chi tiết từng bước!`,
      suggestions: [
        'Lỗi 0xC004C008 xử lý thế nào?',
        'Phân biệt OEM và Retail',
        'Cách kiểm tra key Office qua OSPP.vbs',
        'Lỗi 0x8007007B',
      ],
    };
  };

  const handleSend = async (userPromptText?: string) => {
    const textToSend = userPromptText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history for context
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      let data: any = null;
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMsg.text,
            history: historyPayload,
          }),
        });
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        }
      } catch (fetchErr) {
        console.warn('API chat network call failed, switching to expert diagnostics engine:', fetchErr);
      }

      if (data && data.reply) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          timestamp: new Date().toISOString(),
          keyUsed: data.keyUsed,
          failoverOccurred: data.failoverOccurred,
          suggestions: data.suggestions || [],
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Fallback to embedded technical diagnostic engine
        const fallback = getLocalDiagnosticFallback(userMsg.text);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: fallback.reply,
          timestamp: new Date().toISOString(),
          keyUsed: 'Offline Diagnostic Engine',
          failoverOccurred: false,
          suggestions: fallback.suggestions,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err: any) {
      const fallback = getLocalDiagnosticFallback(userMsg.text);
      const botMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        text: fallback.reply,
        timestamp: new Date().toISOString(),
        keyUsed: 'Diagnostic Engine',
        suggestions: fallback.suggestions,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Bạn có muốn xóa toàn bộ lịch sử hội thoại?')) {
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          text: 'Lịch sử hội thoại đã được làm mới. Tôi sẵn sàng hỗ trợ bạn các vấn đề kỹ thuật bản quyền phần mềm tiếp theo!',
          timestamp: new Date().toISOString(),
          suggestions: [
            'Lỗi 0xC004C008 xử lý thế nào?',
            'Phân biệt OEM và Retail',
            'Cách kiểm tra key Office qua OSPP.vbs',
          ],
        },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 flex flex-col bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 ${
        isExpanded
          ? 'inset-3 sm:inset-6 rounded-2xl'
          : 'bottom-4 right-4 w-[94vw] sm:w-[460px] h-[620px] max-h-[88vh] rounded-2xl'
      }`}
    >
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-t-2xl flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm tracking-tight">LicenseTech AI Consultant</h3>
              <span className="bg-yellow-400 text-slate-950 font-bold text-[9px] px-1.5 py-0.2 rounded uppercase">
                Gemini
              </span>
            </div>
            <p className="text-[11px] text-blue-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              {activeKeys.length > 0
                ? `${activeKeys.length} Keys Sẵn sàng (Multi-Key Failover)`
                : 'Đang kết nối...'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Làm mới cuộc trò chuyện"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title={isExpanded ? 'Thu nhỏ' : 'Mở rộng'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : msg.error
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-bl-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-bl-xs'
              }`}
            >
              {/* Failover notice if applicable */}
              {msg.failoverOccurred && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-lg border border-amber-200 dark:border-amber-800">
                  <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                  Đã tự động chuyển khóa dự phòng (Failover) thành công!
                </div>
              )}

              {/* Message Content with Markdown */}
              <div className="markdown-body">
                <Markdown>{msg.text}</Markdown>
              </div>

              {/* Key metadata & Copy button */}
              {msg.role === 'assistant' && !msg.error && (
                <div className="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400 gap-2">
                  <span className="font-mono">
                    {msg.keyUsed ? `Engine: ${msg.keyUsed}` : 'Gemini 3.8 Flash'}
                  </span>
                  <button
                    onClick={() => handleCopyText(msg.text, msg.id)}
                    className="hover:text-blue-500 flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedIndex === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Đã chép
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Sao chép
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Suggestions Chips if available */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%]">
                {msg.suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sug)}
                    className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-medium border border-blue-200 dark:border-blue-900 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-xs p-3.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Chuyên gia AI đang phân tích và chuẩn bị giải pháp...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi về mã lỗi 0xC004C008, lệnh slmgr, KMS/MAK, CAL..."
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 text-center">
          LicenseTech AI tham chiếu theo tài liệu cấp phép chính hãng Microsoft, Adobe, Autodesk.
        </p>
      </div>
    </div>
  );
};

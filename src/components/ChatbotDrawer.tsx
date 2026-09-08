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

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Lỗi kết nối Gemini API');
      }

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
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        text: `Đã xảy ra sự cố khi kết nối Gemini API: ${err.message}. Hệ thống đã tự động thử các khóa dự phòng nhưng đều bị giới hạn. Vui lòng kiểm tra lại cấu hình khóa trong tab Quản lý CMS.`,
        timestamp: new Date().toISOString(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
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

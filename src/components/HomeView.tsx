import React, { useState } from 'react';
import { Article, Category } from '../types';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Bot,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

interface HomeViewProps {
  categories: Category[];
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenChatWithPrompt: (prompt: string) => void;
  onSelectCategory: (categoryId: string) => void;
  selectedCategoryId: string;
  onNavigateTab: (tab: 'home' | 'articles' | 'cms' | 'about' | 'contact') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  categories,
  articles,
  onSelectArticle,
  onOpenChatWithPrompt,
  onSelectCategory,
  selectedCategoryId,
  onNavigateTab,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [selectedErrorCode, setSelectedErrorCode] = useState<string | null>('0xC004C008');

  const errorDatabase: Record<
    string,
    { title: string; cause: string; fix: string; cmd: string }
  > = {
    '0xC004C008': {
      title: 'Vượt quá giới hạn kích hoạt (Activation Limit Exceeded)',
      cause: 'Product Key Retail/OEM đã đạt số lần kích hoạt tối đa hoặc đã thay đổi bo mạch chủ (Motherboard) khiến phần cứng bị nhận diện mới.',
      fix: 'Sử dụng trình kích hoạt điện thoại tự phục vụ (Self-Service Phone Activation) bằng lệnh "slui 4" hoặc liên hệ tổng đài Microsoft Việt Nam.',
      cmd: 'slui 4',
    },
    '0x803FA067': {
      title: 'Lỗi nâng cấp phiên bản Windows Home lên Pro',
      cause: 'Máy tính chưa giải phóng được Product Key Home mặc định từ BIOS OEM khi nâng cấp lên Windows Pro.',
      fix: 'Ngắt kết nối Internet tạm thời, nhập Generic Key của Windows Pro: VK7JG-NPHTM-C97JM-9MPGT-3V66T để chuyển SKU, sau đó kết nối mạng và kích hoạt key bản quyền chính thức.',
      cmd: 'slmgr.vbs /ipk VK7JG-NPHTM-C97JM-9MPGT-3V66T',
    },
    '0xC004C020': {
      title: 'Khóa kích hoạt MAK đã vượt giới hạn (Volume MAK Exhausted)',
      cause: 'Khóa Multiple Activation Key dành cho doanh nghiệp đã hết hạn mức số máy trạm kích hoạt trên cổng VLSC.',
      fix: 'Quản trị viên cần đăng nhập Microsoft Volume Licensing Center (VLSC) hoặc liên hệ đối tác cung cấp để yêu cầu tăng chỉ tiêu (Increase Activation Limit).',
      cmd: 'slmgr.vbs /dli',
    },
    '0xC004F074': {
      title: 'Không thể kết nối đến máy chủ KMS nội bộ (KMS Server Unavailable)',
      cause: 'Máy trạm không tìm thấy bản ghi SRV DNS của máy chủ KMS hoặc cổng TCP 1688 bị chặn bởi tường lửa (Firewall).',
      fix: 'Kiểm tra thông tuyến mạng tới máy chủ KMS hoặc chỉ định địa chỉ IP máy chủ KMS trực tiếp qua lệnh CMD.',
      cmd: 'slmgr.vbs /skms <IP_KMS_SERVER>:1688',
    },
  };

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeArticles = Array.isArray(articles) ? articles : [];

  const filteredArticles = selectedCategoryId === 'all'
    ? safeArticles
    : safeArticles.filter((a) => a.categoryId === selectedCategoryId);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white py-14 sm:py-20 px-4 sm:px-6">
        {/* Subtle grid background effect */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Cổng Kỹ Thuật Bản Quyền Phần Mềm Hàng Đầu Việt Nam
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-snug">
            Cẩm Nang Kỹ Thuật <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-200 to-white">Bản Quyền Phần Mềm</span> & Xử Lý Mã Lỗi Kích Hoạt
          </h1>

          <p className="text-sm sm:text-lg text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Tra cứu chuẩn xác giải pháp kích hoạt Windows, Office 365, Windows Server CAL, Adobe Creative Cloud và trợ lý AI thông minh hỗ trợ 24/7.
          </p>

          {/* Quick Action Search Tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-blue-200 font-medium">Tìm kiếm nhanh:</span>
            {['0xC004C008', '0x803FA067', 'slmgr.vbs /dli', 'Office OSPP.vbs', 'Server CAL', 'OEM vs Retail'].map((tag) => (
              <button
                key={tag}
                onClick={() => onOpenChatWithPrompt(`Hướng dẫn chi tiết về: ${tag}`)}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-white transition flex items-center gap-1 cursor-pointer"
              >
                <Zap className="w-3 h-3 text-yellow-300" />
                {tag}
              </button>
            ))}
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-blue-700/50 max-w-4xl mx-auto">
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-center">
              <span className="text-xl sm:text-2xl font-bold text-sky-400">99.8%</span>
              <p className="text-xs text-blue-200 mt-0.5">Xử lý kích hoạt thành công</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-center">
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">1,500+</span>
              <p className="text-xs text-blue-200 mt-0.5">Doanh nghiệp tư vấn SAM</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-center">
              <span className="text-xl sm:text-2xl font-bold text-yellow-300">24/7</span>
              <p className="text-xs text-blue-200 mt-0.5">Trợ lý AI Multi-Key Failover</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-center">
              <span className="text-xl sm:text-2xl font-bold text-blue-300">100%</span>
              <p className="text-xs text-blue-200 mt-0.5">Chuẩn pháp lý SHTT Việt Nam</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Quick Error Code Diagnostic Tool */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Công Cụ Tra Cứu Khẩn Cấp
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Chuẩn Đoán Mã Lỗi Kích Hoạt Bản Quyền Nhanh
              </h2>
            </div>
            <button
              onClick={() => onOpenChatWithPrompt('Tôi muốn kiểm tra một mã lỗi kích hoạt Windows/Office lạ chưa có trong danh sách.')}
              className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-medium text-xs flex items-center gap-2 transition w-fit"
            >
              <Bot className="w-4 h-4" />
              Chuẩn đoán lỗi khác với AI
            </button>
          </div>

          {/* Error code tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {Object.keys(errorDatabase).map((code) => (
              <button
                key={code}
                onClick={() => setSelectedErrorCode(code)}
                className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                  selectedErrorCode === code
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span className="font-mono font-bold text-sm block">{code}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {errorDatabase[code].title}
                </span>
              </button>
            ))}
          </div>

          {/* Selected error details */}
          {selectedErrorCode && errorDatabase[selectedErrorCode] && (
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-xs">
                    Mã lỗi: {selectedErrorCode}
                  </span>
                  <span>{errorDatabase[selectedErrorCode].title}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-1">
                    Nguyên nhân cốt lõi:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {errorDatabase[selectedErrorCode].cause}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                    Quy trình khắc phục khuyến nghị:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {errorDatabase[selectedErrorCode].fix}
                  </p>
                </div>
              </div>

              {/* Command Box */}
              <div className="p-3 rounded-lg bg-slate-950 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-emerald-400 select-all">
                    {errorDatabase[selectedErrorCode].cmd}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(errorDatabase[selectedErrorCode].cmd)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1.5 transition text-xs"
                  >
                    {copiedCmd === errorDatabase[selectedErrorCode].cmd ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Đã chép
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Sao chép lệnh
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      onOpenChatWithPrompt(
                        `Tôi đang bị lỗi kích hoạt ${selectedErrorCode}. Hãy hướng dẫn từng bước khắc phục chi tiết và cung cấp cú pháp lệnh đầy đủ.`
                      )
                    }
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-1.5 transition text-xs font-sans"
                  >
                    <Bot className="w-3.5 h-3.5" /> Hỏi AI chi tiết
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* License Matrix Comparison Widget */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              Kiến Thức Cốt Lõi
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Bảng So Sánh Các Kênh Giấy Phép Bản Quyền (License Channels)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Phân biệt chính xác quyền lợi và ràng buộc pháp lý giữa các hình thức bản quyền phổ biến.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
                  <th className="p-3 font-semibold">Tiêu chí đánh giá</th>
                  <th className="p-3 font-semibold text-blue-600 dark:text-blue-400">OEM (Cài sẵn)</th>
                  <th className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Retail / FPP (Bán lẻ)</th>
                  <th className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">Volume (KMS / MAK)</th>
                  <th className="p-3 font-semibold text-sky-600 dark:text-sky-400">Cloud CSP / M365</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <td className="p-3 font-medium text-slate-900 dark:text-white">Đối tượng sử dụng</td>
                  <td className="p-3">Mua kèm máy tính mới</td>
                  <td className="p-3">Cá nhân, văn phòng nhỏ</td>
                  <td className="p-3">Doanh nghiệp từ 5 máy trở lên</td>
                  <td className="p-3">Mọi quy mô doanh nghiệp</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-900 dark:text-white">Ràng buộc phần cứng</td>
                  <td className="p-3 text-rose-600 dark:text-rose-400 font-semibold">Khóa vào Mainboard (BIOS)</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Gắn vào Tài khoản MSA</td>
                  <td className="p-3">Quản lý qua KMS Server/VLSC</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">Gắn theo User Identity (Azure AD)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-900 dark:text-white">Chuyển sang máy mới</td>
                  <td className="p-3 text-rose-500 font-medium">KHÔNG được phép</td>
                  <td className="p-3 text-emerald-600 font-medium">ĐƯỢC PHÉP (1 máy/lần)</td>
                  <td className="p-3 text-emerald-600 font-medium">ĐƯỢC PHÉP (Tái phân bổ ghế)</td>
                  <td className="p-3 text-emerald-600 font-medium">Tự do (Lên tới 5 thiết bị/User)</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-900 dark:text-white">Kiểm toán SAM & EULA</td>
                  <td className="p-3">Cần tem COA + Hóa đơn theo máy</td>
                  <td className="p-3">Hóa đơn VAT + Thư điện tử</td>
                  <td className="p-3">Hợp đồng OLP/MPSA + Hóa đơn</td>
                  <td className="p-3">Hóa đơn định kỳ + CSP Portal</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-900 dark:text-white">Lệnh CMD kiểm tra</td>
                  <td className="p-3 font-mono text-xs">Channel: OEM_COA</td>
                  <td className="p-3 font-mono text-xs">Channel: RETAIL</td>
                  <td className="p-3 font-mono text-xs">VOLUME_KMS / MAK</td>
                  <td className="p-3 font-mono text-xs">Subscription Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Categories Pills */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                Kho Tri Thức Kỹ Thuật
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                Chuyên Đề Bản Quyền Theo Danh Mục
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('articles')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 transition"
            >
              Xem tất cả bài viết ({safeArticles.length}) <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Category Pills Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              Tất cả chuyên đề ({safeArticles.length})
            </button>
            {safeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                  selectedCategoryId === cat.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {cat.articleCount ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => {
              const cat = safeCategories.find((c) => c.id === art.categoryId);
              return (
                <article
                  key={art.id}
                  onClick={() => onSelectArticle(art)}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-medium bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                        {cat?.name || 'Chuyên đề'}
                      </span>
                      <span className="text-slate-400 text-[11px]">{formatDate(art.updatedAt)}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>

                    {/* Related Error tags */}
                    {art.relatedErrorCodes && art.relatedErrorCodes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {art.relatedErrorCodes.slice(0, 3).map((code) => (
                          <span
                            key={code}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Đọc hướng dẫn <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <span>{art.views} lượt xem</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Enterprise Advisory CTA Banner */}
        <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-2xl p-8 sm:p-10 text-white shadow-lg shadow-blue-500/10">
          <div className="max-w-3xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-yellow-300" />
              Tư Vấn Doanh Nghiệp & Hỗ Trợ Kiểm Toán
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Doanh Nghiệp Cần Rà Soát Bản Quyền Trước Kỳ Thanh Tra?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              LicenseTech hỗ trợ kiểm kê tài sản phần mềm (SAM Audit), kiểm tra tính hợp lệ của hóa đơn VAT, chứng thư COA và đề xuất giải pháp cấp phép tối ưu ngân sách nhất cho doanh nghiệp.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('contact')}
                className="px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 transition shadow-sm"
              >
                Gửi Yêu Cầu Tư Vấn Ngay
              </button>
              <button
                onClick={() => onOpenChatWithPrompt('Tư vấn quy trình chuẩn bị kiểm toán phần mềm SAM cho doanh nghiệp')}
                className="px-5 py-2.5 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Hỏi Trợ Lý AI Chuyên Sâu
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

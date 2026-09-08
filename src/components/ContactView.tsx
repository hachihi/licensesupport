import React, { useState } from 'react';
import {
  Mail,
  PhoneCall,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Building,
  HelpCircle,
} from 'lucide-react';

interface ContactViewProps {
  onOpenChat: (prompt?: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onOpenChat }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    softwareType: 'Windows 11/10 Pro',
    inquiryType: 'Tư vấn kiểm toán & mua mới doanh nghiệp',
    seatsCount: '1 - 10 máy',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi gửi form');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Không thể gửi thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Mail className="w-4 h-4" />
          Liên Hệ Kỹ Thuật & Tư Vấn Bản Quyền
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hỗ Trợ Kỹ Thuật & Tư Vấn Cấp Phép Doanh Nghiệp
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Đội ngũ kỹ sư Microsoft Certified và chuyên gia bản quyền LicenseTech sẵn sàng giải quyết triệt để sự cố kích hoạt và tư vấn gói giải pháp bản quyền phù hợp nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Col: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Gửi Yêu Cầu Thành Công!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Cảm ơn bạn đã liên hệ với LicenseTech. Kỹ sư tư vấn chuyên môn sẽ liên hệ lại qua điện thoại hoặc email trong vòng <strong>15 - 30 phút</strong> làm việc.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      company: '',
                      email: '',
                      phone: '',
                      softwareType: 'Windows 11/10 Pro',
                      inquiryType: 'Tư vấn kiểm toán & mua mới doanh nghiệp',
                      seatsCount: '1 - 10 máy',
                      message: '',
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Phiếu Yêu Cầu Kỹ Thuật / Báo Giá
              </h3>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Họ và tên người liên hệ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tên cơ quan / Doanh nghiệp
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Công ty Cổ phần ABC"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Địa chỉ Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nguyenvana@company.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Số điện thoại / Zalo *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phần mềm quan tâm
                  </label>
                  <select
                    value={formData.softwareType}
                    onChange={(e) => setFormData({ ...formData, softwareType: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Windows 11/10 Pro">Windows 11 / 10 Pro</option>
                    <option value="Microsoft 365 / Office">Microsoft 365 / Office LTSC</option>
                    <option value="Windows Server & CAL">Windows Server 2022/2025 & CAL</option>
                    <option value="SQL Server Standard">SQL Server Standard / Enterprise</option>
                    <option value="Adobe Creative Cloud">Adobe Creative Cloud</option>
                    <option value="Autodesk AutoCAD">Autodesk AutoCAD / Revit</option>
                    <option value="Khác">Phần mềm khác</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nhu cầu cần hỗ trợ
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Tư vấn kiểm toán & mua mới doanh nghiệp">Tư vấn kiểm toán SAM & Mua mới</option>
                    <option value="Khắc phục mã lỗi kích hoạt">Khắc phục mã lỗi kích hoạt (Error Code)</option>
                    <option value="Chuyển đổi bản quyền sang máy mới">Chuyển đổi bản quyền sang máy mới</option>
                    <option value="Cấp hóa đơn VAT & COA">Cấp hóa đơn GTGT & Chứng thư COA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Số lượng máy tính dự kiến
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1 - 5 máy', '6 - 20 máy', '21 - 50 máy', 'Trên 50 máy'].map((seat) => (
                    <button
                      type="button"
                      key={seat}
                      onClick={() => setFormData({ ...formData, seatsCount: seat })}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border transition cursor-pointer text-center ${
                        formData.seatsCount === seat
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Mô tả chi tiết / Mã lỗi đang gặp phải (nếu có) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Vd: Máy tính công ty báo lỗi 0xC004C008 khi cài lại Windows 11 Pro, cần chuyên viên hỗ trợ kích hoạt hợp lệ..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Đang gửi thông tin...' : 'Gửi Yêu Cầu Hỗ Trợ Kỹ Thuật'}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Thông tin của bạn được cam kết bảo mật theo tiêu chuẩn ISO 27001 và chỉ sử dụng cho mục đích tư vấn bản quyền.
              </p>
            </form>
          )}
        </div>

        {/* Right Col: Contact info & Help */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Kênh Tiếp Nhận Khẩn Cấp
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Hotline Kỹ Thuật (24/7):</span>
                  <a href="tel:1900633800" className="font-bold text-base text-blue-600 dark:text-blue-400 hover:underline">
                    1900 633 800
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Email Tiếp Nhận Hồ Sơ:</span>
                  <a href="mailto:support@licensetech.vn" className="font-semibold text-slate-900 dark:text-white hover:text-blue-600">
                    support@licensetech.vn
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-xs block">Thời Gian Tiếp Nhận:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Thứ 2 - Thứ 7: 8h00 - 18h00 <br />
                    (Trợ lý AI & Hotline trực 24/7)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-3">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Cần Giải Đáp Kỹ Thuật Ngay Lập Tức?
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              Bạn không cần phải đợi email phản hồi. Hãy sử dụng Trợ lý AI Gemini với bể khóa dự phòng để được tra cứu mã lỗi và nhận cú pháp lệnh sửa tức thì trong vài giây!
            </p>
            <button
              onClick={() => onOpenChat()}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
            >
              Mở Trợ Lý AI Gemini 24/7
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

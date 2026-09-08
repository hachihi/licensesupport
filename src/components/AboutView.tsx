import React from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  FileCheck,
  Scale,
  Sparkles,
  HelpCircle,
  PhoneCall,
  Mail,
  Building,
} from 'lucide-react';

interface AboutViewProps {
  onNavigateContact: () => void;
  onOpenChat: (prompt?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateContact, onOpenChat }) => {
  const faqs = [
    {
      q: 'Doanh nghiệp mua máy tính có cài sẵn Windows OEM có cần mua thêm bản quyền không?',
      a: 'Bản quyền Windows OEM đi kèm máy (như Dell, HP, ThinkPad có tem COA hoặc key nhúng trong UEFI/BIOS) là bản quyền hợp pháp vĩnh viễn cho máy tính đó. Doanh nghiệp chỉ cần lưu trữ hóa đơn VAT mua máy có thể hiện dòng "Bao gồm Windows bản quyền" để chứng minh tính hợp lệ khi kiểm toán.',
    },
    {
      q: 'Phần mềm bẻ khóa (crack) hoặc dùng KMS lậu đem lại những nguy cơ pháp lý và kỹ thuật nào?',
      a: 'Về mặt kỹ thuật, hơn 92% công cụ crack chứa mã độc trojan, backdoor và phần mềm tống tiền (ransomware). Về mặt pháp lý, theo Điều 225 Bộ luật Hình sự Việt Nam, hành vi xâm phạm quyền tác giả phần mềm thương mại có thể bị phạt tiền đến 1 tỷ đồng hoặc phạt tù đến 5 năm đối với cá nhân, và phạt tới 3 tỷ đồng hoặc đình chỉ hoạt động đối với pháp nhân thương mại.',
    },
    {
      q: 'Doanh nghiệp dùng Microsoft 365 Business Standard được cài đặt trên bao nhiêu thiết bị?',
      a: 'Mỗi giấy phép Microsoft 365 Business Standard (theo mô hình Named User) cho phép 1 người dùng được chỉ định cài đặt đầy đủ các ứng dụng Office (Word, Excel, PowerPoint, Outlook) trên tối đa 5 máy tính (PC/Mac), 5 máy tính bảng và 5 điện thoại thông minh cùng lúc.',
    },
    {
      q: 'Khi máy chủ vật lý nâng cấp thêm CPU hoặc thay bo mạch chủ thì tính lại license ra sao?',
      a: 'Với Windows Server, bản quyền được tính trên tổng số lõi (Cores) của máy chủ vật lý. Nếu bạn lắp thêm CPU hoặc đổi CPU nhiều nhân hơn, bạn phải mua thêm các gói bổ sung 2-Core Add-on Pack để đảm bảo toàn bộ số core hoạt động đều có giấy phép phủ sóng tương ứng.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          Về Chúng Tôi • LICENSETECH VN
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Chuẩn Hóa Pháp Lý & Làm Chủ Kỹ Thuật <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-blue-800">
            Bản Quyền Phần Mềm Tại Việt Nam
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Cổng thông tin chuyên đề kỹ thuật, hướng dẫn chuyên sâu và chuẩn đoán sự cố giấy phép bản quyền số một Việt Nam, mang phong cách tận tâm, chính xác và đồng hành cùng sự phát triển bền vững của doanh nghiệp.
        </p>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4 Trụ Cột Cam Kết</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Định hướng hoạt động nhất quán vì quyền lợi và an toàn dữ liệu khách hàng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">100% Chính Hãng</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mọi hướng dẫn và cấu hình bản quyền đều tuân thủ nghiêm ngặt điều khoản cấp phép chính thức từ Microsoft, Adobe, Autodesk, JetBrains.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">An Toàn Pháp Lý</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tư vấn đầy đủ hồ sơ pháp lý: Hóa đơn GTGT, Chứng thư xác thực COA, Thỏa thuận người dùng EULA để an toàn tuyệt đối trước mọi đợt thanh tra.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Tối Ưu Ngân Sách</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Phân tích quy mô thực tế để chọn đúng loại giấy phép (OEM, Retail, Volume KMS/MAK, CSP), tránh lãng phí chi phí đầu tư công nghệ.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Công Nghệ AI 24/7</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Trợ lý AI tích hợp Gemini Multi-Key Failover trực chiến liên tục, phản hồi tức thì mọi mã lỗi kích hoạt và câu lệnh kỹ thuật.
            </p>
          </div>
        </div>
      </section>

      {/* Advisory Team Info */}
      <section className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Đội Ngũ Chuyên Gia
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Kỹ Sư Hệ Thống & Chuyên Gia Sở Hữu Trí Tuệ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Đội ngũ của LicenseTech gồm các chuyên viên được chứng nhận bởi Microsoft (MCP, MCSA, Azure Solutions Architect), cùng các chuyên gia pháp chế nhiều năm kinh nghiệm trong lĩnh vực kiểm toán tài sản phần mềm (SAM) cho các tập đoàn đa quốc gia và doanh nghiệp vừa và nhỏ tại Việt Nam.
            </p>
            <div className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>10+ năm kinh nghiệm trong ngành giải pháp bản quyền phần mềm</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Đã hỗ trợ hơn 1,500 tổ chức vượt qua các đợt rà soát kiểm toán</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Đối tác giải pháp kỹ thuật tin cậy của cộng đồng IT Helpdesk</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Thông Tin Đơn Vị Vận Hành
            </h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>
                <strong>Tổ chức:</strong> Trung tâm Kỹ thuật Bản quyền Phần mềm LicenseTech Việt Nam
              </p>
              <p>
                <strong>Hệ thống trụ sở:</strong> Hà Nội, TP. Hồ Chí Minh, Đà Nẵng
              </p>
              <p>
                <strong>Đường dây nóng kỹ thuật:</strong>{' '}
                <span className="text-blue-600 font-bold">1900 633 800</span>
              </p>
              <p>
                <strong>Email chuyên gia:</strong>{' '}
                <span className="text-blue-600 font-bold">compliance@licensetech.vn</span>
              </p>
              <div className="pt-2">
                <button
                  onClick={onNavigateContact}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
                >
                  Gửi Yêu Cầu Hỗ Trợ Doanh Nghiệp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            Giải Đáp Thắc Mắc
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Câu Hỏi Thường Gặp Về Bản Quyền Phần Mềm
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-start gap-2">
                <span className="text-blue-600 shrink-0 font-mono">Q{idx + 1}.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

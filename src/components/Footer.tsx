import React from 'react';
import { ShieldCheck, PhoneCall, Mail, MapPin, ExternalLink, Award, FileCode, CheckCircle, Lock, Shield } from 'lucide-react';

interface FooterProps {
  onSelectCategory?: (slug: string) => void;
  onOpenErrorCode?: (code: string) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenErrorCode,
  isAdmin = false,
  onOpenAdminLogin,
  onAdminLogout,
}) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      {/* Top Value Banner */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">100% Bản Quyền Hợp Pháp</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Đầy đủ Hóa đơn VAT, COA và EULA hợp lệ</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Tuân Thủ Kiểm Toán SAM</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">An toàn tuyệt đối trước thanh tra SHTT</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Hỗ Trợ Kỹ Thuật Chuyên Sâu</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kỹ sư Microsoft Certified trực tiếp giải quyết</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Trợ Lý AI Gemini 24/7</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Multi-key failover đảm bảo trực tuyến liên tục</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                LICENSE<span className="text-blue-600 dark:text-blue-400">TECH</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Cổng thông tin chuyên đề kỹ thuật số một Việt Nam về giấy phép bản quyền phần mềm, chuẩn đoán mã lỗi kích hoạt Windows, Office, Server CAL, Adobe và hỗ trợ tuân thủ kiểm toán phần mềm cho doanh nghiệp.
            </p>
            <div className="text-xs space-y-2 pt-1">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Tổng đài kỹ thuật: <strong className="text-blue-600 dark:text-blue-400">1900 633 800</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Email: <strong className="text-blue-600 dark:text-blue-400">support@licensetech.vn</strong></span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
              Chuyên Mục Bản Quyền
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory?.('he-dieu-hanh-windows')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Bản quyền Hệ điều hành & Windows 11/10
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('office-microsoft-365')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Bộ ứng dụng văn phòng & Microsoft 365
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('may-chu-server-cal')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Hạ tầng Máy chủ & Windows Server CAL
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('adobe-autodesk')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Thiết kế đồ họa Adobe CC & AutoCAD Flex
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('kiem-toan-tuan-thu')}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Kiểm toán phần mềm SAM & Pháp lý SHTT
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Error Codes */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
              Mã Lỗi Thường Gặp
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {['0xC004C008', '0x803FA067', '0xC004C020', '0xC004F074', '0x80070005', '0x80041015', '0xC004F038'].map((code) => (
                <button
                  key={code}
                  onClick={() => onOpenErrorCode?.(code)}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/60 dark:hover:text-blue-300 rounded font-mono text-[11px] border border-slate-200 dark:border-slate-700 transition"
                >
                  {code}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              <p>Lệnh kiểm tra thông dụng:</p>
              <code className="inline-block mt-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                slmgr.vbs /dli
              </code>
              <code className="inline-block ml-1 mt-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                slui 4
              </code>
            </div>
          </div>

          {/* Col 4: Locations */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
              Trung Tâm Kỹ Thuật
            </h4>
            <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Hà Nội:</strong> Tầng 8, Tòa nhà Tech Tower, Phố Duy Tân, Cầu Giấy.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>TP. Hồ Chí Minh:</strong> Tòa nhà Hachihi Innovation, Đường CMT8, Quận 3.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Đà Nẵng:</strong> Tòa nhà FPT Complex, Ngũ Hành Sơn.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 LICENSETECH VN. Bản quyền thuộc về Chuyên trang Kỹ thuật Bản quyền Phần mềm Việt Nam.</p>
          <div className="flex flex-wrap items-center space-x-3">
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Chính sách bảo mật</span>
            <span>•</span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Điều khoản sử dụng</span>
            <span>•</span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Quy chuẩn SHTT Việt Nam</span>
            <span>•</span>
            {isAdmin ? (
              <button
                onClick={onAdminLogout}
                className="hover:text-rose-500 text-amber-600 dark:text-amber-400 font-semibold cursor-pointer flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/60"
              >
                <Shield className="w-3 h-3" />
                <span>Admin (Đăng xuất)</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="hover:text-blue-600 dark:hover:text-blue-400 text-slate-400 hover:underline cursor-pointer flex items-center gap-1"
                title="Cổng đăng nhập dành riêng cho Quản trị viên"
              >
                <Lock className="w-3 h-3" />
                <span>Cổng Quản Trị</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

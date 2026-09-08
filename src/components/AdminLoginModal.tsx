import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldAlert, CheckCircle2, X, KeyRound, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => Promise<{ success: boolean; error?: string }>;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Vui lòng nhập mật khẩu quản trị');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await onLogin(password.trim());
      if (res.success) {
        setPassword('');
        onClose();
      } else {
        setErrorMsg(res.error || 'Mật khẩu quản trị không chính xác.');
      }
    } catch {
      setErrorMsg('Lỗi kết nối tới máy chủ xác thực.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Xác Thực Quản Trị Viên
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Khu vực bảo mật: Quản trị Chuyên đề & Khóa Gemini
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Mật khẩu truy cập hệ thống:
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu quản trị..."
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Help for Default Setup */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Ghi chú thiết lập & Đổi mật khẩu:</span>
            </div>
            <p>
              Mật khẩu mặc định khởi tạo: <code className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">admin@licensetech2026</code>
            </p>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 leading-relaxed">
              🔑 <strong>Muốn đổi mật khẩu?</strong> Sau khi đăng nhập, hãy chuyển sang tab <strong>Bảo Mật & Đổi Mật Khẩu</strong> trong CMS để đổi trực tiếp, hoặc thiết lập biến môi trường <code className="font-mono font-semibold text-slate-700 dark:text-slate-300">ADMIN_PASSWORD</code> trong <em>Vercel Project Settings &gt; Environment Variables</em>.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Đăng Nhập Quản Trị</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[11px] text-slate-400">
            Khách thường sẽ không thấy và không thể chỉnh sửa mục CMS này.
          </p>
        </div>
      </div>
    </div>
  );
};

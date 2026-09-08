import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Moon,
  Sun,
  Bot,
  PhoneCall,
  Clock,
  Menu,
  X,
  FileText,
  Sliders,
  Info,
  Mail,
  Sparkles,
  CheckCircle2,
  Lock,
  LogOut,
  Shield,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'home' | 'articles' | 'cms' | 'about' | 'contact';
  onSelectTab: (tab: 'home' | 'articles' | 'cms' | 'about' | 'contact') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenChat: (initialPrompt?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeKeyCount: number;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  isDark,
  onToggleTheme,
  onOpenChat,
  searchQuery,
  onSearchChange,
  activeKeyCount,
  isAdmin = false,
  onOpenAdminLogin,
  onAdminLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'articles' | 'cms' | 'about' | 'contact') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-sm transition-colors">
      {/* Top Banner Bar - Hachihi tech style */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-blue-200" />
              Hotline Kỹ Thuật: <strong className="text-yellow-300 ml-1">1900 633 800</strong>
            </span>
            <span className="hidden md:flex items-center gap-1 text-blue-100">
              <Clock className="w-3.5 h-3.5" />
              Tư vấn 8:00 - 21:00 (T2 - CN)
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1 bg-blue-800/60 px-2 py-0.5 rounded-full text-blue-100 border border-blue-400/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              100% Giấy phép Bản quyền Chính hãng
            </span>
            <button
              onClick={() => onOpenChat()}
              className="inline-flex items-center gap-1 text-yellow-300 hover:text-white font-medium transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
              Gemini AI Chatbot ({activeKeyCount} Keys Sẵn sàng)
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-blue-700 dark:text-blue-400">
                LICENSE<span className="text-slate-900 dark:text-white">TECH</span>
              </span>
              <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block font-medium">
              Chuyên Đề Kỹ Thuật Bản Quyền Phần Mềm
            </p>
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tra cứu mã lỗi (0xC004C008, 0x803FA067, slmgr, KMS...)"
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-2 rounded-lg transition ${
              currentTab === 'home'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Trang chủ
          </button>
          <button
            onClick={() => handleNavClick('articles')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              currentTab === 'articles'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Chuyên đề kỹ thuật
          </button>

          {/* CMS tab is ONLY visible to logged-in Admin */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('cms')}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 relative border border-blue-200 dark:border-blue-900/60 ${
                currentTab === 'cms'
                  ? 'text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950 font-bold'
                  : 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50'
              }`}
            >
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Quản lý CMS</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-white font-mono font-bold">
                Admin
              </span>
            </button>
          )}

          <button
            onClick={() => handleNavClick('about')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              currentTab === 'about'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Info className="w-4 h-4" />
            Giới thiệu
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              currentTab === 'contact'
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            Liên hệ
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Admin status pill / Logout button */}
          {isAdmin ? (
            <div className="hidden sm:flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg px-2.5 py-1.5 text-xs text-amber-700 dark:text-amber-300">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold text-[11px]">Admin Đã Xác Thực</span>
              {onAdminLogout && (
                <button
                  onClick={onAdminLogout}
                  title="Đăng xuất khỏi phiên Quản trị"
                  className="ml-1 p-1 hover:bg-amber-200/60 dark:hover:bg-amber-900/80 rounded transition cursor-pointer text-slate-600 dark:text-slate-300"
                >
                  <LogOut className="w-3 h-3 text-rose-500" />
                </button>
              )}
            </div>
          ) : null}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối (Darkmode)'}
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Chatbot Trigger Button */}
          <button
            onClick={() => onOpenChat()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-medium text-xs sm:text-sm px-3.5 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition transform active:scale-95 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Trợ lý AI</span>
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              Gemini
            </span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search & Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm mã lỗi, lệnh cmd..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col space-y-1 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Trang chủ
            </button>
            <button
              onClick={() => handleNavClick('articles')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Chuyên đề kỹ thuật
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNavClick('cms')}
                className="text-left px-3 py-2 rounded-lg bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  Quản lý CMS & Danh mục
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-white font-mono">
                  Admin
                </span>
              </button>
            )}
            <button
              onClick={() => handleNavClick('about')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Giới thiệu
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Liên hệ tư vấn
            </button>

            {isAdmin && onAdminLogout && (
              <button
                onClick={() => {
                  onAdminLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất Quản trị viên
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

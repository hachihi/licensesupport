import React, { useState, useEffect } from 'react';
import { Category, Article, KeyPoolItem, ContactInquiry } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ArticlesView } from './components/ArticlesView';
import { AdminCMS } from './components/AdminCMS';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { INITIAL_CATEGORIES, INITIAL_ARTICLES, INITIAL_KEYS } from './data/initialData';
import { Bot, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('licensetech_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'home' | 'articles' | 'cms' | 'about' | 'contact'>('home');

  // Core Data States with resilient initial values
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [keyPoolItems, setKeyPoolItems] = useState<KeyPoolItem[]>(INITIAL_KEYS);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Category filter
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  // Modals & Chatbot States
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);

  // Notification Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync Dark Mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('licensetech_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('licensetech_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Helper to safely parse JSON or return null if HTML/fallback is returned
  const safeJson = async (res: Response) => {
    try {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {
      // ignore
    }
    return null;
  };

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, artRes, keyRes, inqRes] = await Promise.allSettled([
        fetch('/api/categories'),
        fetch('/api/articles'),
        fetch('/api/keys'),
        fetch('/api/inquiries'),
      ]);

      if (catRes.status === 'fulfilled' && catRes.value.ok) {
        const catData = await safeJson(catRes.value);
        if (catData) {
          const list = Array.isArray(catData)
            ? catData
            : Array.isArray(catData.categories)
            ? catData.categories
            : null;
          if (list && list.length > 0) setCategories(list);
        }
      }

      if (artRes.status === 'fulfilled' && artRes.value.ok) {
        const artData = await safeJson(artRes.value);
        if (artData) {
          const list = Array.isArray(artData)
            ? artData
            : Array.isArray(artData.articles)
            ? artData.articles
            : null;
          if (list && list.length > 0) setArticles(list);
        }
      }

      if (keyRes.status === 'fulfilled' && keyRes.value.ok) {
        const keyData = await safeJson(keyRes.value);
        if (keyData) {
          const list = Array.isArray(keyData)
            ? keyData
            : Array.isArray(keyData.keys)
            ? keyData.keys
            : null;
          if (list && list.length > 0) setKeyPoolItems(list);
        }
      }

      if (inqRes.status === 'fulfilled' && inqRes.value.ok) {
        const inqData = await safeJson(inqRes.value);
        if (inqData) {
          const list = Array.isArray(inqData)
            ? inqData
            : Array.isArray(inqData.inquiries)
            ? inqData.inquiries
            : null;
          if (list) setInquiries(list);
        }
      }
    } catch (err) {
      console.warn('Network sync notice (using cached data):', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Global search trigger
  const handleGlobalSearch = (query: string) => {
    if (!query.trim()) return;
    setActiveTab('articles');
  };

  // Chat triggers
  const handleOpenChatWithPrompt = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  // Select category from footer or pills
  const handleSelectCategory = (catIdOrSlug: string) => {
    // Check if matching id or slug
    const found = categories.find((c) => c.id === catIdOrSlug || c.slug === catIdOrSlug);
    if (found) {
      setSelectedCategoryId(found.id);
    } else if (catIdOrSlug === 'all') {
      setSelectedCategoryId('all');
    }
    setActiveTab('articles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open error code diagnostic directly
  const handleOpenErrorCode = (code: string) => {
    handleOpenChatWithPrompt(
      `Hướng dẫn giải quyết chi tiết mã lỗi kích hoạt ${code}. Cung cấp nguyên nhân, câu lệnh CMD/PowerShell khắc phục và lưu ý tuân thủ bản quyền.`
    );
  };

  // CMS: Article Save
  const handleSaveArticle = async (artData: Partial<Article>): Promise<boolean> => {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không thể lưu bài viết');
      showToast('Đã lưu bài viết thành công!', 'success');
      await loadData();
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // CMS: Article Delete
  const handleDeleteArticle = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không thể xóa bài viết');
      showToast('Đã xóa bài viết!', 'success');
      await loadData();
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // CMS: Category Save
  const handleSaveCategory = async (catData: Partial<Category>): Promise<boolean> => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không thể lưu danh mục');
      showToast('Đã lưu danh mục thành công!', 'success');
      await loadData();
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // CMS: Category Delete
  const handleDeleteCategory = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không thể xóa danh mục');
      showToast('Đã xóa danh mục!', 'success');
      await loadData();
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // CMS: Add Backup Key
  const handleAddBackupKey = async (key: string, label: string) => {
    try {
      const res = await fetch('/api/keys/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, label }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không thể thêm khóa');
      await loadData();
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  // CMS: Test Key Ping
  const handleTestKey = async (id: string) => {
    try {
      const res = await fetch('/api/keys/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      await loadData();
      return {
        success: data.success,
        message: data.message,
        latencyMs: data.latencyMs,
      };
    } catch (err: any) {
      return { success: false, message: err.message, latencyMs: 0 };
    }
  };

  // CMS: Reset Key Status
  const handleResetKey = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/keys/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không thể khôi phục khóa');
      showToast('Đã khôi phục trạng thái khóa!', 'success');
      await loadData();
      return true;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  // Search query in header
  const [searchQuery, setSearchQuery] = useState('');

  // Active Key Count for floating badge
  const activeKeysCount = keyPoolItems.filter(
    (k) => k.status === 'active' || k.status === 'standby'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-fadeIn">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDark={isDarkMode}
        onToggleTheme={toggleDarkMode}
        onOpenChat={(prompt) => {
          if (prompt) {
            handleOpenChatWithPrompt(prompt);
          } else {
            setIsChatOpen(true);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          handleGlobalSearch(q);
        }}
        activeKeyCount={activeKeysCount}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            categories={categories}
            articles={articles}
            onSelectArticle={(art) => setSelectedArticle(art)}
            onOpenChatWithPrompt={handleOpenChatWithPrompt}
            onSelectCategory={handleSelectCategory}
            selectedCategoryId={selectedCategoryId}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'articles' && (
          <ArticlesView
            categories={categories}
            articles={articles}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => setSelectedCategoryId(id)}
            onSelectArticle={(art) => setSelectedArticle(art)}
            onOpenChatWithPrompt={handleOpenChatWithPrompt}
          />
        )}

        {activeTab === 'cms' && (
          <AdminCMS
            categories={categories}
            articles={articles}
            keyPoolItems={keyPoolItems}
            inquiries={inquiries}
            onRefreshData={loadData}
            onSaveArticle={handleSaveArticle}
            onDeleteArticle={handleDeleteArticle}
            onSaveCategory={handleSaveCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddBackupKey={handleAddBackupKey}
            onTestKey={handleTestKey}
            onResetKey={handleResetKey}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            onNavigateContact={() => {
              setActiveTab('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === 'contact' && (
          <ContactView onOpenChat={() => setIsChatOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenErrorCode={handleOpenErrorCode}
      />

      {/* Article Detail Reader Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onOpenChatWithPrompt={(prompt) => {
          setSelectedArticle(null);
          handleOpenChatWithPrompt(prompt);
        }}
      />

      {/* Floating AI Chatbot Toggle Button */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
          {/* Subtle Key Pool indicator tooltip */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-medium shadow-md backdrop-blur border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gemini AI • {activeKeysCount} Keys Sẵn Sàng (Failover)</span>
          </div>

          <button
            onClick={() => setIsChatOpen(true)}
            className="group px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-blue-500/25 flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-300"></span>
            </div>
            <span>Trợ Lý Bản Quyền AI</span>
            <Sparkles className="w-4 h-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      )}

      {/* Chatbot Drawer Component */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        keyPoolItems={keyPoolItems}
        initialPrompt={chatInitialPrompt}
        onClearInitialPrompt={() => setChatInitialPrompt(undefined)}
      />
    </div>
  );
}

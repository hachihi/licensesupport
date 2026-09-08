import React, { useState } from 'react';
import { Article, Category, KeyPoolItem, ContactInquiry } from '../types';
import {
  FileText,
  FolderPlus,
  Key,
  Mail,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Terminal,
  Activity,
  Zap,
  Sliders,
  Check,
  Lock,
  Shield,
  KeyRound,
  Copy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { formatDate, formatDateTime } from '../utils/helpers';

interface AdminCMSProps {
  categories: Category[];
  articles: Article[];
  keyPoolItems: KeyPoolItem[];
  inquiries: ContactInquiry[];
  onRefreshData: () => void;
  onSaveArticle: (art: Partial<Article>) => Promise<boolean>;
  onDeleteArticle: (id: string) => Promise<boolean>;
  onSaveCategory: (cat: Partial<Category>) => Promise<boolean>;
  onDeleteCategory: (id: string) => Promise<boolean>;
  onAddBackupKey: (key: string, label: string) => Promise<{ success: boolean; message: string }>;
  onTestKey: (id: string) => Promise<{ success: boolean; message: string; latencyMs: number }>;
  onResetKey: (id: string) => Promise<boolean>;
  onChangePassword?: (newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  categories,
  articles,
  keyPoolItems,
  inquiries,
  onRefreshData,
  onSaveArticle,
  onDeleteArticle,
  onSaveCategory,
  onDeleteCategory,
  onAddBackupKey,
  onTestKey,
  onResetKey,
  onChangePassword,
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'categories' | 'keys' | 'inquiries' | 'security'>('articles');
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Change Password state
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Modal states for Article
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);

  // Modal states for Category
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Key pool inputs
  const [newKeyInput, setNewKeyInput] = useState('');
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [keyActionMsg, setKeyActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);

  // Safe normalized arrays
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeArticles = Array.isArray(articles) ? articles : [];
  const safeKeys = Array.isArray(keyPoolItems) ? keyPoolItems : [];
  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  // Filtered articles
  const filteredArticles = safeArticles.filter((a) => {
    const matchCat = selectedCategoryFilter === 'all' || a.categoryId === selectedCategoryFilter;
    const matchSearch =
      !articleSearch ||
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(articleSearch.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Handle open add/edit article
  const handleOpenArticleModal = (art?: Article) => {
    if (art) {
      setEditingArticle({ ...art });
    } else {
      setEditingArticle({
        title: '',
        categoryId: safeCategories[0]?.id || '',
        summary: '',
        content: `## 1. Giới thiệu vấn đề\n\nNội dung hướng dẫn chi tiết...\n\n\`\`\`cmd\nslmgr.vbs /dli\n\`\`\``,
        tags: ['Windows', 'Bản quyền'],
        difficulty: 'Cơ bản',
        status: 'published',
        author: 'Chuyên viên Bản quyền LicenseTech',
        relatedErrorCodes: [],
      });
    }
    setIsArticleModalOpen(true);
  };

  const handleSaveArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title || !editingArticle.categoryId || !editingArticle.content) {
      alert('Vui lòng điền đầy đủ tiêu đề, danh mục và nội dung');
      return;
    }
    const success = await onSaveArticle(editingArticle);
    if (success) {
      setIsArticleModalOpen(false);
      setEditingArticle(null);
    }
  };

  // Handle open add/edit category
  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory({ ...cat });
    } else {
      setEditingCategory({
        name: '',
        slug: '',
        description: '',
        icon: 'Folder',
        color: 'blue',
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) {
      alert('Vui lòng điền tên danh mục');
      return;
    }
    const success = await onSaveCategory(editingCategory);
    if (success) {
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    }
  };

  // Handle Add Backup Key
  const handleAddKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) return;
    const res = await onAddBackupKey(newKeyInput.trim(), newKeyLabel.trim());
    if (res.success) {
      setKeyActionMsg({ type: 'success', text: res.message });
      setNewKeyInput('');
      setNewKeyLabel('');
    } else {
      setKeyActionMsg({ type: 'error', text: res.message });
    }
    setTimeout(() => setKeyActionMsg(null), 4000);
  };

  const handleTestKeyClick = async (id: string) => {
    setTestingKeyId(id);
    const res = await onTestKey(id);
    setTestingKeyId(null);
    setKeyActionMsg({
      type: res.success ? 'success' : 'error',
      text: res.message,
    });
    setTimeout(() => setKeyActionMsg(null), 4000);
  };

  // Handle Change Password Submit
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length < 6) {
      setPasswordStatusMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordStatusMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }
    if (!onChangePassword) {
      setPasswordStatusMsg({ type: 'error', text: 'Hệ thống chưa thiết lập tính năng đổi mật khẩu' });
      return;
    }

    setIsSubmittingPassword(true);
    setPasswordStatusMsg(null);
    try {
      const res = await onChangePassword(newPasswordInput);
      if (res.success) {
        setPasswordStatusMsg({
          type: 'success',
          text: res.message || 'Đã cập nhật mật khẩu quản trị thành công!',
        });
        setNewPasswordInput('');
        setConfirmPasswordInput('');
      } else {
        setPasswordStatusMsg({
          type: 'error',
          text: res.message || 'Không thể cập nhật mật khẩu',
        });
      }
    } catch (err: any) {
      setPasswordStatusMsg({
        type: 'error',
        text: err.message || 'Lỗi xử lý đổi mật khẩu',
      });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleCopyEnvConfig = () => {
    navigator.clipboard.writeText('ADMIN_PASSWORD="mat_khau_moi_cua_ban"');
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            Hệ Thống Quản Trị Nội Dung
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Quản Lý Chuyên Đề & Cấu Hình Multi-Key Gemini
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Quản trị danh mục, cập nhật cẩm nang kỹ thuật, theo dõi khóa API dự phòng và hộp thư tư vấn.
          </p>
        </div>

        <button
          onClick={onRefreshData}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-2 transition w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm mới dữ liệu
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'articles'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Quản lý Bài viết ({safeArticles.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          Quản lý Danh mục ({safeCategories.length})
        </button>

        <button
          onClick={() => setActiveTab('keys')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer relative ${
            activeTab === 'keys'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4 text-amber-500" />
          Khóa Gemini & Failover ({safeKeys.length})
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'inquiries'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          Hộp thư Liên hệ ({safeInquiries.length})
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4 text-rose-500" />
          Bảo Mật & Đổi Mật Khẩu
        </button>
      </div>

      {/* Action alert banner */}
      {keyActionMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-medium animate-fadeIn ${
            keyActionMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {keyActionMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>{keyActionMsg.text}</span>
        </div>
      )}

      {/* TAB 1: ARTICLES MANAGEMENT */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
              >
                <option value="all">Tất cả danh mục</option>
                {safeCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleOpenArticleModal()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Thêm Bài Viết Mới
            </button>
          </div>

          {/* Articles Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="p-3.5 font-semibold">Tiêu đề bài viết</th>
                    <th className="p-3.5 font-semibold">Danh mục</th>
                    <th className="p-3.5 font-semibold">Độ khó</th>
                    <th className="p-3.5 font-semibold">Lượt xem</th>
                    <th className="p-3.5 font-semibold">Cập nhật</th>
                    <th className="p-3.5 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Không tìm thấy bài viết nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art) => {
                      const cat = safeCategories.find((c) => c.id === art.categoryId);
                      return (
                        <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="p-3.5 max-w-sm">
                            <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {art.title}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{art.summary}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[11px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                              {cat?.name || 'Chung'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                              {art.difficulty}
                            </span>
                          </td>
                          <td className="p-3.5 text-[11px] font-mono">{art.views}</td>
                          <td className="p-3.5 text-[11px] text-slate-400">{formatDate(art.updatedAt)}</td>
                          <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenArticleModal(art)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition cursor-pointer"
                              title="Chỉnh sửa bài viết"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Bạn có chắc muốn xóa bài viết "${art.title}"?`)) {
                                  onDeleteArticle(art.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition cursor-pointer"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Danh sách danh mục chuyên đề ({safeCategories.length})
            </h2>
            <button
              onClick={() => handleOpenCategoryModal()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Thêm Danh Mục
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                      {cat.name.charAt(0)}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {cat.articleCount ?? 0} bài viết
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.description || 'Chuyên đề kỹ thuật'}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 block">Slug: /{cat.slug}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenCategoryModal(cat)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa danh mục "${cat.name}"?`)) {
                        onDeleteCategory(cat.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GEMINI KEY POOL & FAILOVER ENGINE */}
      {activeTab === 'keys' && (
        <div className="space-y-8">
          {/* Engine Status Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 border border-blue-800/40 text-white shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  Hệ Thống Tự Động Xoay Vòng & Chuyển Khóa Dự Phòng (Failover Active)
                </span>
                <h3 className="text-xl font-bold">
                  Gemini API Multi-Key Pool & High Availability
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Cơ chế tự động dự phòng: Khi khóa chính gặp sự cố (vượt quá hạn mức 429 Quota Exceeded, lỗi mạng hoặc khóa hết hạn), hệ thống tự động chuyển tiếp yêu cầu sang các khóa dự phòng kế tiếp trong tích tắc mà không làm gián đoạn người dùng.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-bold text-sky-400">{keyPoolItems.length}</span>
                  <span className="text-[11px] text-slate-300 block">Tổng số khóa</span>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl font-bold text-emerald-400">
                    {keyPoolItems.filter((k) => k.status === 'active' || k.status === 'standby').length}
                  </span>
                  <span className="text-[11px] text-slate-300 block">Sẵn sàng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add New Backup Key Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm Khóa Gemini API Dự Phòng Vào Bể Khóa (Key Pool)
            </h3>
            <form onSubmit={handleAddKeySubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Nhãn gợi nhớ
                </label>
                <input
                  type="text"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder="Vd: Key Dự Phòng Dev 2"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2 flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Khóa Gemini API (Bắt đầu bằng AIzaSy...)
                  </label>
                  <input
                    type="password"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    placeholder="Dán API Key Gemini của bạn vào đây..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer h-[38px]"
                >
                  Thêm Khóa
                </button>
              </div>
            </form>
          </div>

          {/* Keys Pool List Cards */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              Danh Sách Khóa Được Quản Trị ({safeKeys.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeKeys.map((k) => (
                <div
                  key={k.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{k.label}</span>
                        {k.isPrimary && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            Khóa chính
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                        {k.maskedKey}
                      </span>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 ${
                        k.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300'
                          : k.status === 'standby'
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300'
                          : k.status === 'rate_limited'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          k.status === 'active'
                            ? 'bg-emerald-500'
                            : k.status === 'standby'
                            ? 'bg-sky-500'
                            : k.status === 'rate_limited'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      ></span>
                      {k.status === 'active'
                        ? 'Đang hoạt động'
                        : k.status === 'standby'
                        ? 'Sẵn sàng dự phòng'
                        : k.status === 'rate_limited'
                        ? 'Vượt quota'
                        : 'Lỗi kết nối'}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Yêu cầu</span>
                      <strong className="text-slate-700 dark:text-slate-200">{k.totalRequests}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Thành công</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{k.successCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Độ trễ</span>
                      <strong className="text-slate-700 dark:text-slate-200">
                        {k.latencyMs ? `${k.latencyMs}ms` : 'Chưa đo'}
                      </strong>
                    </div>
                  </div>

                  {k.lastError && (
                    <p className="text-[11px] text-rose-500 font-mono line-clamp-1 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded">
                      Lỗi gần nhất: {k.lastError}
                    </p>
                  )}

                  {/* Actions on Key */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {k.status === 'rate_limited' || k.status === 'error' ? (
                      <button
                        onClick={() => onResetKey(k.id)}
                        className="px-2.5 py-1 text-xs text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 rounded transition"
                      >
                        Khôi phục trạng thái
                      </button>
                    ) : null}

                    <button
                      onClick={() => handleTestKeyClick(k.id)}
                      disabled={testingKeyId === k.id}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {testingKeyId === k.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
                      ) : (
                        <Zap className="w-3 h-3 text-amber-500" />
                      )}
                      Kiểm tra khóa (Test Ping)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Danh sách yêu cầu tư vấn bản quyền ({inquiries.length})
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {inquiries.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Chưa có yêu cầu tư vấn nào được gửi tới.
                </div>
              ) : (
                safeInquiries.map((inq) => (
                  <div key={inq.id} className="p-5 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-slate-900 dark:text-white">{inq.fullName}</strong>
                        {inq.company && (
                          <span className="text-xs text-slate-500">({inq.company})</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{formatDateTime(inq.createdAt)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span>Email: <strong className="text-blue-600">{inq.email}</strong></span>
                      <span>SĐT: <strong className="text-slate-700 dark:text-slate-300">{inq.phone}</strong></span>
                      <span>Phần mềm: <strong className="text-slate-700 dark:text-slate-300">{inq.softwareType}</strong></span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-medium text-[10px]">
                        {inq.inquiryType}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      {inq.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY & PASSWORD CHANGE */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-500" />
                Bảo Mật & Đổi Mật Khẩu Quản Trị
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Quản lý mật khẩu truy cập hệ thống CMS và phân quyền bể khóa Multi-Key Gemini.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Đổi Mật Khẩu Trực Tiếp */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Đổi Mật Khẩu Trực Tiếp (Có hiệu lực ngay)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cập nhật mật khẩu quản trị tức thì cho toàn bộ máy chủ mà không cần khởi động lại.
                  </p>
                </div>
              </div>

              {passwordStatusMsg && (
                <div
                  className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-medium ${
                    passwordStatusMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {passwordStatusMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span>{passwordStatusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Mật khẩu mới (Tối thiểu 6 ký tự) *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Nhập mật khẩu mới..."
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nhập lại mật khẩu mới để xác nhận *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Xác nhận lại mật khẩu mới..."
                      className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    Lưu ý về phiên đăng nhập
                  </div>
                  <p>
                    Sau khi đổi thành công, hệ thống tự động cập nhật token trong trình duyệt để bạn tiếp tục quản trị mà không cần đăng nhập lại.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingPassword ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang cập nhật mật khẩu...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Cập Nhật Mật Khẩu Quản Trị</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Hướng Dẫn Cấu Hình Biến Môi Trường Vercel */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Cấu Hình Biến Môi Trường (Vercel)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Khuyên dùng khi triển khai dự án lên Vercel hoặc Cloud
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Nếu bạn triển khai web lên <strong>Vercel</strong>, bạn có thể thiết lập mật khẩu cố định qua biến môi trường để đảm bảo mật khẩu không bị reset khi redeploy:
                </p>

                <ol className="list-decimal list-inside space-y-1.5 pl-1 font-medium text-slate-700 dark:text-slate-200">
                  <li>Vào <strong>Vercel Dashboard</strong> &rarr; Chọn Project.</li>
                  <li>Nhấp vào tab <strong>Settings</strong> &rarr; Mục <strong>Environment Variables</strong>.</li>
                  <li>Thêm biến mới:
                    <div className="mt-1.5 p-2.5 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] flex items-center justify-between">
                      <span>ADMIN_PASSWORD="mat_khau_cua_ban"</span>
                      <button
                        type="button"
                        onClick={handleCopyEnvConfig}
                        className="text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                        title="Sao chép"
                      >
                        {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[10px]">{copiedEnv ? 'Đã chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                  </li>
                  <li>Bấm <strong>Save</strong> và Redeploy lại bản build mới nhất.</li>
                </ol>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 space-y-1 text-[11px]">
                  <strong>Thứ tự ưu tiên mật khẩu:</strong>
                  <ul className="list-disc list-inside space-y-0.5 mt-0.5">
                    <li>1. Biến môi trường Vercel (<code className="font-bold">ADMIN_PASSWORD</code>)</li>
                    <li>2. Mật khẩu đổi trực tiếp tại form CMS bên cạnh</li>
                    <li>3. Mặc định gốc: <code className="font-bold">admin@licensetech2026</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ARTICLE */}
      {isArticleModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 my-auto max-h-[90vh] flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              {editingArticle.id ? 'Chỉnh sửa chuyên đề bài viết' : 'Thêm mới chuyên đề bài viết'}
            </h3>

            <form onSubmit={handleSaveArticleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="Nhập tiêu đề hướng dẫn..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Danh mục *
                  </label>
                  <select
                    value={editingArticle.categoryId || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    {safeCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Độ khó
                  </label>
                  <select
                    value={editingArticle.difficulty || 'Cơ bản'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, difficulty: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Trung cấp">Trung cấp</option>
                    <option value="Chuyên sâu">Chuyên sâu</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={editingArticle.status || 'published'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="published">Đã xuất bản (Published)</option>
                    <option value="draft">Bản nháp (Draft)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tóm tắt kỹ thuật ngắn
                </label>
                <textarea
                  rows={2}
                  value={editingArticle.summary || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  placeholder="Mô tả tóm tắt nội dung chính..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nội dung bài viết (Hỗ trợ định dạng Markdown & Code Block) *
                </label>
                <textarea
                  rows={10}
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Soạn thảo markdown..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
                >
                  Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
              {editingCategory.id ? 'Sửa danh mục' : 'Thêm danh mục mới'}
            </h3>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="Vd: Bảo mật & Antivirus Doanh nghiệp"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Mô tả danh mục
                </label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Mô tả phạm vi hướng dẫn của danh mục..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Lưu danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

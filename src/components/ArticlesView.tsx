import React, { useState } from 'react';
import { Article, Category } from '../types';
import { Search, Filter, Calendar, Eye, ArrowRight, BookOpen, AlertTriangle, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/helpers';

interface ArticlesViewProps {
  categories: Category[];
  articles: Article[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectArticle: (article: Article) => void;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  categories,
  articles,
  selectedCategoryId,
  onSelectCategory,
  onSelectArticle,
  onOpenChatWithPrompt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'Cơ bản' | 'Trung cấp' | 'Chuyên sâu'>('all');

  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeArticles = Array.isArray(articles) ? articles : [];

  const filteredArticles = safeArticles.filter((art) => {
    const matchCategory = selectedCategoryId === 'all' || art.categoryId === selectedCategoryId;
    const matchDifficulty = selectedDifficulty === 'all' || art.difficulty === selectedDifficulty;
    const matchSearch =
      !searchQuery ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.relatedErrorCodes && art.relatedErrorCodes.some((e) => e.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchCategory && matchDifficulty && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          Thư Viện Tri Thức Kỹ Thuật
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Chuyên Đề Hướng Dẫn Kỹ Thuật Bản Quyền Phần Mềm
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Tổng hợp tài liệu hướng dẫn kích hoạt, xử lý mã lỗi, quản trị máy chủ bản quyền và pháp lý phần mềm.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết, mã lỗi (0xC004C008, KMS, slmgr...)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategoryId}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 flex-1 md:flex-initial"
          >
            <option value="all">Tất cả danh mục</option>
            {safeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 flex-1 md:flex-initial"
          >
            <option value="all">Mọi cấp độ</option>
            <option value="Cơ bản">Cơ bản</option>
            <option value="Trung cấp">Trung cấp</option>
            <option value="Chuyên sâu">Chuyên sâu</option>
          </select>
        </div>
      </div>

      {/* Categories chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            selectedCategoryId === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Tất cả ({safeArticles.length})
        </button>
        {safeCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategoryId === c.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {c.name} ({c.articleCount ?? 0})
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Không tìm thấy bài viết nào
          </h3>
          <p className="text-xs text-slate-500">
            Thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Hỏi AI" để được giải đáp ngay.
          </p>
          <button
            onClick={() => onOpenChatWithPrompt(`Hãy hướng dẫn tôi về chủ đề: ${searchQuery || 'Bản quyền phần mềm'}`)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold transition"
          >
            Hỏi Trợ Lý AI Gemini
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => {
            const cat = safeCategories.find((c) => c.id === art.categoryId);
            return (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      {cat?.name || 'Chuyên đề'}
                    </span>
                    <span className="text-[11px] text-slate-400">{formatDate(art.updatedAt)}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>

                  {art.relatedErrorCodes && art.relatedErrorCodes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {art.relatedErrorCodes.map((code) => (
                        <span
                          key={code}
                          className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-mono text-[10px]"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span>{art.views} lượt xem</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

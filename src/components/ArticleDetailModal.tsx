import React, { useState } from 'react';
import { Article } from '../types';
import { X, Calendar, User, Eye, Tag, AlertTriangle, Terminal, Copy, Check, Bot, Share2, BookOpen } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import Markdown from 'react-markdown';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
  onOpenChatWithPrompt: (prompt: string) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onOpenChatWithPrompt,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!article) return null;

  const handleCopyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header Modal */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {article.difficulty}
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.updatedAt)}
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                {article.views} lượt xem
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {article.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Summary Callout */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200 text-sm leading-relaxed">
            <p className="font-semibold mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Tóm tắt kỹ thuật:
            </p>
            {article.summary}
          </div>

          {/* Quick Command Reference if available */}
          {article.commands && article.commands.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                Các câu lệnh kỹ thuật then chốt (Click để sao chép):
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {article.commands.map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-900 text-slate-100 border border-slate-800 text-xs font-mono gap-2"
                  >
                    <div className="space-y-0.5">
                      <span className="text-emerald-400 select-all">{c.cmd}</span>
                      <p className="text-[11px] font-sans text-slate-400">{c.description}</p>
                    </div>
                    <button
                      onClick={() => handleCopyCmd(c.cmd)}
                      className="self-end sm:self-center px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition"
                    >
                      {copiedCmd === c.cmd ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Đã sao chép
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Sao chép
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Error Codes */}
          {article.relatedErrorCodes && article.relatedErrorCodes.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Mã lỗi áp dụng:
              </span>
              {article.relatedErrorCodes.map((code) => (
                <span
                  key={code}
                  className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-mono text-xs rounded"
                >
                  {code}
                </span>
              ))}
            </div>
          )}

          {/* Article Markdown Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
            <div className="markdown-body space-y-4">
              <Markdown>{article.content}</Markdown>
            </div>
          </div>

          {/* Author info */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Tác giả: <strong className="text-slate-900 dark:text-white">{article.author}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              <span>{article.tags.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-100 transition"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? 'Đã sao chép liên kết' : 'Chia sẻ bài viết'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenChatWithPrompt(`Tôi vừa đọc bài viết "${article.title}". Hãy giải thích thêm cho tôi về quy trình này và các lưu ý khi thực hiện.`);
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm transition"
            >
              <Bot className="w-4 h-4" />
              Hỏi Trợ Lý AI về bài viết này
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium hover:bg-slate-300 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

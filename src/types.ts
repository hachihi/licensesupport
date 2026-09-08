export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  articleCount?: number;
}

export type ArticleDifficulty = 'Cơ bản' | 'Trung cấp' | 'Chuyên sâu';
export type ArticleStatus = 'published' | 'draft';

export interface Article {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  summary: string;
  content: string;
  tags: string[];
  difficulty: ArticleDifficulty;
  status: ArticleStatus;
  views: number;
  updatedAt: string;
  author: string;
  relatedErrorCodes?: string[];
  commands?: {
    cmd: string;
    description: string;
  }[];
}

export type KeyStatus = 'active' | 'standby' | 'rate_limited' | 'error';

export interface KeyPoolItem {
  id: string;
  label: string;
  maskedKey: string;
  status: KeyStatus;
  isPrimary: boolean;
  totalRequests: number;
  successCount: number;
  failureCount: number;
  lastUsed?: string;
  latencyMs?: number;
  lastError?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  keyUsed?: string;
  failoverOccurred?: boolean;
  error?: boolean;
  suggestions?: string[];
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  softwareType: string;
  inquiryType: 'activation_error' | 'new_license' | 'license_audit' | 'renewal' | 'general';
  message: string;
  createdAt: string;
  status: 'new' | 'in_progress' | 'resolved';
}

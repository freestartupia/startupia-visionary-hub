
export type BlogCategory = 
  | 'ai-trends'
  | 'startup-advice'
  | 'investment'
  | 'tech-news'
  | 'case-studies'
  | 'interviews'
  | 'tutorials'
  | 'opinion'
  | 'events'
  | 'Actualités'
  | 'Growth'
  | 'Technique'
  | 'Interviews'
  | 'Outils'
  | 'Levées de fonds'
  | 'Startup du mois';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  coverImage?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  featured?: boolean;
  readingTime: string;
  status?: 'pending' | 'published' | 'rejected';
  adminReason?: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
  company?: string;
}


export type BlogCategory = 
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
  status?: 'draft' | 'published' | 'pending';
}


import { BlogCategory } from '@/types/blog';

export const BlogCategoryLabels: Record<BlogCategory, string> = {
  'ai-trends': 'Tendances IA',
  'startup-advice': 'Conseils pour startups',
  'investment': 'Investissement',
  'tech-news': 'Actualités tech',
  'case-studies': 'Études de cas',
  'interviews': 'Interviews',
  'tutorials': 'Tutoriels',
  'opinion': 'Opinion',
  'events': 'Événements'
};

export const BlogCategoryValues: BlogCategory[] = [
  'ai-trends',
  'startup-advice',
  'investment',
  'tech-news',
  'case-studies',
  'interviews',
  'tutorials',
  'opinion',
  'events'
];

export const getBlogCategoryLabel = (category: BlogCategory): string => {
  return BlogCategoryLabels[category] || category;
};

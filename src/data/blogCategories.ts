
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
  'events': 'Événements',
  'Actualités': 'Actualités',
  'Growth': 'Growth',
  'Technique': 'Technique',
  'Interviews': 'Interviews',
  'Outils': 'Outils',
  'Levées de fonds': 'Levées de fonds',
  'Startup du mois': 'Startup du mois'
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
  'events',
  'Actualités',
  'Growth',
  'Technique',
  'Outils',
  'Levées de fonds',
  'Startup du mois'
];

export const getBlogCategoryLabel = (category: BlogCategory): string => {
  return BlogCategoryLabels[category] || category;
};


import { BlogPost, BlogCategory } from "@/types/blog";

// Tableau vide pour les articles de blog (les données de démonstration ont été supprimées)
export const mockBlogPosts: BlogPost[] = [];

export const getAllBlogCategories = (): BlogCategory[] => {
  return ["Actualités", "Growth", "Technique", "Interviews", "Outils", "Levées de fonds", "Startup du mois"];
};

export const getRecentPosts = (count: number = 5): BlogPost[] => {
  return [...mockBlogPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return mockBlogPosts.filter(post => post.featured);
};

export const getPostsByCategory = (category: BlogCategory): BlogPost[] => {
  return mockBlogPosts.filter(post => post.category === category);
};

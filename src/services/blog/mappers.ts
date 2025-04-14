
import { BlogPost, BlogCategory } from '@/types/blog';

/**
 * Maps a database response object to a BlogPost type
 */
export const mapDbPostToBlogPost = (dbPost: any): BlogPost => {
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    excerpt: dbPost.excerpt,
    content: dbPost.content,
    category: dbPost.category as BlogCategory,
    coverImage: dbPost.cover_image,
    authorId: dbPost.author_id,
    authorName: dbPost.author_name,
    authorAvatar: dbPost.author_avatar,
    createdAt: dbPost.created_at,
    updatedAt: dbPost.updated_at,
    tags: dbPost.tags || [],
    featured: dbPost.featured || false,
    readingTime: dbPost.reading_time,
  };
};

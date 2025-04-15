
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogCategory } from "@/types/blog";
import { toast } from "@/hooks/use-toast";

// Fonction pour convertir les données de Supabase au format de notre application
const mapSupabasePostToAppPost = (post: any): BlogPost => {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    coverImage: post.cover_image,
    authorId: post.author_id,
    authorName: post.author_name,
    authorAvatar: post.author_avatar,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    tags: post.tags || [],
    featured: post.featured || false,
    readingTime: post.reading_time,
    status: post.status || 'draft'
  };
};

// Fonction pour convertir les données de notre application au format Supabase
const mapAppPostToSupabasePost = (post: Partial<BlogPost>) => {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    cover_image: post.coverImage,
    author_id: post.authorId,
    author_name: post.authorName,
    author_avatar: post.authorAvatar,
    created_at: post.createdAt,
    updated_at: post.updatedAt,
    tags: post.tags,
    featured: post.featured,
    reading_time: post.readingTime,
    status: post.status
  };
};

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data ? data.map(mapSupabasePostToAppPost) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return [];
  }
};

export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) throw error;
    return data ? mapSupabasePostToAppPost(data) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    return null;
  }
};

export const createBlogPost = async (post: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    // Ensure required fields are present
    const postData = {
      ...mapAppPostToSupabasePost(post),
      author_name: post.authorName || 'Utilisateur',
      created_at: new Date().toISOString(),
      status: post.status || 'draft',
      reading_time: post.readingTime || '1 min'
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select()
      .single();
      
    if (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      toast({
        title: "Erreur",
        description: `Impossible de créer l'article: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
    
    toast({
      title: "Succès",
      description: "L'article a été créé avec succès",
    });
    
    return data ? mapSupabasePostToAppPost(data) : null;
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    return null;
  }
};

export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const updateData = {
      ...mapAppPostToSupabasePost(post),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour l'article: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
    
    toast({
      title: "Succès",
      description: "L'article a été mis à jour avec succès",
    });
    
    return data ? mapSupabasePostToAppPost(data) : null;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    return null;
  }
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const estimateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
};

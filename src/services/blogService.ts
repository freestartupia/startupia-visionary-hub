
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogCategory } from "@/types/blog";
import { toast } from "@/hooks/use-toast";

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
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
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    return null;
  }
};

export const createBlogPost = async (post: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
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
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    return null;
  }
};

export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(post)
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
    
    return data;
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

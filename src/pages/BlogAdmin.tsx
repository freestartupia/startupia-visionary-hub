
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { BlogPost, BlogCategory } from '@/types/blog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import SEO from '@/components/SEO';
import BlogPostEditor from '@/components/blog/BlogPostEditor';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const BlogAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification
  useEffect(() => {
    if (!user) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      navigate('/auth');
      return;
    }
    
    // Accès autorisé pour tous les utilisateurs connectés
    loadPosts();
  }, [user, navigate]);

  // Charger les articles
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedPosts: BlogPost[] = data.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category as BlogCategory,
          coverImage: post.cover_image,
          authorId: post.author_id,
          authorName: post.author_name,
          authorAvatar: post.author_avatar,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          tags: post.tags || [],
          featured: post.featured,
          readingTime: post.reading_time,
          status: (post.status || 'draft') as 'draft' | 'published' | 'pending'
        }));
        
        setPosts(formattedPosts);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des articles:', err);
      toast.error('Impossible de charger les articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentPost(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setPosts(posts.filter(post => post.id !== id));
        toast.success('Article supprimé');
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        toast.error('Impossible de supprimer l\'article');
      }
    }
  };

  const handleSave = async (savedPost: BlogPost) => {
    if (currentPost) {
      setPosts(posts.map(p => p.id === savedPost.id ? savedPost : p));
    } else {
      setPosts([savedPost, ...posts]);
    }
    setIsEditorOpen(false);
    setCurrentPost(null);
    
    // Rafraîchir la liste des articles après avoir sauvegardé
    loadPosts();
  };

  if (isEditorOpen) {
    return <BlogPostEditor post={currentPost} onSave={handleSave} onCancel={() => setIsEditorOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Administration du Blog – Startupia"
        description="Interface d'administration du blog Startupia"
      />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Administration du Blog</h1>
          <Button onClick={handleCreateNew} className="bg-startupia-turquoise hover:bg-startupia-turquoise/80">
            <Plus size={16} className="mr-2" />
            Nouvel Article
          </Button>
        </div>
        
        <div className="bg-black/30 p-6 rounded-lg border border-startupia-turquoise/20">
          <h2 className="text-xl font-semibold mb-4">Liste des Articles</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise mx-auto"></div>
              <p className="mt-4 text-white/60">Chargement des articles...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              Aucun article trouvé. Créez votre premier article en cliquant sur "Nouvel Article".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Titre</th>
                    <th className="text-left py-3 px-4">Catégorie</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Statut</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">{post.title}</td>
                      <td className="py-3 px-4">{post.category}</td>
                      <td className="py-3 px-4">{format(new Date(post.createdAt), 'dd/MM/yyyy')}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          post.status === 'published' ? 'bg-startupia-turquoise/20 text-startupia-turquoise' : 'bg-white/10 text-white/80'
                        }`}>
                          {post.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(post)}
                          className="mr-2 text-white/80 hover:text-white"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(post.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogAdmin;

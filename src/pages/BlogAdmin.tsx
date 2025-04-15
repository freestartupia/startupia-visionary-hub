
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import SEO from '@/components/SEO';
import BlogPostEditor from '@/components/blog/BlogPostEditor';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const BlogAdmin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
      
      setIsLoaded(true);
    };
    
    if (user) {
      checkIfAdmin();
    } else if (!isLoading) {
      setIsLoaded(true);
    }
  }, [user, isLoading]);

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        toast.error('Erreur lors du chargement des articles');
      } else {
        setPosts(data as BlogPost[]);
      }
    };
    
    fetchPosts();
  }, []);

  // If not authenticated or not admin, redirect to home
  useEffect(() => {
    if (isLoaded && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [isLoaded, user, isAdmin, navigate]);

  const handleCreateNew = () => {
    setCurrentPost(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting post:', error);
        toast.error('Erreur lors de la suppression');
      } else {
        setPosts(posts.filter(post => post.id !== id));
        toast.success('Article supprimé avec succès');
      }
    }
  };

  const handleSave = async (savedPost: BlogPost) => {
    // Update posts list after save
    if (currentPost) {
      setPosts(posts.map(p => p.id === savedPost.id ? savedPost : p));
    } else {
      setPosts([savedPost, ...posts]);
    }
    setIsEditorOpen(false);
    setCurrentPost(null);
  };

  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

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
          
          {posts.length === 0 ? (
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
                    <th className="text-left py-3 px-4">Status</th>
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
                          post.featured ? 'bg-startupia-turquoise/20 text-startupia-turquoise' : 'bg-white/10 text-white/80'
                        }`}>
                          {post.featured ? 'À la une' : 'Standard'}
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

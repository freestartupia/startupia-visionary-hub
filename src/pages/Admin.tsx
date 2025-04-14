
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserRoleManagement from '@/components/admin/UserRoleManagement';
import { getBlogPostsByStatus, flagBlogPost } from '@/services/blog/postModerationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Eye, Flag, Shield } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('published');
  const [pendingPosts, setPendingPosts] = useState<BlogPost[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<BlogPost[]>([]);
  const [rejectedPosts, setRejectedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Dans le nouveau système, nous mettons l'accent sur les articles publiés
      const published = await getBlogPostsByStatus('published');
      const rejected = await getBlogPostsByStatus('rejected');
      
      // Pour la compatibilité, gardons aussi les pending
      const pending = await getBlogPostsByStatus('pending');
      
      setPendingPosts(pending);
      setPublishedPosts(published);
      setRejectedPosts(rejected);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Erreur lors du chargement des articles');
      toast.error('Erreur lors du chargement des articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPost = (slug: string) => {
    // Ouvrir l'article dans un nouvel onglet
    window.open(`/blog/${slug}`, '_blank');
  };

  const handleHidePost = async (postId: string) => {
    try {
      const result = await flagBlogPost(postId, 'hide', 'Article masqué par modération');
      if (result.success) {
        toast.success('Article masqué');
        fetchPosts();
      } else {
        toast.error(result.error || 'Erreur lors de la modération');
      }
    } catch (error) {
      console.error('Error hiding post:', error);
      toast.error('Erreur lors de la modération');
    }
  };

  const renderLoading = () => (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
    </div>
  );

  const renderError = () => (
    <div className="p-6 bg-red-900/20 rounded-lg border border-red-700 mb-4">
      <p className="text-red-400">{error}</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2 border-red-700 text-red-400 hover:bg-red-900/30"
        onClick={fetchPosts}
      >
        Réessayer
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Administration - Startupia"
        description="Panneau d'administration pour Startupia"
      />
      
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <h1 className="text-3xl font-bold mb-6">Administration</h1>
        
        <div className="mb-6 p-4 border border-white/20 rounded-lg bg-white/5">
          <h2 className="text-xl font-semibold text-white mb-2">Mode de publication</h2>
          <p className="text-white/70">
            <Shield className="inline-block mr-2 text-emerald-500" size={18} />
            Publication directe activée : Tous les articles sont publiés immédiatement et peuvent être modérés a posteriori.
          </p>
        </div>
        
        {error && renderError()}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="published">Publiés ({publishedPosts.length})</TabsTrigger>
            <TabsTrigger value="rejected">Masqués ({rejectedPosts.length})</TabsTrigger>
            <TabsTrigger value="pending">Anciens en attente ({pendingPosts.length})</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="published" className="space-y-4">
            <h2 className="text-2xl font-semibold">Articles publiés</h2>
            {isLoading ? (
              renderLoading()
            ) : publishedPosts.length === 0 ? (
              <p className="text-white/70">Aucun article publié.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publishedPosts.map((post) => (
                  <Card key={post.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription className="text-white/70">
                        Par {post.authorName} - {new Date(post.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 mb-4">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags?.map((tag, index) => (
                          <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 border-red-500 hover:bg-red-950"
                        onClick={() => handleHidePost(post.id)}
                      >
                        <Flag className="mr-2 h-4 w-4" />
                        Masquer
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleViewPost(post.slug)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="space-y-4">
            <h2 className="text-2xl font-semibold">Articles masqués</h2>
            {isLoading ? (
              renderLoading()
            ) : rejectedPosts.length === 0 ? (
              <p className="text-white/70">Aucun article masqué.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rejectedPosts.map((post) => (
                  <Card key={post.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription className="text-white/70">
                        Par {post.authorName} - {new Date(post.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80">{post.excerpt}</p>
                      {post.adminReason && (
                        <div className="mt-4 p-2 bg-red-900/20 border border-red-800 rounded text-sm">
                          <strong>Raison :</strong> {post.adminReason}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            <h2 className="text-2xl font-semibold">Articles en attente (ancien système)</h2>
            {isLoading ? (
              renderLoading()
            ) : pendingPosts.length === 0 ? (
              <p className="text-white/70">Aucun article en attente de modération.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingPosts.map((post) => (
                  <Card key={post.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription className="text-white/70">
                        Par {post.authorName} - {new Date(post.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 mb-4">{post.excerpt}</p>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-500 hover:bg-red-950"
                          onClick={() => handleHidePost(post.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rejeter
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleViewPost(post.slug)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approuver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="users">
            <h2 className="text-2xl font-semibold mb-4">Gestion des utilisateurs</h2>
            <UserRoleManagement />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;

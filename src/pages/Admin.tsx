
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserRoleManagement from '@/components/admin/UserRoleManagement';
import { getBlogPostsByStatus, updateBlogPostStatus } from '@/services/blog/postModerationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('pending');
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
      console.log("Fetching blog posts for moderation...");
      
      const pending = await getBlogPostsByStatus('pending');
      console.log("Pending posts:", pending);
      
      const published = await getBlogPostsByStatus('published');
      console.log("Published posts:", published);
      
      const rejected = await getBlogPostsByStatus('rejected');
      console.log("Rejected posts:", rejected);
      
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

  const handleApprove = async (postId: string) => {
    try {
      const result = await updateBlogPostStatus(postId, 'published');
      if (result.success) {
        toast.success('Article approuvé et publié');
        fetchPosts();
      } else {
        toast.error(result.error || 'Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('Error approving post:', error);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (postId: string) => {
    try {
      const result = await updateBlogPostStatus(postId, 'rejected');
      if (result.success) {
        toast.success('Article rejeté');
        fetchPosts();
      } else {
        toast.error(result.error || 'Erreur lors du rejet');
      }
    } catch (error) {
      console.error('Error rejecting post:', error);
      toast.error('Erreur lors du rejet');
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
        
        {error && renderError()}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="pending">En attente ({pendingPosts.length})</TabsTrigger>
            <TabsTrigger value="published">Publiés ({publishedPosts.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejetés ({rejectedPosts.length})</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            <h2 className="text-2xl font-semibold">Articles en attente de modération</h2>
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
                          onClick={() => handleReject(post.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rejeter
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(post.id)}
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
          
          <TabsContent value="published" className="space-y-4">
            <h2 className="text-2xl font-semibold">Articles publiés</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
              </div>
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
                      <p className="text-white/80">{post.excerpt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="space-y-4">
            <h2 className="text-2xl font-semibold">Articles rejetés</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
              </div>
            ) : rejectedPosts.length === 0 ? (
              <p className="text-white/70">Aucun article rejeté.</p>
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

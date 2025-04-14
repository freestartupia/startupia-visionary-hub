
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { checkUserHasRole } from '@/services/roleService';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import UserRoleManagement from '@/components/admin/UserRoleManagement';
import { getBlogPostsByStatus, updateBlogPostStatus } from '@/services/blogService';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current user has admin or moderator role
  useEffect(() => {
    const checkPermissions = async () => {
      const admin = await checkUserHasRole('admin');
      const moderator = await checkUserHasRole('moderator');
      setIsAdmin(admin);
      setIsModerator(moderator);
      setIsLoading(false);
      
      // Redirect if not admin or moderator
      if (!admin && !moderator) {
        toast({
          title: 'Accès refusé',
          description: 'Vous n\'avez pas les permissions pour accéder à cette page.',
          variant: 'destructive',
        });
        navigate('/');
      }
    };
    
    checkPermissions();
  }, [navigate, toast]);

  // Fetch pending blog posts
  const { 
    data: pendingPosts = [], 
    refetch: refetchPending
  } = useQuery({
    queryKey: ['pendingBlogPosts'],
    queryFn: () => getBlogPostsByStatus('pending'),
    enabled: isAdmin || isModerator
  });

  // Handle post approval/rejection
  const handleUpdatePostStatus = async (postId: string, status: 'published' | 'rejected') => {
    const result = await updateBlogPostStatus(postId, status);
    
    if (result.success) {
      toast({
        title: status === 'published' ? 'Article publié' : 'Article rejeté',
        description: status === 'published' 
          ? 'L\'article a été publié avec succès.' 
          : 'L\'article a été rejeté.',
      });
      refetchPending();
    } else {
      toast({
        title: 'Erreur',
        description: result.error || 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Administration - StartupIA"
        description="Panneau d'administration StartupIA"
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Panneau <span className="text-startupia-turquoise">d'Administration</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Gérez les utilisateurs, les articles et les permissions
          </p>
        </div>
        
        <Tabs defaultValue="moderation" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="moderation">Modération</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">Utilisateurs</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="moderation" className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Articles en attente de modération</h2>
            
            {pendingPosts.length === 0 ? (
              <div className="text-center py-10 text-white/60">
                <p>Aucun article en attente de modération.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPosts.map(post => (
                  <div key={post.id} className="border border-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-lg">{post.title}</h3>
                        <Badge className="bg-yellow-500/80">{post.category}</Badge>
                      </div>
                      <p className="text-white/60 text-sm">{post.excerpt}</p>
                      <div className="text-xs text-white/50 mt-2">
                        Par {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleUpdatePostStatus(post.id, 'rejected')}
                        variant="destructive"
                        size="sm"
                        className="text-xs"
                      >
                        <X className="h-4 w-4 mr-1" /> Rejeter
                      </Button>
                      <Button 
                        onClick={() => handleUpdatePostStatus(post.id, 'published')}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        size="sm"
                      >
                        <Check className="h-4 w-4 mr-1" /> Approuver
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      >
                        Prévisualiser
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="users">
              <UserRoleManagement />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;

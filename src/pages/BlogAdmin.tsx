
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { fetchPendingPosts, approvePost, rejectPost, checkIsAdmin } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import SEO from '@/components/SEO';

const BlogAdmin: React.FC = () => {
  const [pendingPosts, setPendingPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [postToReject, setPostToReject] = useState<BlogPost | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const admin = await checkIsAdmin();
        setIsAdmin(admin);
        
        if (!admin) {
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'administrateur pour accéder à cette page.",
            variant: "destructive"
          });
          navigate('/blog');
          return;
        }
        
        loadPendingPosts();
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de vos droits d'administrateur.",
          variant: "destructive"
        });
        navigate('/blog');
      }
    };
    
    checkAdmin();
  }, [navigate, toast]);
  
  const loadPendingPosts = async () => {
    setIsLoading(true);
    try {
      const posts = await fetchPendingPosts();
      setPendingPosts(posts);
    } catch (error) {
      console.error("Error loading pending posts:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les articles en attente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApprove = async (post: BlogPost) => {
    if (actionInProgress) return;
    
    setActionInProgress(post.id);
    try {
      await approvePost(post.id);
      setPendingPosts(prev => prev.filter(p => p.id !== post.id));
      toast({
        title: "Article approuvé",
        description: `L'article "${post.title}" a été publié avec succès.`
      });
    } catch (error) {
      console.error("Error approving post:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation de l'article.",
        variant: "destructive"
      });
    } finally {
      setActionInProgress(null);
    }
  };
  
  const handleReject = async (post: BlogPost) => {
    if (actionInProgress) return;
    
    setActionInProgress(post.id);
    try {
      await rejectPost(post.id);
      setPendingPosts(prev => prev.filter(p => p.id !== post.id));
      toast({
        title: "Article rejeté",
        description: `L'article "${post.title}" a été rejeté et supprimé.`
      });
      setPostToReject(null);
    } catch (error) {
      console.error("Error rejecting post:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de l'article.",
        variant: "destructive"
      });
    } finally {
      setActionInProgress(null);
    }
  };
  
  const handlePreview = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };
  
  if (!isAdmin) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Administration du Blog - Startupia"
        description="Interface d'administration pour la modération des articles de blog Startupia."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="container mx-auto pt-28 pb-16 px-4 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Administration du <span className="text-startupia-turquoise">Blog</span>
          </h1>
          <p className="text-white/70">
            Gérez les articles soumis par les utilisateurs
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
          </div>
        ) : pendingPosts.length === 0 ? (
          <Alert className="bg-black/30 border-startupia-turquoise/30 text-white">
            <AlertTriangle className="h-5 w-5 text-startupia-turquoise" />
            <AlertTitle>Aucun article en attente</AlertTitle>
            <AlertDescription>
              Il n'y a actuellement aucun article en attente de modération.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="mb-6">
              <Alert className="bg-black/30 border-startupia-turquoise/30 text-white">
                <AlertTriangle className="h-5 w-5 text-startupia-turquoise" />
                <AlertTitle>{pendingPosts.length} article(s) en attente de modération</AlertTitle>
                <AlertDescription>
                  Lisez attentivement chaque article avant de l'approuver ou de le rejeter.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="rounded-md border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-black/50">
                  <TableRow>
                    <TableHead className="text-white">Titre</TableHead>
                    <TableHead className="text-white">Auteur</TableHead>
                    <TableHead className="text-white">Catégorie</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPosts.map((post) => (
                    <TableRow key={post.id} className="border-white/10">
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.authorName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-startupia-turquoise border-startupia-turquoise">
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(post.createdAt), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePreview(post.slug)}
                            title="Prévisualiser l'article"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleApprove(post)}
                            disabled={!!actionInProgress}
                            className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                            title="Approuver et publier l'article"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                title="Rejeter et supprimer l'article"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-black border border-red-500/30">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Rejeter l'article ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action va supprimer définitivement l'article "{post.title}". Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-black/50 text-white border-white/20 hover:bg-black/30">
                                  Annuler
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleReject(post)}
                                  className="bg-red-500 text-white hover:bg-red-600"
                                >
                                  Rejeter
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogAdmin;

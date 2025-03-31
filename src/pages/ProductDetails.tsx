import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2,
  ExternalLink, 
  Calendar, 
  ArrowLeft,
  Send,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ProductComment } from '@/types/productLaunch';
import { fetchProductById, addComment, upvoteProduct } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        if (!data) {
          toast({
            title: "Erreur",
            description: "Produit non trouvé",
            variant: "destructive"
          });
          navigate('/products');
          return;
        }
        setProduct(data);
      } catch (error) {
        console.error('Failed to load product:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du produit",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [id, toast, navigate]);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    
    setCommentSubmitting(true);
    
    try {
      const tempUserName = "Utilisateur temporaire";
      const result = await addComment(id, newComment, tempUserName);
      
      if (result) {
        toast({
          title: "Commentaire ajouté",
          description: "Votre commentaire a été publié avec succès"
        });
        
        const updatedProduct = await fetchProductById(id);
        if (updatedProduct) {
          setProduct(updatedProduct);
        }
        
        setNewComment('');
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le commentaire",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la publication du commentaire",
        variant: "destructive"
      });
    } finally {
      setCommentSubmitting(false);
    }
  };
  
  const handleUpvote = async () => {
    if (!id) return;
    
    try {
      const success = await upvoteProduct(id);
      
      if (success) {
        setProduct(prev => ({
          ...prev,
          upvotes: (prev.upvotes || 0) + 1
        }));
        
        toast({
          title: "Merci pour votre soutien !",
          description: "Votre vote a été comptabilisé"
        });
      }
    } catch (error) {
      console.error('Failed to upvote:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
    }
  };
  
  const renderComment = (comment: ProductComment) => {
    return (
      <div key={comment.id} className="mb-6 last:mb-0">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.userAvatar} alt={comment.userName} />
            <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{comment.userName}</p>
                <p className="text-xs text-white/60">{formatDate(comment.createdAt)}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ThumbsUp size={14} />
              </Button>
            </div>
            <p className="mt-2 text-white/80">{comment.content}</p>
          </div>
        </div>
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-11 mt-4 border-l-2 border-white/10 pl-4">
            {comment.replies.map(reply => renderComment(reply))}
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-hero-pattern text-white">
        <Navbar />
        <main className="relative container mx-auto pt-24 pb-16 px-4 z-10">
          <div className="mb-6">
            <Button variant="ghost" className="text-white/60">
              <ArrowLeft size={16} className="mr-1" />
              Retour aux produits
            </Button>
          </div>
          
          <Card className="glass-card border border-startupia-turquoise/20 bg-black/30 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/5">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-60" />
                    </div>
                  </div>
                  <Skeleton className="h-40 w-full rounded-md mb-4" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                
                <div className="md:w-3/5">
                  <Skeleton className="h-10 w-full mb-6" />
                  <div className="space-y-6">
                    <div>
                      <Skeleton className="h-6 w-32 mb-3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full mt-2" />
                      <Skeleton className="h-4 w-2/3 mt-2" />
                    </div>
                    <div>
                      <Skeleton className="h-6 w-32 mb-3" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-hero-pattern text-white">
        <Navbar />
        <main className="container mx-auto pt-28 pb-16 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
            <p className="mb-6">Le produit que vous recherchez n'existe pas.</p>
            <Button asChild>
              <Link to="/products">Retour aux produits</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-gold/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <Navbar />
      
      <main className="relative container mx-auto pt-24 pb-16 px-4 z-10">
        <div className="mb-6">
          <Button variant="ghost" className="text-white/60" asChild>
            <Link to="/products">
              <ArrowLeft size={16} className="mr-1" />
              Retour aux produits
            </Link>
          </Button>
        </div>
        
        <Card className="glass-card border border-startupia-turquoise/20 bg-black/30 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-startupia-turquoise/10">
                    {product.logoUrl ? (
                      <img
                        src={product.logoUrl}
                        alt={`${product.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-startupia-turquoise/20 text-startupia-turquoise font-bold text-xl">
                        {product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-white/70">{product.tagline}</p>
                  </div>
                </div>
                
                {product.mediaUrls && product.mediaUrls.length > 0 && (
                  <div className="rounded-md overflow-hidden mb-4">
                    <img 
                      src={product.mediaUrls[0]} 
                      alt={`${product.name} screenshot`} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.category.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="border-startupia-turquoise/30 text-white/80">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={16} className="text-startupia-turquoise" />
                      <span className="font-semibold">{product.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(product.launchDate)}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Share2 size={14} className="mr-1" />
                    Partager
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full bg-startupia-turquoise hover:bg-startupia-turquoise/90" onClick={handleUpvote}>
                    <ThumbsUp size={16} className="mr-2" />
                    Soutenir ce produit
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} className="mr-2" />
                      Visiter le site
                    </a>
                  </Button>
                  
                  {product.demoUrl && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                        Essayer la démo
                      </a>
                    </Button>
                  )}
                  
                  {product.betaSignupUrl && (
                    <Button variant="outline" className="w-full bg-startupia-gold/10 hover:bg-startupia-gold/20 border-startupia-gold/30 text-startupia-gold" asChild>
                      <a href={product.betaSignupUrl} target="_blank" rel="noopener noreferrer">
                        S'inscrire à la bêta
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="md:w-3/5">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="overview">Aperçu</TabsTrigger>
                    <TabsTrigger value="comments">
                      Commentaires ({product.comments.length})
                    </TabsTrigger>
                    <TabsTrigger value="media">Médias</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-3">À propos</h2>
                        <p className="text-white/80 whitespace-pre-line">{product.description}</p>
                      </div>
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-3">Créé par</h2>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={product.creatorAvatarUrl} alt={product.createdBy} />
                            <AvatarFallback>{product.createdBy.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{product.createdBy}</p>
                            <p className="text-sm text-white/60">Maker</p>
                          </div>
                        </div>
                      </div>
                      
                      {product.startupId && (
                        <div>
                          <h2 className="text-xl font-semibold mb-3">Startup associée</h2>
                          <Button variant="outline" asChild>
                            <Link to={`/startup/${product.startupId}`}>
                              Voir la fiche startup
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="comments" className="mt-0">
                    <div className="mb-6">
                      <form onSubmit={handleSubmitComment}>
                        <Textarea
                          placeholder="Laissez un commentaire..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise mb-2"
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            disabled={!newComment.trim() || commentSubmitting}
                          >
                            {commentSubmitting ? (
                              <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Envoi en cours...
                              </>
                            ) : (
                              <>
                                <Send size={16} className="mr-2" />
                                Envoyer
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                    
                    <div className="space-y-6">
                      {product.comments.length > 0 ? (
                        product.comments.map((comment: ProductComment) => renderComment(comment))
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare size={32} className="mx-auto mb-2 text-white/40" />
                          <p className="text-white/60">Soyez le premier à commenter</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="media" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.mediaUrls && product.mediaUrls.length > 0 ? (
                        product.mediaUrls.map((url: string, index: number) => (
                          <div key={index} className="rounded-md overflow-hidden">
                            <img 
                              src={url} 
                              alt={`${product.name} media ${index + 1}`} 
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 col-span-2">
                          <p className="text-white/60">Aucun média disponible</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { mockProductLaunches } from '@/data/mockProductLaunches';
import { ProductLaunch } from '@/types/productLaunch';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Share2, ExternalLink, ArrowLeft, ThumbsUp, MessageSquare, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import StartupiaLaunchBadge from '@/components/productLaunch/StartupiaLaunchBadge';
import SEO from '@/components/SEO';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<ProductLaunch | null>(null);
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    // Fetch product details based on the ID
    const foundProduct = mockProductLaunches.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // Redirect to a "not found" page or handle the error as needed
      console.error(`Product with ID ${id} not found`);
    }
  }, [id]);

  const handleLike = () => {
    if (!user) {
      toast("Connexion requise", { 
        description: "Vous devez être connecté pour liker un produit",
        action: {
          label: "Se connecter",
          onClick: () => navigate('/auth')
        }
      });
      return;
    }
    setLiked(!liked);
    // In a real app, this would trigger a backend call to update the like count
    toast.success(`Produit ${liked ? 'disliké' : 'liké'} !`);
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.error('Error sharing', error));
    } else {
      toast.warning("Le partage n'est pas supporté sur votre navigateur");
    }
  };
  
  const formatLaunchDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };
  
  if (!product) {
    return (
      <div className="min-h-screen bg-hero-pattern flex items-center justify-center text-white">
        <p>Produit non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-pattern text-white pb-8">
      <SEO 
        title={`${product.name} – Outil IA | StartupIA.fr`}
        description={product.description}
      />
      
      <Button variant="ghost" onClick={() => navigate(-1)} className="absolute top-4 left-4 md:top-8 md:left-8 text-white hover:bg-white/5">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="container mx-auto px-4 pt-16 relative z-10">
        <Card className="bg-black/70 backdrop-blur-md border-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
            <CardDescription className="text-white/80">{product.shortDescription}</CardDescription>
          </CardHeader>
          
          <CardContent className="py-4">
            <div className="relative w-full rounded-md overflow-hidden mb-6">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-64 md:h-96"
              />
              {product.status === 'launching_today' && (
                <div className="absolute top-2 left-2">
                  <StartupiaLaunchBadge />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              {product.category.map((cat, index) => (
                <Badge key={index} variant="secondary">{cat}</Badge>
              ))}
            </div>

            <Separator className="bg-white/20 mb-4" />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Description</h3>
              <p className="text-white/80">{product.description}</p>
            </div>
            
            <Separator className="bg-white/20 my-4" />
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Informations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 mb-1">Date de lancement</p>
                  <p className="text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatLaunchDate(product.launchDate)}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 mb-1">Site web</p>
                  <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-startupia-turquoise hover:underline flex items-center gap-2">
                    Visiter le site <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center pt-4">
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handleLike}>
                <ThumbsUp className="h-4 w-4" />
                {product.upvotes} J'aime
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
            </div>
            <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Button>
                Visiter <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </a>
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;

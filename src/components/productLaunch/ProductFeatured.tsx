
import React from 'react';
import { ProductLaunch } from '@/types/productLaunch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Calendar, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import StartupiaLaunchBadge from './StartupiaLaunchBadge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductFeaturedProps {
  product: ProductLaunch;
  requireAuth?: boolean;
}

const ProductFeatured: React.FC<ProductFeaturedProps> = ({ product, requireAuth = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'À venir';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour upvoter");
      navigate('/auth');
      return;
    }
    
    toast.success(`Vous avez upvoté ${product.name}`);
  };

  return (
    <Card className="relative overflow-hidden border-0 bg-transparent">
      <div className="absolute inset-0 bg-gradient-to-br from-startupia-turquoise/30 to-startupia-purple/30 rounded-xl blur-xl -z-10"></div>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {/* Left column - Image */}
        <div className="relative rounded-lg overflow-hidden h-[200px]">
          <img 
            src={product.logoUrl || '/placeholder.svg'}
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            {product.featuredOrder !== null && (
              <StartupiaLaunchBadge isFeatured={true} />
            )}
          </div>
        </div>
        
        {/* Right column - Content */}
        <div className="flex flex-col justify-between md:col-span-2">
          <div>
            {/* Title and badges */}
            <div className="mb-3">
              <h2 className="text-xl md:text-2xl font-bold mb-1">{product.name}</h2>
              <p className="text-white/70 text-sm">Par {product.createdBy}</p>
            </div>
            
            {/* Description */}
            <p className="text-white/80 text-sm mb-4 line-clamp-3">
              {product.description}
            </p>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.isArray(product.category) && product.category.map((cat, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
            
            {/* Launch date */}
            <div className="flex items-center text-white/70 mb-4 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Lancement : {formatDate(product.launchDate)}</span>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center"
              onClick={handleUpvote}
            >
              <ThumbsUp className="mr-2 h-3 w-3" /> {product.upvotes || 0} Upvotes
            </Button>
            
            <Button asChild size="sm" className="bg-startupia-turquoise hover:bg-startupia-turquoise/80">
              <Link to={`/product/${product.id}`} className="flex items-center justify-center">
                Voir le détail
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFeatured;

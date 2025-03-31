
import React from 'react';
import { ProductLaunch } from '@/types/productLaunch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Calendar, ArrowRight } from 'lucide-react';
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
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left column - Image */}
        <div className="relative rounded-lg overflow-hidden h-[300px] md:h-auto">
          <img 
            src={product.logo_url || '/placeholder.svg'}
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            {product.featured_order !== null && (
              <StartupiaLaunchBadge isFeatured={true} />
            )}
          </div>
        </div>
        
        {/* Right column - Content */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Title and badges */}
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h2>
              <p className="text-white/70">Par {product.created_by}</p>
            </div>
            
            {/* Description */}
            <p className="text-white/80 mb-6">
              {product.description}
            </p>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Array.isArray(product.category) && product.category.map((cat, index) => (
                <Badge key={index} variant="outline">
                  {cat}
                </Badge>
              ))}
            </div>
            
            {/* Launch date */}
            <div className="flex items-center text-white/70 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Lancement : {formatDate(product.launch_date)}</span>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center"
              onClick={handleUpvote}
            >
              👍 {product.upvotes || 0} Upvotes
            </Button>
            
            <Button asChild className="flex-1 bg-startupia-turquoise hover:bg-startupia-turquoise/80">
              <Link to={`/product/${product.id}`} className="flex items-center justify-center">
                Voir le détail
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFeatured;

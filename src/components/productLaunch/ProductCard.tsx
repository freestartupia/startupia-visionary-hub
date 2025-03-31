
import React from 'react';
import { ProductLaunch } from '@/types/productLaunch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowUpRight, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: ProductLaunch;
  requireAuth?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, requireAuth = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const truncateDescription = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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
    <Card className="glass-card overflow-hidden hover:border-startupia-turquoise/30 transition-colors h-[300px] flex flex-col">
      <div className="relative h-32 overflow-hidden">
        <img
          src={product.logoUrl || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full p-2 flex justify-between">
          <Badge variant="outline" className="glass-badge text-xs">
            {Array.isArray(product.category) ? product.category[0] : product.category}
          </Badge>
          {product.featuredOrder !== null && (
            <Badge className="bg-startupia-gold text-black text-xs">Featured</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-3 flex-grow">
        <h3 className="text-lg font-bold mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-white/60 mb-2">
          Par {product.createdBy}
        </p>
        <p className="text-white/80 text-xs mb-2 line-clamp-2">
          {truncateDescription(product.description)}
        </p>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 h-8 px-2 text-xs"
          onClick={handleUpvote}
        >
          <ThumbsUp className="h-3 w-3" /> {product.upvotes}
        </Button>
        
        <Button asChild size="sm" className="h-8 px-2 text-xs">
          <Link to={`/product/${product.id}`}>
            Voir
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

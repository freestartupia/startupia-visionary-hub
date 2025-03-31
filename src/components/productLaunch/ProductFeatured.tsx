
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ProductLaunch } from '@/types/productLaunch';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import StartupiaLaunchBadge from './StartupiaLaunchBadge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface ProductFeaturedProps {
  products: ProductLaunch[];
  isLoading?: boolean;
  requireAuth?: boolean;
}

const ProductFeatured: React.FC<ProductFeaturedProps> = ({ 
  products, 
  isLoading = false,
  requireAuth = false
}) => {
  const featuredProduct = products[0];
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleVote = () => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour voter");
      navigate('/auth');
      return;
    }
    
    toast.success("Vote enregistré !");
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-xl overflow-hidden">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-4 p-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!featuredProduct) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image section */}
        <div className="relative h-[300px] lg:h-auto overflow-hidden">
          <img 
            src={featuredProduct.imageUrl} 
            alt={featuredProduct.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <StartupiaLaunchBadge featured />
          </div>
        </div>
        
        {/* Content section */}
        <div className="p-6 flex flex-col">
          <div className="mb-2">
            <span className="text-xs font-medium bg-white/10 text-white/80 py-1 px-2 rounded">
              {featuredProduct.category}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-1">{featuredProduct.name}</h2>
          
          <p className="text-white/70 text-sm mb-2">
            Lancé par <span className="font-medium text-white">{featuredProduct.creatorName}</span>
          </p>
          
          <p className="text-white/80 my-4 line-clamp-3">{featuredProduct.description}</p>
          
          <div className="mt-auto flex flex-wrap gap-3">
            <Button 
              onClick={handleVote}
              variant="outline" 
              size="sm"
              className="flex gap-1 items-center"
            >
              👍 {featuredProduct.upvotes}
            </Button>
            
            <Button asChild size="sm">
              <Link to={`/product/${featuredProduct.id}`}>
                Découvrir
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatured;

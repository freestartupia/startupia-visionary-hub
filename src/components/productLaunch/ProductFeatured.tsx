import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, ExternalLink } from 'lucide-react';
import { ProductLaunch } from '@/types/productLaunch';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductFeaturedProps {
  products: ProductLaunch[];
  isLoading?: boolean;
}

const ProductFeatured = ({ products, isLoading = false }: ProductFeaturedProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((item) => (
          <Card key={item} className="glass-card overflow-hidden border border-startupia-gold/30 bg-gradient-to-br from-black/40 to-startupia-gold/10">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-40 w-full mt-4 rounded-md" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="glass-card hover-scale overflow-hidden border border-startupia-gold/30 bg-gradient-to-br from-black/40 to-startupia-gold/10">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-startupia-turquoise/5 flex-shrink-0">
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
                  <Badge className="mb-2 bg-startupia-gold text-black">En vedette</Badge>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-xl hover:text-startupia-gold transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-white/80">{product.tagline}</p>
                </div>
              </div>
              
              <p className="mt-4 text-white/70 line-clamp-2">{product.description}</p>
              
              {/* First screenshot */}
              {product.mediaUrls && product.mediaUrls.length > 0 && (
                <div className="mt-4 rounded-md overflow-hidden">
                  <img 
                    src={product.mediaUrls[0]} 
                    alt={`${product.name} screenshot`} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              
              <div className="mt-4 flex flex-wrap gap-1">
                {product.category.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-startupia-gold/30 text-white/80">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="border-t border-white/10 p-3 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={16} className="text-startupia-gold" />
                  <span className="font-semibold">{product.upvotes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  <span>{product.comments.length} commentaires</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={14} className="mr-1" />
                    Visiter
                  </a>
                </Button>
                <Button size="sm" className="bg-startupia-gold hover:bg-startupia-light-gold text-black">
                  <ThumbsUp size={14} className="mr-1" />
                  Soutenir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductFeatured;


import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare, Calendar, ExternalLink } from 'lucide-react';
import { ProductLaunch } from '@/types/productLaunch';
import { format, isToday, isYesterday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProductCardProps {
  product: ProductLaunch;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatLaunchDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return "Hier";
    } else if (isTomorrow(date)) {
      return "Demain";
    } else {
      return format(date, 'd MMMM', { locale: fr });
    }
  };
  
  return (
    <Card className="glass-card hover-scale overflow-hidden border border-startupia-turquoise/20 bg-black/30">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Logo */}
          <div className="sm:w-16 sm:h-16 w-12 h-12 rounded-lg overflow-hidden bg-startupia-turquoise/5 flex-shrink-0">
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
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-lg hover:text-startupia-turquoise transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-white/80 text-sm">{product.tagline}</p>
              </div>
              
              <div className="flex items-center">
                {product.status === 'launching_today' && (
                  <Badge className="bg-startupia-gold text-black">Aujourd'hui</Badge>
                )}
                {product.status === 'upcoming' && (
                  <Badge variant="outline" className="border-startupia-gold text-startupia-gold">
                    À venir
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1">
              {product.category.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs border-startupia-turquoise/30 text-white/80">
                  {tag}
                </Badge>
              ))}
              {product.category.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.category.length - 3}
                </Badge>
              )}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center text-sm text-white/60 gap-4">
                <div className="flex items-center gap-1">
                  <ThumbsUp size={14} />
                  <span>{product.upvotes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{product.comments.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatLaunchDate(product.launchDate)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={12} className="mr-1" />
                    Visiter
                  </a>
                </Button>
                <Button size="sm" className="text-xs bg-startupia-turquoise hover:bg-startupia-turquoise/90">
                  <ThumbsUp size={12} className="mr-1" />
                  Soutenir
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Creator info */}
        <div className="border-t border-white/5 p-3 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-startupia-turquoise/10">
              {product.creatorAvatarUrl ? (
                <img
                  src={product.creatorAvatarUrl}
                  alt={product.createdBy}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-startupia-turquoise/20 text-white text-xs">
                  {product.createdBy.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-xs text-white/70">
              {product.createdBy}
            </span>
          </div>
          
          {product.startupId && (
            <Badge variant="secondary" className="text-xs bg-startupia-purple/20 hover:bg-startupia-purple/30">
              <Link to={`/startup/${product.startupId}`}>Voir la startup</Link>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

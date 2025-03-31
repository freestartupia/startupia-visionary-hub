
import React from 'react';
import { ProductLaunch } from '@/types/productLaunch';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export interface ProductListProps {
  products: ProductLaunch[];
  isLoading?: boolean;
  requireAuth?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  isLoading = false,
  requireAuth = false
}) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="glass-card p-3 rounded-lg h-[300px]">
            <Skeleton className="h-32 w-full rounded-md mb-3" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <Skeleton className="h-12 w-full mb-3" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-medium mb-2">Aucun produit trouvé</h3>
        <p className="text-white/70">Essayez d'ajuster vos filtres de recherche.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} requireAuth={requireAuth} />
      ))}
    </div>
  );
};

export default ProductList;

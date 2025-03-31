
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="glass-card p-4 rounded-lg">
            <Skeleton className="h-40 w-full rounded-md mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Aucun produit trouvé</h3>
        <p className="text-white/70">Essayez d'ajuster vos filtres de recherche.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} requireAuth={requireAuth} />
      ))}
    </div>
  );
};

export default ProductList;


import React from 'react';
import ProductCard from './ProductCard';
import { ProductLaunch } from '@/types/productLaunch';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductListProps {
  products: ProductLaunch[];
  isLoading?: boolean;
}

const ProductList = ({ products, isLoading = false }: ProductListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="glass-card p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-24 w-full mt-4" />
          </div>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-12 glass-card">
        <p className="text-white/70">Aucun produit à afficher pour cette catégorie</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;

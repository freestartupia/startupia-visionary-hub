
import React from 'react';
import ProductCard from './ProductCard';
import { ProductLaunch } from '@/types/productLaunch';

interface ProductListProps {
  products: ProductLaunch[];
}

const ProductList = ({ products }: ProductListProps) => {
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

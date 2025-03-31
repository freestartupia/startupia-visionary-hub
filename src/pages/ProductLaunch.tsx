
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '@/services/productService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductHero from '@/components/productLaunch/ProductHero';
import ProductCategoryFilter from '@/components/productLaunch/ProductCategoryFilter';
import ProductFeatured from '@/components/productLaunch/ProductFeatured';
import ProductList from '@/components/productLaunch/ProductList';
import { toast } from 'sonner';

const ProductLaunchPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch all products from the API
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    meta: {
      onError: (err: Error) => {
        console.error("Failed to load products:", err);
        toast.error("Impossible de charger les produits. Veuillez réessayer plus tard.");
      }
    }
  });

  // Filter products based on selected category
  const filteredProducts = selectedCategory 
    ? products?.filter(product => product.category.includes(selectedCategory))
    : products;

  // Featured products are the ones specifically marked as featured
  const featuredProducts = products?.filter(product => product.featured_order !== null)
    .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-hero-pattern">
      <Navbar />
      
      {/* Hero Section */}
      <ProductHero />
      
      {/* Category Filter */}
      <ProductCategoryFilter 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory}
      />

      {/* Featured Products Section */}
      {!selectedCategory && featuredProducts && featuredProducts.length > 0 && (
        <ProductFeatured products={featuredProducts} isLoading={isLoading} />
      )}
      
      {/* Product List */}
      <ProductList products={filteredProducts || []} isLoading={isLoading} />
      
      <Footer />
    </div>
  );
};

export default ProductLaunchPage;

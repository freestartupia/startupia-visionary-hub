
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import ProductHero from '@/components/productLaunch/ProductHero';
import ProductList from '@/components/productLaunch/ProductList';
import ProductFeatured from '@/components/productLaunch/ProductFeatured';
import ProductCategoryFilter from '@/components/productLaunch/ProductCategoryFilter';
import { ProductLaunch } from '@/types/productLaunch';
import { mockProductLaunches } from '@/data/mockProductLaunches';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ProductLaunchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // In a real implementation, fetch from API/Supabase
      return mockProductLaunches;
    }
  });

  const handleAddProduct = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter un produit");
      navigate('/auth');
      return;
    }
    navigate('/product/new');
  };

  const filteredProducts = products.filter(product => {
    // Filter by search term
    const matchesSearch = 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = 
      selectedCategory === 'Tous' || 
      (Array.isArray(product.category) && 
       product.category.includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });

  // Featured products at the top
  const featuredProducts = filteredProducts.filter(product => product.featuredOrder !== null)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));
  
  // Regular products
  const regularProducts = filteredProducts.filter(product => product.featuredOrder === null);

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <Navbar />
      
      <ProductHero 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onAddProduct={handleAddProduct} 
      />
      
      <main className="container mx-auto px-4 pb-16 relative z-10">
        <ProductCategoryFilter 
          selectedCategory={selectedCategory} 
          onCategorySelect={setSelectedCategory} 
        />
        
        {featuredProducts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">À la Une</h2>
            <div className="space-y-6">
              {featuredProducts.map(product => (
                <ProductFeatured key={product.id} product={product} requireAuth={true} />
              ))}
            </div>
          </section>
        )}
        
        <section>
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategory === 'Tous' 
              ? 'Tous les produits' 
              : `Produits ${selectedCategory}`}
          </h2>
          
          <ProductList 
            products={regularProducts} 
            isLoading={isLoading} 
            requireAuth={true}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductLaunchPage;

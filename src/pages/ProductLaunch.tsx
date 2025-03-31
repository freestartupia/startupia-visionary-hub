
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import ProductHero from '@/components/productLaunch/ProductHero';
import ProductFeatured from '@/components/productLaunch/ProductFeatured';
import ProductCategoryFilter from '@/components/productLaunch/ProductCategoryFilter';
import ProductList from '@/components/productLaunch/ProductList';
import { ProductLaunch } from '@/types/productLaunch';
import { mockProductLaunches } from '@/data/mockProductLaunches';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ProductLaunchPage = () => {
  const [products, setProducts] = useState<ProductLaunch[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductLaunch[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProductLaunches);
      setFilteredProducts(mockProductLaunches);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter products when category or search changes
  useEffect(() => {
    let results = products;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProducts(results);
  }, [selectedCategory, searchTerm, products]);

  // Get featured products
  const featuredProducts = filteredProducts.filter(product => product.featured);
  // Get non-featured products
  const regularProducts = filteredProducts.filter(product => !product.featured);

  // Function to navigate to the product form
  const handleAddProduct = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter un produit");
      navigate('/auth');
      return;
    }
    navigate('/product/new');
  };
  
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
      
      <main className="container mx-auto pb-20 px-4 relative z-10">
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured</h2>
          {featuredProducts.length > 0 && <ProductFeatured products={featuredProducts} isLoading={isLoading} requireAuth={true} />}
        </div>
        
        <div>
          <div className="mb-6">
            <ProductCategoryFilter 
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>
          
          <ProductList products={regularProducts} isLoading={isLoading} requireAuth={true} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductLaunchPage;

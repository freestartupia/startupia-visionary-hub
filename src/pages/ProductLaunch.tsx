
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProductLaunches } from '@/services/productService';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import ProductHero from '@/components/productLaunch/ProductHero';
import ProductCategoryFilter from '@/components/productLaunch/ProductCategoryFilter';
import ProductFeatured from '@/components/productLaunch/ProductFeatured';
import ProductList from '@/components/productLaunch/ProductList';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductLaunchPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch all products from the API
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductLaunches,
    meta: {
      onError: (err: Error) => {
        console.error("Failed to load products:", err);
        toast.error("Impossible de charger les produits. Veuillez réessayer plus tard.");
      }
    }
  });

  // Filter products based on selected category and search term
  const filteredProducts = products?.filter(product => {
    const matchesCategory = selectedCategory && selectedCategory !== 'all' 
      ? product.category.includes(selectedCategory)
      : true;
    
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesCategory && matchesSearch;
  });

  // Featured products are the ones specifically marked as featured
  const featuredProducts = products?.filter(product => product.featuredOrder !== null)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
    .slice(0, 3);

  const handleAddProduct = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter un produit");
      navigate('/auth');
      return;
    }
    
    navigate('/product/new');
  };

  return (
    <div className="min-h-screen bg-hero-pattern">
      <Navbar />
      
      {/* Hero Section */}
      <ProductHero 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddProduct={handleAddProduct}
      />
      
      {/* Category Filter */}
      <ProductCategoryFilter 
        activeCategory={selectedCategory || 'all'} 
        setActiveCategory={setSelectedCategory}
      />

      {/* Featured Products Section */}
      {!selectedCategory && featuredProducts && featuredProducts.length > 0 && (
        <ProductFeatured products={featuredProducts} isLoading={isLoading} requireAuth={true} />
      )}
      
      {/* Product List */}
      <ProductList products={filteredProducts || []} isLoading={isLoading} requireAuth={true} />
      
      <Footer />
    </div>
  );
};

export default ProductLaunchPage;


import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductHero from '@/components/productLaunch/ProductHero';
import ProductList from '@/components/productLaunch/ProductList';
import ProductFeatured from '@/components/productLaunch/ProductFeatured';
import ProductCategoryFilter from '@/components/productLaunch/ProductCategoryFilter';
import { mockProductLaunches } from '@/data/mockProductLaunches';
import { ProductLaunch } from '@/types/productLaunch';

const ProductLaunchPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Get today's launches
  const todayLaunches = mockProductLaunches.filter(
    product => product.status === 'launching_today'
  );
  
  // Get upcoming launches
  const upcomingLaunches = mockProductLaunches.filter(
    product => product.status === 'upcoming'
  );
  
  // Get past launches
  const pastLaunches = mockProductLaunches.filter(
    product => product.status === 'launched'
  );
  
  // Get featured products
  const featuredProducts = mockProductLaunches
    .filter(product => product.featuredOrder !== undefined)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0));

  // Filter products based on category and search term
  const filterProducts = (products: ProductLaunch[]) => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'all' || 
        product.category.includes(activeCategory);
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-gold/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <Navbar />
      
      <main className="relative container mx-auto pt-24 pb-16 px-4 z-10">
        <ProductHero 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />

        <div className="mb-12">
          <ProductCategoryFilter 
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>

        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Produits en vedette</h2>
            <ProductFeatured products={filterProducts(featuredProducts)} />
          </section>
        )}

        {todayLaunches.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Lancements du jour</h2>
            <ProductList products={filterProducts(todayLaunches)} />
          </section>
        )}
        
        {upcomingLaunches.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Lancements à venir</h2>
            <ProductList products={filterProducts(upcomingLaunches)} />
          </section>
        )}
        
        {pastLaunches.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Lancements précédents</h2>
            <ProductList products={filterProducts(pastLaunches)} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductLaunchPage;

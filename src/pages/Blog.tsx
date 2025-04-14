
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import CategoryFilter from '@/components/blog/CategoryFilter';
import SubmitArticleModal from '@/components/blog/SubmitArticleModal';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { BlogCategory, BlogPost } from '@/types/blog';
import SEO from '@/components/SEO';
import { fetchAllBlogPosts, fetchFeaturedBlogPosts, getAllBlogCategories } from '@/services/blogService';
import { Skeleton } from '@/components/ui/skeleton';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  
  // Fetch all blog posts
  const { 
    data: allPosts = [], 
    isLoading: isLoadingPosts,
    error: postsError
  } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchAllBlogPosts
  });
  
  // Fetch featured blog posts
  const { 
    data: featuredPosts = [], 
    isLoading: isLoadingFeatured 
  } = useQuery({
    queryKey: ['featuredBlogPosts'],
    queryFn: fetchFeaturedBlogPosts
  });
  
  // Fetch all categories
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories 
  } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: getAllBlogCategories
  });
  
  // Update filtered posts when data changes
  useEffect(() => {
    filterPosts(searchQuery, selectedCategory);
  }, [allPosts, searchQuery, selectedCategory]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategoryChange = (category: BlogCategory | null) => {
    setSelectedCategory(category);
  };
  
  const filterPosts = (query: string, category: BlogCategory | null) => {
    let filtered = [...allPosts];
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    if (category) {
      filtered = filtered.filter(post => post.category === category);
    }
    
    setFilteredPosts(filtered);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Blog IA & Actualités Startups – Tendance, Outils et Innovations IA"
        description="Explorez les dernières tendances IA, les outils d'intelligence artificielle à connaître, et l'actualité des startups IA en France. Analyses, interviews et découvertes chaque semaine."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Blog & <span className="text-startupia-turquoise">Actualités</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            L'actualité de l'IA française : tendances, outils, levées de fonds et interviews
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div className="w-full md:w-1/3">
            <BlogSearch onSearch={handleSearch} />
          </div>
          
          <Button 
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-startupia-turquoise text-black hover:bg-startupia-light-turquoise transition-all"
          >
            <PlusCircle className="mr-2" size={16} />
            Soumettre un article
          </Button>
        </div>
        
        {/* Featured posts carousel */}
        {(isLoadingFeatured) ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">À la une</h2>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-64 bg-gray-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ) : featuredPosts.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">À la une</h2>
            <div className="grid gap-6">
              {featuredPosts.map(post => (
                <BlogPostCard key={post.id} post={post} featured={true} />
              ))}
            </div>
          </div>
        ) : null}
        
        {isLoadingCategories ? (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-800/50 rounded-full animate-pulse" />
            ))}
          </div>
        ) : (
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />
        )}
        
        {isLoadingPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg bg-gray-800/50" />
            ))}
          </div>
        ) : postsError ? (
          <div className="text-center py-10">
            <p className="text-white/60">Une erreur est survenue lors du chargement des articles.</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-white/60">Aucun article trouvé avec ces critères.</p>
          </div>
        )}
      </main>

      <Footer />
      
      <SubmitArticleModal 
        open={isSubmitModalOpen} 
        onOpenChange={setIsSubmitModalOpen} 
      />
    </div>
  );
};

export default Blog;

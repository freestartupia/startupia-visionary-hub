
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import CategoryFilter from '@/components/blog/CategoryFilter';
import { supabase } from '@/integrations/supabase/client';
import { BlogCategory, BlogPost } from '@/types/blog';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

const Blog = () => {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  
  // Fetch blog posts from Supabase with better error handling
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching blog posts:", error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          return [];
        }
        
        // Convert from snake_case to camelCase for the BlogPost interface
        return data.map((post: any): BlogPost => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category as BlogCategory,
          coverImage: post.cover_image,
          authorId: post.author_id,
          authorName: post.author_name,
          authorAvatar: post.author_avatar,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          tags: post.tags || [],
          featured: post.featured,
          readingTime: post.reading_time,
        }));
      } catch (err) {
        console.error("Error in blog posts query:", err);
        throw err;
      }
    },
    meta: {
      onError: (error: any) => {
        console.error("Error loading blog posts:", error);
        toast.error("Erreur lors du chargement des articles");
      }
    }
  });
  
  // Extract unique categories from posts
  useEffect(() => {
    if (posts && posts.length > 0) {
      const uniqueCategories = [...new Set(posts.map(post => post.category))];
      setCategories(uniqueCategories as BlogCategory[]);
      setFilteredPosts(posts);
    } else {
      setFilteredPosts([]);
    }
  }, [posts]);
  
  // Handle search and filter
  useEffect(() => {
    if (!posts) return;
    
    let filtered = [...posts];
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);
  
  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle category selection
  const handleCategoryChange = (category: BlogCategory | null) => {
    setSelectedCategory(category);
  };
  
  // Get featured posts
  const featuredPosts = posts?.filter(post => post.featured) || [];

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
        </div>
        
        {/* Featured posts carousel */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">À la une</h2>
            <div className="grid gap-6">
              {featuredPosts.map(post => (
                <BlogPostCard key={post.id} post={post} featured={true} />
              ))}
            </div>
          </div>
        )}
        
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <BlogPostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-white/60">Aucun article trouvé avec ces critères.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

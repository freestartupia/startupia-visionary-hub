
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import CategoryFilter from '@/components/blog/CategoryFilter';
import { BlogCategory, BlogPost } from '@/types/blog';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { PenSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchBlogPosts } from '@/services/blogService';
import { getAllBlogCategories } from '@/data/mockBlogPosts';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const categories = getAllBlogCategories();
  
  useEffect(() => {
    const loadBlogPosts = async () => {
      setIsLoading(true);
      try {
        const posts = await fetchBlogPosts();
        setBlogPosts(posts);
        setFilteredPosts(posts);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBlogPosts();
  }, []);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPosts(query, selectedCategory);
  };
  
  const handleCategoryChange = (category: BlogCategory | null) => {
    setSelectedCategory(category);
    filterPosts(searchQuery, category);
  };
  
  const filterPosts = (query: string, category: BlogCategory | null) => {
    let filtered = [...blogPosts];
    
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

  // Obtenir les articles mis en avant
  const featuredPosts = filteredPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Blog IA & Actualités Startups – Tendance, Outils et Innovations IA"
        description="Explorez les dernières tendances IA, les outils d'intelligence artificielle à connaître, et l'actualité des startups IA en France. Analyses, interviews et découvertes chaque semaine."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
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
          
          {user && (
            <Link to="/blog/new">
              <Button variant="default" className="bg-startupia-turquoise hover:bg-startupia-turquoise/80">
                <PenSquare className="mr-2 h-4 w-4" />
                Écrire un article
              </Button>
            </Link>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-startupia-turquoise" />
          </div>
        ) : (
          <>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-white/60 mb-6">Aucun article n'est disponible pour le moment.</p>
                  {user && (
                    <Link to="/blog/new">
                      <Button variant="default" className="bg-startupia-turquoise hover:bg-startupia-turquoise/80">
                        <PenSquare className="mr-2 h-4 w-4" />
                        Écrire le premier article
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;

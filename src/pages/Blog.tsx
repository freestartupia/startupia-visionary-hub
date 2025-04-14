
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import CategoryFilter from '@/components/blog/CategoryFilter';
import SubmitArticleModal from '@/components/blog/SubmitArticleModal';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { 
  fetchBlogPosts, 
  fetchFeaturedPosts,
  getAllBlogCategories
} from '@/services/blogService';
import { BlogCategory, BlogPost } from '@/types/blog';
import SEO from '@/components/SEO';
import { useToast } from "@/components/ui/use-toast";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadBlogData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [posts, featured, allCategories] = await Promise.all([
          fetchBlogPosts(),
          fetchFeaturedPosts(),
          getAllBlogCategories()
        ]);
        
        setBlogPosts(posts);
        setFilteredPosts(posts);
        setFeaturedPosts(featured);
        setCategories(allCategories);
      } catch (error) {
        console.error("Error loading blog data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles. Veuillez réessayer plus tard.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBlogData();
  }, [toast]);
  
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
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
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
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center my-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
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
            
            {categories.length > 0 && (
              <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
              />
            )}
            
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
          </>
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


import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import CategoryFilter from '@/components/blog/CategoryFilter';
import SubmitArticleModal from '@/components/blog/SubmitArticleModal';
import { Button } from '@/components/ui/button';
import { PlusCircle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  fetchBlogPosts, 
  fetchFeaturedPosts,
  getAllBlogCategories,
  checkIsAdmin
} from '@/services/blogService';
import { BlogCategory, BlogPost } from '@/types/blog';
import SEO from '@/components/SEO';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const loadBlogData = async () => {
      setIsLoading(true);
      try {
        // First check if user is admin
        if (user?.email) {
          console.log("Current user email:", user.email);
          const admin = await checkIsAdmin();
          console.log("Is admin:", admin);
          setIsAdmin(admin);
          
          if (admin) {
            // For admins, show a prominent notification that they're in admin mode
            toast({
              title: "Mode administrateur activé",
              description: "Vous avez accès aux fonctionnalités d'administration du blog.",
            });
          }
        }
        
        // Fetch all data in parallel
        const posts = await fetchBlogPosts();
        const featured = await fetchFeaturedPosts();
        const allCategories = await getAllBlogCategories();
        
        console.log("Fetched posts:", posts.length);
        console.log("Fetched categories:", allCategories);
        
        // If admin, count pending posts
        if (isAdmin) {
          const pendingPosts = posts.filter(post => post.status === 'pending');
          setPendingCount(pendingPosts.length);
        }
        
        // Filter out pending posts for regular display
        const approvedPosts = posts.filter(post => post.status === 'approved' || (isAdmin && post.status === 'pending'));
        
        setBlogPosts(approvedPosts);
        setFilteredPosts(approvedPosts);
        setFeaturedPosts(featured.filter(post => post.status === 'approved'));
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
  }, [toast, user, isAdmin]);
  
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
          
          {/* Admin Banner - VERY PROMINENT */}
          {isAdmin && (
            <div className="mt-6 flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-purple-600 text-white hover:bg-purple-700 transition-all animate-pulse px-8 py-6 text-lg"
              >
                <Link to="/blog/admin">
                  <ShieldAlert className="mr-2" size={22} />
                  Accéder à l'administration
                </Link>
              </Button>
            </div>
          )}
          
          {/* Admin Debug Info */}
          {user && (
            <div className="mt-4 text-xs text-white/50">
              Connecté en tant que: {user.email} 
              {isAdmin ? " (Administrateur)" : " (Utilisateur standard)"}
            </div>
          )}
        </div>
        
        {isAdmin && pendingCount > 0 && (
          <div className="mb-6">
            <Alert className="bg-black/20 border-startupia-turquoise text-white">
              <AlertTitle className="flex items-center text-xl">
                <ShieldAlert className="inline-block mr-2 h-5 w-5 text-startupia-turquoise" />
                Mode Administrateur
              </AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {pendingCount} article{pendingCount > 1 ? 's' : ''} en attente de modération
                </span>
                <Button asChild variant="outline" className="border-startupia-turquoise text-white hover:bg-startupia-turquoise/20">
                  <Link to="/blog/admin">Voir les articles à modérer</Link>
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div className="w-full md:w-1/3">
            <BlogSearch onSearch={handleSearch} />
          </div>
          
          <div className="flex gap-2">
            {isAdmin && (
              <Button
                asChild
                className="bg-purple-600 text-white hover:bg-purple-700 transition-all"
              >
                <Link to="/blog/admin">
                  <ShieldAlert className="mr-2" size={16} />
                  Administration
                </Link>
              </Button>
            )}
            
            <Button 
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-startupia-turquoise text-black hover:bg-startupia-light-turquoise transition-all"
            >
              <PlusCircle className="mr-2" size={16} />
              Soumettre un article
            </Button>
          </div>
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
                  <BlogPostCard key={post.id} post={post} isPending={post.status === 'pending'} />
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

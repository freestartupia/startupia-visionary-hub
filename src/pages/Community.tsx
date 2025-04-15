
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ForumSection from '@/components/community/ForumSection';
import ServicesMarketplace from '@/components/community/ServicesMarketplace';
import ResourcesLibrary from '@/components/community/ResourcesLibrary';
import CollaborativeProjects from '@/components/community/CollaborativeProjects';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarInset
} from '@/components/ui/sidebar';
import LoadingSkeleton from '@/components/community/LoadingSkeleton';

// Chargement différé du détail des posts et de la sidebar
const ForumPostDetail = lazy(() => import('@/components/community/ForumPostDetail'));
const ForumSidebar = lazy(() => import('@/components/community/forum/ForumSidebar'));

const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams<{ postId?: string }>();
  const [activeTab, setActiveTab] = useState('forum');
  
  // Vérifier si nous sommes sur une page de post individuel
  const isPostDetail = location.pathname.includes('/post/');
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Extraire l'onglet de l'URL s'il est présent
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['forum', 'services', 'resources', 'projects'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Mettre à jour l'URL sans rechargement de page
    navigate({
      pathname: '/community',
      search: `?tab=${value}`
    }, { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Communauté IA Française – Rejoignez les Bâtisseurs de l'IA"
        description="Rejoignez la communauté StartupIA.fr : discutez, collaborez et échangez avec des passionnés d'intelligence artificielle, fondateurs de startups IA et créateurs d'outils IA."
      />
      
      {/* Éléments d'arrière-plan */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="relative pt-20 pb-16 z-10 w-full">
        {!isPostDetail && (
          <div className="text-center mb-6 px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Communauté <span className="text-startupia-turquoise">Startupia</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Le QG des créateurs, développeurs, et entrepreneurs de l'IA en France
            </p>
          </div>
        )}

        {isPostDetail ? (
          <div className="flex w-full h-full">
            <SidebarProvider defaultOpen={true}>
              <div className="flex w-full min-h-[calc(100vh-80px)]">
                <Suspense fallback={<div className="w-[280px] bg-black/50 border-r border-white/10"></div>}>
                  <ForumSidebar />
                </Suspense>
                <div className="flex-1 w-full px-4 md:px-8 py-4">
                  <Suspense fallback={<LoadingSkeleton count={1} type="post" />}>
                    <ForumPostDetail />
                  </Suspense>
                </div>
              </div>
            </SidebarProvider>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full md:w-auto grid grid-cols-4 mb-8">
                <TabsTrigger value="forum">Forum IA</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="resources">Formations</TabsTrigger>
                <TabsTrigger value="projects">Projets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="forum" className="mt-0">
                <ForumSection requireAuth={true} />
              </TabsContent>
              
              <TabsContent value="services" className="mt-0">
                <ServicesMarketplace requireAuth={true} />
              </TabsContent>
              
              <TabsContent value="resources" className="mt-0">
                <ResourcesLibrary requireAuth={true} />
              </TabsContent>
              
              <TabsContent value="projects" className="mt-0">
                <CollaborativeProjects requireAuth={true} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Community;

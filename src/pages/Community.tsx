
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ForumSection from '@/components/community/ForumSection';
import ServicesMarketplace from '@/components/community/ServicesMarketplace';
import ResourcesLibrary from '@/components/community/ResourcesLibrary';
import CollaborativeProjects from '@/components/community/CollaborativeProjects';
import ForumPostDetail from '@/components/community/ForumPostDetail';
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
import ForumSidebar from '@/components/community/forum/ForumSidebar';

const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams<{ postId?: string }>();
  const [activeTab, setActiveTab] = useState('forum');
  
  // Vérifier si nous sommes sur une page de post individuel
  const isPostDetail = location.pathname.includes('/post/');
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Extraire l'onglet de l'URL si présent
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['forum', 'services', 'resources', 'projects'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Mettre à jour l'URL sans recharger la page
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
      
      {/* Background elements - simplified */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="relative mx-auto pt-20 pb-16 z-10 w-full">
        <div className="text-center mb-6 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Communauté <span className="text-startupia-turquoise">Startupia</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Le QG des créateurs, développeurs, et entrepreneurs de l'IA en France
          </p>
        </div>

        {isPostDetail ? (
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full">
              <ForumSidebar />
              <SidebarInset className="px-4 md:px-8 py-4">
                <ForumPostDetail />
              </SidebarInset>
            </div>
          </SidebarProvider>
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

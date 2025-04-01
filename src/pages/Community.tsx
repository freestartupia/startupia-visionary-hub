
import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ForumSection from '@/components/community/ForumSection';
import ServicesMarketplace from '@/components/community/ServicesMarketplace';
import ResourcesLibrary from '@/components/community/ResourcesLibrary';
import CollaborativeProjects from '@/components/community/CollaborativeProjects';
import CommunityFeed from '@/components/community/CommunityFeed';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const [activeTab, setActiveTab] = useState('forum');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background elements - simplified */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="container relative mx-auto pt-24 pb-16 px-4 z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Communauté <span className="text-startupia-turquoise">Startupia</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Le QG des créateurs, développeurs, et entrepreneurs de l'IA en France
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="forum">Forum IA</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="resources">Formations</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="feed">Fil d'actu</TabsTrigger>
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
          
          <TabsContent value="feed" className="mt-0">
            <CommunityFeed requireAuth={true} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Community;

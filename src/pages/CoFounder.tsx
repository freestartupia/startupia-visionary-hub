
import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoFounderSearch from '@/components/CoFounderSearch';
import CoFounderProfile from '@/components/CoFounderProfile';
import ProjectsList from '@/components/ProjectsList';
import Footer from '@/components/Footer';
import { CofounderProfile } from '@/types/cofounders';

// Mock data for development purposes
import { mockCofounderProfiles } from '@/data/mockCofounderProfiles';

const CoFounder = () => {
  const [profiles] = useState<CofounderProfile[]>(mockCofounderProfiles);
  const [activeTab, setActiveTab] = useState<string>('search');

  // Filter for project owners
  const projects = profiles.filter(profile => profile.profileType === 'project-owner');

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <Navbar />
      
      <main className="container mx-auto pt-28 pb-16 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Startup <span className="gradient-text">Co-Founder</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Trouvez le co-fondateur idéal pour votre startup IA ou rejoignez un projet prometteur
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="search">Rechercher</TabsTrigger>
            <TabsTrigger value="profile">Créer un profil</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-0">
            <CoFounderSearch profiles={profiles} />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-0">
            <CoFounderProfile />
          </TabsContent>
          
          <TabsContent value="projects" className="mt-0">
            <ProjectsList projects={projects} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default CoFounder;

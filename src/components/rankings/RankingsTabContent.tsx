
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import TopStartupsSection from './TopStartupsSection';
import TopContributorsSection from './TopContributorsSection';
import TopToolsSection from './TopToolsSection';
import NewStartupsSection from './NewStartupsSection';

// Define or extend the Tool interface to include 'points'
interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  imageUrl?: string;
  votes?: number;
  points: number; // Add this to fix type error
}

// Define or extend the Contributor interface to include 'points'
interface Contributor {
  id: string;
  name: string;
  avatar?: string;
  contributions: number;
  role?: string;
  skills?: string[];
  points: number; // Add this to fix type error
}

// Extended Startup interface for rankings
interface RankedStartup {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  category: string;
  tags?: string[];
  points: number;
  trend?: 'up' | 'down' | 'stable';
  ranking?: number;
}

const RankingsTabContent = () => {
  const [activeTab, setActiveTab] = useState('startups');
  const [loading, setLoading] = useState(true);
  const [topStartups, setTopStartups] = useState<RankedStartup[]>([]);
  const [topTools, setTopTools] = useState<Tool[]>([]);
  const [topContributors, setTopContributors] = useState<Contributor[]>([]);
  const [newStartups, setNewStartups] = useState<RankedStartup[]>([]);

  useEffect(() => {
    // Simulating data fetch
    const fetchData = async () => {
      setLoading(true);
      
      // In a real implementation, fetch actual data from an API
      setTimeout(() => {
        setTopStartups([
          // ... mock data for top startups
        ]);
        
        setTopTools([
          // ... mock data for top tools
          // Ensure these match the Tool interface with points property
        ] as Tool[]);
        
        setTopContributors([
          // ... mock data for top contributors
          // Ensure these match the Contributor interface with points property
        ] as Contributor[]);
        
        setNewStartups([
          // ... mock data for new startups
        ]);
        
        setLoading(false);
      }, 1500);
    };
    
    fetchData();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Card className="border-none bg-black shadow-md">
      <CardContent className="pt-6">
        <Tabs defaultValue="startups" onValueChange={handleTabChange}>
          <TabsList className="mb-6 bg-black/30 border border-white/10">
            <TabsTrigger 
              value="startups"
              className={`${activeTab === 'startups' ? 'bg-startupia-turquoise text-black' : 'text-white/70'}`}
            >
              Top Startups
            </TabsTrigger>
            <TabsTrigger 
              value="tools"
              className={`${activeTab === 'tools' ? 'bg-startupia-turquoise text-black' : 'text-white/70'}`}
            >
              Top Outils IA
            </TabsTrigger>
            <TabsTrigger 
              value="contributors"
              className={`${activeTab === 'contributors' ? 'bg-startupia-turquoise text-black' : 'text-white/70'}`}
            >
              Top Contributeurs
            </TabsTrigger>
            <TabsTrigger 
              value="new"
              className={`${activeTab === 'new' ? 'bg-startupia-turquoise text-black' : 'text-white/70'}`}
            >
              Derniers Ajouts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="startups">
            <TopStartupsSection startups={topStartups} />
          </TabsContent>
          
          <TabsContent value="tools">
            <TopToolsSection tools={topTools} />
          </TabsContent>
          
          <TabsContent value="contributors">
            <TopContributorsSection contributors={topContributors} />
          </TabsContent>
          
          <TabsContent value="new">
            <NewStartupsSection startups={newStartups} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RankingsTabContent;

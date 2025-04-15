import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Startup, AITool, Sector, BusinessModel, MaturityLevel } from '@/types/startup';
import StartupCard from '@/components/StartupCard';
import { mockStartups } from '@/data/mockStartups';

const TopStartups = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopStartups = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .order('upvotes', { ascending: false })
        .limit(4);
      
      if (error) {
        console.error('Error fetching top startups:', error);
        // Fallback to mock data
        const topMockStartups = [...mockStartups]
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
          .slice(0, 4);
        setStartups(topMockStartups);
      } else if (data && data.length > 0) {
        const processedStartups: Startup[] = data.map(item => {
          // Process founders to ensure it's the correct type
          let parsedFounders = [];
          try {
            if (item.founders) {
              if (typeof item.founders === 'string') {
                parsedFounders = JSON.parse(item.founders);
              } else if (Array.isArray(item.founders)) {
                parsedFounders = item.founders;
              } else if (typeof item.founders === 'object') {
                parsedFounders = [item.founders];
              }
            }
          } catch (e) {
            console.error('Error parsing founders:', e);
            parsedFounders = [];
          }
          
          // Handle aiTools properly
          let aiTools: AITool[] = [];
          try {
            if (item.ai_tools) {
              if (typeof item.ai_tools === 'string') {
                aiTools = JSON.parse(item.ai_tools) as AITool[];
              } else if (Array.isArray(item.ai_tools)) {
                // Make sure each item is a valid AITool
                aiTools = item.ai_tools.filter(tool => 
                  typeof tool === 'string' && 
                  ["ChatGPT", "Claude", "LLama", "Stable Diffusion", "Midjourney", 
                   "API interne", "Hugging Face", "Vertex AI", "AWS Bedrock", "Autre"].includes(tool)
                ) as AITool[];
              }
            }
          } catch (e) {
            console.error('Error parsing aiTools:', e);
            aiTools = [];
          }
          
          return {
            id: item.id,
            name: item.name,
            logoUrl: item.logo_url || '',
            shortDescription: item.short_description,
            longTermVision: item.long_term_vision || '',
            founders: parsedFounders,
            aiUseCases: item.ai_use_cases || '',
            aiTools: aiTools,
            sector: item.sector as Sector,
            businessModel: item.business_model as BusinessModel,
            maturityLevel: item.maturity_level as MaturityLevel,
            aiImpactScore: item.ai_impact_score,
            tags: item.tags || [],
            websiteUrl: item.website_url || '',
            pitchDeckUrl: item.pitch_deck_url,
            crunchbaseUrl: item.crunchbase_url,
            upvotes: item.upvotes || 0
          };
        });
        
        setStartups(processedStartups);
      } else {
        // Fallback to mock data if no results
        const topMockStartups = [...mockStartups]
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
          .slice(0, 4);
        setStartups(topMockStartups);
      }
    } catch (error) {
      console.error('Exception fetching top startups:', error);
      // Fallback to mock data
      const topMockStartups = [...mockStartups]
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        .slice(0, 4);
      setStartups(topMockStartups);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTopStartups();
  }, []);
  
  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto py-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="w-64 h-48 glass-card animate-pulse shrink-0"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      {startups.map(startup => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
    </div>
  );
};

export default TopStartups;

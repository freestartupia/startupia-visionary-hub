
import { useState, useEffect } from "react";
import { Startup, Sector } from "@/types/startup";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const useStartups = (searchQuery: string, activeCategory: string) => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startupVotes, setStartupVotes] = useState<Record<string, { upvoted: boolean, downvoted: boolean, count: number }>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchStartups = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('startups')
          .select('*');
          
        if (error) {
          console.error('Error fetching startups:', error);
          toast.error('Erreur lors du chargement des startups');
        } else if (data) {
          const transformedData: Startup[] = data.map(item => {
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
            
            return {
              id: item.id,
              name: item.name,
              logoUrl: item.logo_url || '',
              shortDescription: item.short_description,
              longTermVision: item.long_term_vision || '',
              founders: parsedFounders,
              aiUseCases: item.ai_use_cases || '',
              aiTools: item.ai_tools ? item.ai_tools : [],
              sector: item.sector as Sector,
              businessModel: item.business_model,
              maturityLevel: item.maturity_level,
              aiImpactScore: item.ai_impact_score as number,
              tags: item.tags || [],
              websiteUrl: item.website_url,
              pitchDeckUrl: item.pitch_deck_url,
              crunchbaseUrl: item.crunchbase_url,
              notionUrl: item.notion_url,
              dateAdded: item.date_added,
              viewCount: item.view_count,
              isFeatured: item.is_featured,
              upvoteCount: item.upvotes_count || 0,
            };
          });
          
          setStartups(transformedData);
          setFilteredStartups(transformedData);
          
          // Initialize voting state
          const votesState: Record<string, { upvoted: boolean, downvoted: boolean, count: number }> = {};
          transformedData.forEach(startup => {
            votesState[startup.id] = { 
              upvoted: false, 
              downvoted: false,
              count: startup.upvoteCount || 0
            };
          });
          setStartupVotes(votesState);
          
          const uniqueSectors = Array.from(new Set(data.map(startup => startup.sector)));
          setSectors(uniqueSectors);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, []);
  
  useEffect(() => {
    // Check user's votes if logged in
    const checkUserVotes = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('post_upvotes')
          .select('post_id, is_upvote')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error checking user votes:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const newVotesState = { ...startupVotes };
          
          data.forEach(vote => {
            if (newVotesState[vote.post_id]) {
              if (vote.is_upvote) {
                newVotesState[vote.post_id].upvoted = true;
                newVotesState[vote.post_id].downvoted = false;
              } else {
                newVotesState[vote.post_id].upvoted = false;
                newVotesState[vote.post_id].downvoted = true;
              }
            }
          });
          
          setStartupVotes(newVotesState);
        }
      } catch (error) {
        console.error('Error fetching user votes:', error);
      }
    };
    
    checkUserVotes();
  }, [user, startupVotes]);
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStartups(startups);
      return;
    }

    const filtered = startups.filter((startup) =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (startup.tags && startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );
    
    setFilteredStartups(filtered);
  }, [searchQuery, startups]);
  
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredStartups(startups);
      return;
    }
    
    const filtered = startups.filter((startup) => 
      startup.sector === activeCategory
    );
    
    setFilteredStartups(filtered);
  }, [activeCategory, startups]);

  return { 
    startups, 
    filteredStartups, 
    sectors, 
    isLoading, 
    startupVotes, 
    setStartupVotes,
    setFilteredStartups 
  };
};

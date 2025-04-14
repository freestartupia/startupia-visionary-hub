
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Startup } from "@/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import VoteButtons from "@/components/startup/VoteButtons";
import StartupLogo from "@/components/startup/StartupLogo";
import TagList from "@/components/startup/TagList";

interface StartupCardProps {
  startup: Startup;
}

const StartupCard = ({ startup }: StartupCardProps) => {
  const { user } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(startup.upvotes_count || 0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  
  // Fetch initial vote status
  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        // Toujours utiliser upvotes_count
        setUpvoteCount(startup.upvotes_count || 0);
        
        // Check if user has voted for this startup
        if (user) {
          const { data, error } = await supabase
            .from('startup_votes')
            .select('is_upvote')
            .eq('startup_id', startup.id)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (!error && data) {
            setIsUpvoted(data.is_upvote === true);
            setIsDownvoted(data.is_upvote === false);
            console.log(`Vote état initial pour ${startup.name}:`, data.is_upvote ? "positif" : "négatif");
          }
        }
      } catch (error) {
        console.error('Error fetching vote status:', error);
      }
    };
    
    fetchVoteStatus();
  }, [startup.id, startup.upvotes_count, user]);
  
  // Update when upvotes_count changes
  useEffect(() => {
    setUpvoteCount(startup.upvotes_count || 0);
  }, [startup.upvotes_count]);

  // Handle vote changes
  const handleVoteChange = (newCount: number) => {
    // Update local count
    setUpvoteCount(newCount);
    
    // Update global startup object
    startup.upvotes_count = newCount;
  };

  return (
    <Link to={`/startup/${startup.id}`}>
      <Card className="hover-scale glass-card overflow-hidden h-full border border-startupia-turquoise/20 bg-black/30">
        <div className="p-4 flex items-center justify-between border-b border-startupia-turquoise/10">
          <div className="flex items-center">
            <StartupLogo logoUrl={startup.logoUrl} name={startup.name} />
            <div className="ml-3">
              <h3 className="font-bold text-white">{startup.name}</h3>
              <p className="text-sm text-white/60">{startup.sector}</p>
            </div>
          </div>
          
          <VoteButtons 
            startupId={startup.id}
            initialUpvoteCount={upvoteCount}
            initialIsUpvoted={isUpvoted}
            initialIsDownvoted={isDownvoted}
            onVoteChange={handleVoteChange}
          />
        </div>
        <CardContent className="p-4">
          <p className="text-white/80 text-sm line-clamp-2 mb-3">{startup.shortDescription}</p>
          <TagList tags={startup.tags} limit={3} />
        </CardContent>
      </Card>
    </Link>
  );
};

export default StartupCard;

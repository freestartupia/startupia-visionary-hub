import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ThumbsUp } from "lucide-react";
import { Startup } from "@/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toggleStartupUpvote } from "@/services/startupVoteService";

interface StartupCardProps {
  startup: Startup;
}

const StartupCard = ({ startup }: StartupCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upvoteCount, setUpvoteCount] = useState(startup.upvoteCount || 0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  
  useEffect(() => {
    const fetchUpvoteData = async () => {
      try {
        if (typeof startup.upvoteCount === 'number') {
          setUpvoteCount(startup.upvoteCount);
        }
        
        if (user) {
          const { data: userUpvote, error: userError } = await supabase
            .from('startup_votes')
            .select('id, is_upvote')
            .eq('startup_id', startup.id)
            .eq('user_id', user.id)
            .single();
            
          if (!userError && userUpvote && userUpvote.is_upvote) {
            setIsUpvoted(true);
          }
        }
      } catch (error) {
        console.error('Error fetching upvote data:', error);
      }
    };
    
    fetchUpvoteData();
  }, [startup.id, startup.upvoteCount, user]);
  
  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Vous devez être connecté pour voter");
      navigate('/auth');
      return;
    }
    
    if (isVoting) return;
    
    setIsVoting(true);
    
    const previousUpvoted = isUpvoted;
    const previousCount = upvoteCount;
    
    if (isUpvoted) {
      setUpvoteCount(prev => prev - 1);
      setIsUpvoted(false);
    } else {
      setUpvoteCount(prev => prev + 1);
      setIsUpvoted(true);
    }
    
    try {
      const response = await toggleStartupUpvote(startup.id);
      
      if (response.success) {
        setUpvoteCount(response.newCount);
        setIsUpvoted(response.upvoted);
        
        if (response.message) {
          toast.success(response.message);
        }
      } else {
        setUpvoteCount(previousCount);
        setIsUpvoted(previousUpvoted);
        toast.error(response.message || "Erreur lors du vote");
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
      toast.error("Erreur lors du vote");
    } finally {
      setTimeout(() => setIsVoting(false), 500);
    }
  };

  const renderStars = (score: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < score ? "text-startupia-turquoise fill-startupia-turquoise" : "text-gray-600"
          }`}
        />
      ));
  };

  return (
    <Link to={`/startup/${startup.id}`}>
      <Card className="hover-scale glass-card overflow-hidden h-full border border-startupia-turquoise/20 bg-black/30">
        <div className="p-4 flex items-center justify-between border-b border-startupia-turquoise/10">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-startupia-turquoise/10 flex items-center justify-center">
              {startup.logoUrl ? (
                <img 
                  src={startup.logoUrl} 
                  alt={`${startup.name} logo`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-startupia-turquoise">
                  {startup.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="ml-3">
              <h3 className="font-bold text-white">{startup.name}</h3>
              <p className="text-sm text-white/60">{startup.sector}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className={`hover:bg-startupia-turquoise/20 mr-2 transition-colors ${
                isUpvoted ? 'text-startupia-turquoise' : 'text-white/70'
              } ${isVoting ? 'opacity-50' : ''}`}
              onClick={handleVote}
              disabled={isVoting}
            >
              <ThumbsUp size={16} className={`mr-1 ${isVoting ? 'animate-pulse' : ''}`} />
              <span>{upvoteCount}</span>
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-white/80 text-sm line-clamp-2 mb-3">{startup.shortDescription}</p>
          <div className="flex flex-wrap gap-1">
            {startup.tags && startup.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-startupia-turquoise/10 text-startupia-turquoise"
              >
                {tag}
              </span>
            ))}
            {startup.tags && startup.tags.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-startupia-turquoise/10 text-white/60">
                +{startup.tags.length - 3}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StartupCard;

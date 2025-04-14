
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Startup } from "@/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toggleStartupUpvote, toggleStartupDownvote } from "@/services/startupVoteService";

interface StartupCardProps {
  startup: Startup;
}

const StartupCard = ({ startup }: StartupCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // S'assurer que nous utilisons uniquement upvotes_count
  const [upvoteCount, setUpvoteCount] = useState(startup.upvotes_count || 0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  
  // Fetch initial vote status and count
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
  
  // Mettre à jour lorsque upvotes_count change
  useEffect(() => {
    setUpvoteCount(startup.upvotes_count || 0);
  }, [startup.upvotes_count]);
  
  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Vous devez être connecté pour voter");
      navigate('/auth');
      return;
    }
    
    if (isVoting) return;
    
    setIsVoting(true);
    
    try {
      console.log(`Upvote pour startup: ${startup.id} (${startup.name}), count actuel: ${upvoteCount}`);
      const response = await toggleStartupUpvote(startup.id);
      console.log(`Réponse upvote pour ${startup.name}:`, response);
      
      if (response.success) {
        // Mettre à jour le compte de votes en utilisant la valeur retournée de l'API
        setUpvoteCount(response.newCount);
        setIsUpvoted(response.upvoted);
        setIsDownvoted(false);
        
        // Mise à jour globale
        startup.upvotes_count = response.newCount;
        
        toast.success(response.message || "Vote enregistré");
      } else {
        toast.error(response.message || "Erreur lors du vote");
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
      toast.error("Erreur lors du vote");
    } finally {
      setTimeout(() => setIsVoting(false), 500);
    }
  };
  
  const handleDownvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Vous devez être connecté pour voter");
      navigate('/auth');
      return;
    }
    
    if (isVoting) return;
    
    setIsVoting(true);
    
    try {
      console.log(`Downvote pour startup: ${startup.id} (${startup.name}), count actuel: ${upvoteCount}`);
      const response = await toggleStartupDownvote(startup.id);
      console.log(`Réponse downvote pour ${startup.name}:`, response);
      
      if (response.success) {
        // Mettre à jour le compte de votes en utilisant la valeur retournée de l'API
        setUpvoteCount(response.newCount);
        setIsDownvoted(response.upvoted);
        setIsUpvoted(false);
        
        // Mise à jour globale
        startup.upvotes_count = response.newCount;
        
        toast.success(response.message || "Vote enregistré");
      } else {
        toast.error(response.message || "Erreur lors du vote");
      }
    } catch (error) {
      console.error('Error toggling downvote:', error);
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

  // Toujours afficher le nombre de votes exact depuis upvoteCount
  const getDisplayVoteCount = () => {
    return upvoteCount;
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
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`hover:bg-startupia-turquoise/20 transition-colors ${
                isUpvoted ? 'text-startupia-turquoise' : 'text-white/70'
              } ${isVoting ? 'opacity-50' : ''}`}
              onClick={handleUpvote}
              disabled={isVoting}
            >
              <ThumbsUp size={16} className={isVoting ? 'animate-pulse' : ''} />
            </Button>
            <span className="text-white mx-1">
              {getDisplayVoteCount()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`hover:bg-red-500/20 transition-colors ${
                isDownvoted ? 'text-red-500' : 'text-white/70'
              } ${isVoting ? 'opacity-50' : ''}`}
              onClick={handleDownvote}
              disabled={isVoting}
            >
              <ThumbsDown size={16} className={isVoting ? 'animate-pulse' : ''} />
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

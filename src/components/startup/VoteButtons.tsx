
import React, { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { toggleStartupUpvote, toggleStartupDownvote } from "@/services/startupVoteService";

interface VoteButtonsProps {
  startupId: string;
  initialUpvoteCount: number;
  initialIsUpvoted: boolean;
  initialIsDownvoted: boolean;
  onVoteChange: (newCount: number) => void;
}

const VoteButtons = ({ 
  startupId, 
  initialUpvoteCount, 
  initialIsUpvoted, 
  initialIsDownvoted,
  onVoteChange
}: VoteButtonsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount);
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted);
  const [isDownvoted, setIsDownvoted] = useState(initialIsDownvoted);
  const [isVoting, setIsVoting] = useState(false);

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
      console.log(`Upvote pour startup: ${startupId}, count actuel: ${upvoteCount}`);
      const response = await toggleStartupUpvote(startupId);
      console.log(`Réponse upvote:`, response);
      
      if (response.success) {
        // Mettre à jour le compte de votes en utilisant la valeur retournée de l'API
        setUpvoteCount(response.newCount);
        setIsUpvoted(response.upvoted);
        setIsDownvoted(false);
        
        // Notifier le parent du changement
        onVoteChange(response.newCount);
        
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
      console.log(`Downvote pour startup: ${startupId}, count actuel: ${upvoteCount}`);
      const response = await toggleStartupDownvote(startupId);
      console.log(`Réponse downvote:`, response);
      
      if (response.success) {
        // Mettre à jour le compte de votes en utilisant la valeur retournée de l'API
        setUpvoteCount(response.newCount);
        setIsDownvoted(response.upvoted);
        setIsUpvoted(false);
        
        // Notifier le parent du changement
        onVoteChange(response.newCount);
        
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

  return (
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
        {upvoteCount}
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
  );
};

export default VoteButtons;

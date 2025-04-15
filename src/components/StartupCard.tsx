
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Startup } from "@/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import StartupLogo from "@/components/startup/StartupLogo";
import TagList from "@/components/startup/TagList";
import { ThumbsUp } from "lucide-react";
import { upvoteStartup, downvoteStartup } from "@/services/startupService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface StartupCardProps {
  startup: Startup;
  onUpvote?: (startupId: string, newCount: number) => void;
}

const StartupCard = ({ startup, onUpvote }: StartupCardProps) => {
  const [upvotes, setUpvotes] = useState(startup.upvotes || 0);
  const [isUpvoted, setIsUpvoted] = useState(startup.isUpvoted || false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    if (!user) {
      toast.error("Vous devez être connecté pour voter", {
        description: "Connectez-vous pour pouvoir soutenir vos startups préférées"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isUpvoted) {
        const success = await downvoteStartup(startup.id);
        if (success) {
          const newCount = Math.max(0, upvotes - 1);
          setUpvotes(newCount);
          setIsUpvoted(false);
          if (onUpvote) onUpvote(startup.id, newCount);
          toast.success("Vote retiré");
        } else {
          toast.error("Erreur lors du retrait du vote");
        }
      } else {
        const success = await upvoteStartup(startup.id);
        if (success) {
          const newCount = upvotes + 1;
          setUpvotes(newCount);
          setIsUpvoted(true);
          if (onUpvote) onUpvote(startup.id, newCount);
          toast.success("Vote enregistré !");
        } else {
          toast.error("Erreur lors du vote");
        }
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
      toast.error("Erreur lors du vote");
    } finally {
      setIsLoading(false);
    }
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
          <button 
            onClick={handleUpvote}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isUpvoted 
                ? 'bg-startupia-turquoise/20 text-startupia-turquoise' 
                : 'bg-black/20 text-white/70 hover:bg-startupia-turquoise/10 hover:text-white'
            }`}
            aria-label={isUpvoted ? "Retirer le vote" : "Voter"}
            disabled={isLoading}
          >
            <ThumbsUp size={16} className={isUpvoted ? 'fill-startupia-turquoise' : ''} />
            <span>{upvotes}</span>
          </button>
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

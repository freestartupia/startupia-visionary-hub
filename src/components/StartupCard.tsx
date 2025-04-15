
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Startup } from "@/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StartupLogo from "@/components/startup/StartupLogo";
import TagList from "@/components/startup/TagList";
import { ArrowUp } from "lucide-react";
import { upvoteStartup, removeStartupUpvote, hasUpvotedStartup } from "@/services/startupUpvoteService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface StartupCardProps {
  startup: Startup;
  refetchStartups?: () => void;
}

const StartupCard = ({ startup, refetchStartups }: StartupCardProps) => {
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(startup.upvotes || 0);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Mettre à jour le compteur si la valeur change
    setUpvoteCount(startup.upvotes || 0);
    
    const checkUpvoteStatus = async () => {
      if (!user) return;
      
      const hasUpvoted = await hasUpvotedStartup(startup.id);
      setUpvoted(hasUpvoted);
    };
    
    checkUpvoteStatus();
  }, [startup, user]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUpvoting) return;
    
    setIsUpvoting(true);
    
    try {
      console.log('Tentative de vote pour startup:', startup.id, startup.name);
      
      if (upvoted) {
        const success = await removeStartupUpvote(startup.id);
        if (success) {
          setUpvoted(false);
          setUpvoteCount(prev => Math.max(0, prev - 1));
          
          if (refetchStartups) {
            refetchStartups();
          }
        }
      } else {
        const success = await upvoteStartup(startup.id);
        if (success) {
          setUpvoted(true);
          setUpvoteCount(prev => prev + 1);
          
          if (refetchStartups) {
            refetchStartups();
          }
        }
      }
    } catch (error) {
      console.error("Error handling upvote:", error);
      toast.error("Erreur lors de l'upvote");
    } finally {
      setIsUpvoting(false);
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
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center gap-1 ${upvoted ? 'text-startupia-turquoise' : 'text-white/70'}`}
            onClick={handleUpvote}
            disabled={isUpvoting}
          >
            <ArrowUp size={16} className={upvoted ? 'fill-startupia-turquoise' : ''} />
            <span>{upvoteCount}</span>
          </Button>
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

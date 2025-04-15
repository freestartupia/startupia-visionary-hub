
import React from "react";
import { Link } from "react-router-dom";
import { Startup } from "@/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import StartupLogo from "@/components/startup/StartupLogo";
import TagList from "@/components/startup/TagList";
import { ArrowUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { toggleStartupUpvote } from "@/services/startupUpvoteService";
import AuthRequired from "@/components/AuthRequired";

interface StartupCardProps {
  startup: Startup;
  onUpvote?: (startupId: string) => void;
}

const StartupCard = ({ startup, onUpvote }: StartupCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Vous devez être connecté pour voter");
      navigate('/auth');
      return;
    }

    try {
      const result = await toggleStartupUpvote(startup.id);
      
      if (result.success) {
        if (onUpvote) {
          onUpvote(startup.id);
        }
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error upvoting startup:", error);
      toast.error("Une erreur est survenue");
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
          <AuthRequired forActiveParticipation={true}>
            <button 
              onClick={handleUpvote}
              className={`flex items-center gap-1 rounded-full p-2 transition-colors ${
                startup.isUpvoted 
                  ? "bg-startupia-turquoise/20 text-startupia-turquoise" 
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}
            >
              <ArrowUp size={16} />
              <span className="text-sm font-medium">{startup.votesCount || 0}</span>
            </button>
          </AuthRequired>
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


import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Startup } from "@/types/startup";
import { Card, CardContent } from "@/components/ui/card";

interface StartupCardProps {
  startup: Startup;
}

const StartupCard = ({ startup }: StartupCardProps) => {
  // Generate stars for AI Impact Score
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
            {renderStars(startup.aiImpactScore)}
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-white/80 text-sm line-clamp-2 mb-3">{startup.shortDescription}</p>
          <div className="flex flex-wrap gap-1">
            {startup.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-startupia-turquoise/10 text-startupia-turquoise"
              >
                {tag}
              </span>
            ))}
            {startup.tags.length > 3 && (
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

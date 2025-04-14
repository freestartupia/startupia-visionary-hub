
import React from "react";
import { Link } from "react-router-dom";
import { Startup } from "@/types/startup";
import { Card, CardContent } from "@/components/ui/card";
import StartupLogo from "@/components/startup/StartupLogo";
import TagList from "@/components/startup/TagList";

interface StartupCardProps {
  startup: Startup;
}

const StartupCard = ({ startup }: StartupCardProps) => {
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

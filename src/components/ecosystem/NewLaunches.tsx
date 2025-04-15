
import React from "react";
import { Startup } from "@/types/startup";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StartupLogo from "@/components/startup/StartupLogo";
import { Link } from "react-router-dom";

interface NewLaunchesProps {
  startupsFeatured: Startup[];
}

const NewLaunches = ({ startupsFeatured }: NewLaunchesProps) => {
  if (!startupsFeatured || startupsFeatured.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center mb-4">
        <Sparkles size={20} className="mr-2 text-startupia-gold" />
        <h2 className="text-2xl font-bold">Derniers lancements</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {startupsFeatured.map((startup) => (
          <Link to={`/startup/${startup.id}`} key={startup.id}>
            <Card className="hover-scale glass-card overflow-hidden h-full border border-startupia-purple/20 bg-black/30">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <StartupLogo logoUrl={startup.logoUrl} name={startup.name} size="sm" />
                  <h3 className="ml-2 font-semibold text-sm">{startup.name}</h3>
                </div>
                <p className="text-white/70 text-xs line-clamp-2">{startup.shortDescription}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NewLaunches;

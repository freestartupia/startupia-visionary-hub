
import React from "react";
import { Startup } from "@/types/startup";
import { Card, CardContent } from "@/components/ui/card";

interface RadarViewProps {
  startupList: Startup[];
}

const RadarView = ({ startupList }: RadarViewProps) => {
  return (
    <Card className="glass-card border border-startupia-turquoise/20 bg-black/30">
      <CardContent className="p-6">
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">Radar des technologies IA</h3>
          <p className="text-white/70">
            Le radar des technologies d'intelligence artificielle sera bientôt disponible.
          </p>
          <p className="text-white/50 text-sm mt-4">
            {startupList.length} startups recensées dans notre base de données
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadarView;

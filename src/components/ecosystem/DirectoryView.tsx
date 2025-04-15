
import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Startup } from "@/types/startup";
import StartupCard from "@/components/StartupCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DirectoryViewProps {
  startups: Startup[];
  isLoading?: boolean;
  onUpvote?: (startupId: string, newCount: number) => void;
}

const DirectoryView = ({ startups, isLoading, onUpvote }: DirectoryViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedAITool, setSelectedAITool] = useState<string | null>(null);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);

  // Extract unique sectors and AI tools for filtering
  const sectors = Array.from(new Set(startups.map((s) => s.sector))).filter(Boolean) as string[];
  const aiTools = Array.from(
    new Set(startups.flatMap((s) => s.aiTools || []))
  ).filter(Boolean) as string[];

  // Apply filters and search
  useEffect(() => {
    let result = [...startups];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.shortDescription.toLowerCase().includes(query) ||
          (s.tags && s.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    // Apply sector filter
    if (selectedSector) {
      result = result.filter((s) => s.sector === selectedSector);
    }

    // Apply AI tool filter
    if (selectedAITool) {
      result = result.filter(
        (s) => s.aiTools && s.aiTools.includes(selectedAITool as any)
      );
    }

    // Sort by upvotes (descending)
    result.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

    setFilteredStartups(result);
  }, [startups, searchQuery, selectedSector, selectedAITool]);

  if (isLoading) {
    return <div className="text-center py-10">Chargement des startups...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
          <Input
            type="text"
            placeholder="Rechercher une startup IA..."
            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-white/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center">
            <Filter size={14} className="mr-1" />
            Secteur:
          </span>
          <Badge
            variant={selectedSector === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedSector(null)}
          >
            Tous
          </Badge>
          {sectors.map((sector) => (
            <Badge
              key={sector}
              variant={selectedSector === sector ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedSector(sector)}
            >
              {sector}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="flex items-center">
            <Filter size={14} className="mr-1" />
            Outils IA:
          </span>
          <Badge
            variant={selectedAITool === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedAITool(null)}
          >
            Tous
          </Badge>
          {aiTools.map((tool) => (
            <Badge
              key={tool}
              variant={selectedAITool === tool ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedAITool(tool)}
            >
              {tool}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.length > 0 ? (
          filteredStartups.map((startup) => (
            <StartupCard 
              key={startup.id} 
              startup={startup} 
              onUpvote={onUpvote}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            Aucune startup ne correspond à vos critères de recherche.
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryView;

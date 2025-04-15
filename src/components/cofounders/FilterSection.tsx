
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProfileType,
  Sector,
  AITool,
  Region,
  Objective,
  Role
} from '@/types/cofounders';

interface FilterSectionProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  sectors: Sector[];
  regions: Region[];
  objectives: Objective[];
  roles: Role[];
  allAiTools: AITool[];
  profileType: ProfileType | 'all';
  sector: Sector | 'all';
  role: Role | 'all';
  aiTools: AITool[];
  region: Region | 'all';
  objective: Objective | 'all';
  setProfileType: (value: ProfileType | 'all') => void;
  setSector: (value: Sector | 'all') => void;
  setRole: (value: Role | 'all') => void;
  setAiTools: (value: AITool[]) => void;
  setRegion: (value: Region | 'all') => void;
  setObjective: (value: Objective | 'all') => void;
  toggleAITool: (tool: AITool) => void;
  clearFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  showFilters,
  setShowFilters,
  sectors,
  regions,
  objectives,
  roles,
  allAiTools,
  profileType,
  sector,
  role,
  aiTools,
  region,
  objective,
  setProfileType,
  setSector,
  setRole,
  setRegion,
  setObjective,
  toggleAITool,
  clearFilters
}) => {
  return (
    <Collapsible open={showFilters} onOpenChange={setShowFilters}>
      <CollapsibleContent>
        <div className="glass-card p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white/70">Type de profil</label>
              <Select onValueChange={(value) => setProfileType(value as ProfileType | 'all')} value={profileType}>
                <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                  <SelectValue placeholder="Tous les profils" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-startupia-turquoise/30">
                  <SelectItem value="all">Tous les profils</SelectItem>
                  <SelectItem value="project-owner">Porteurs de projets</SelectItem>
                  <SelectItem value="collaborator">Collaborateurs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-white/70">Secteur</label>
              <Select onValueChange={(value) => setSector(value as Sector | 'all')} value={sector}>
                <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                  <SelectValue placeholder="Tous les secteurs" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-startupia-turquoise/30">
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-white/70">Rôle</label>
              <Select onValueChange={(value) => setRole(value as Role | 'all')} value={role}>
                <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-startupia-turquoise/30">
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-white/70">Région</label>
              <Select onValueChange={(value) => setRegion(value as Region | 'all')} value={region}>
                <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                  <SelectValue placeholder="Toutes les régions" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-startupia-turquoise/30">
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-white/70">Objectif</label>
              <Select onValueChange={(value) => setObjective(value as Objective | 'all')} value={objective}>
                <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                  <SelectValue placeholder="Tous les objectifs" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-startupia-turquoise/30">
                  <SelectItem value="all">Tous les objectifs</SelectItem>
                  {objectives.map((objective) => (
                    <SelectItem key={objective} value={objective}>
                      {objective}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-white/70">Outils IA maîtrisés</label>
            <div className="flex flex-wrap gap-2">
              {allAiTools.map((tool) => (
                <Badge
                  key={tool}
                  variant="outline"
                  className={`cursor-pointer ${
                    aiTools.includes(tool)
                      ? "bg-startupia-turquoise/20 text-startupia-turquoise border-startupia-turquoise"
                      : "border-white/30"
                  }`}
                  onClick={() => toggleAITool(tool)}
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              className="border-white/30 text-white/70 hover:text-white"
              onClick={clearFilters}
            >
              Effacer les filtres
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FilterSection;


import React, { useState, useEffect } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileCard from '@/components/ProfileCard';
import {
  CofounderProfile,
  ProfileType,
  Sector,
  AITool,
  Region,
  Objective,
  Role
} from '@/types/cofounders';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CoFounderSearchProps {
  profiles: CofounderProfile[];
  requireAuth?: boolean;
}

const CoFounderSearch = ({ profiles, requireAuth = false }: CoFounderSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState<CofounderProfile[]>(profiles);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filter states
  const [profileType, setProfileType] = useState<ProfileType | 'all'>('all');
  const [sector, setSector] = useState<Sector | 'all'>('all');
  const [role, setRole] = useState<Role | 'all'>('all');
  const [aiTools, setAiTools] = useState<AITool[]>([]);
  const [region, setRegion] = useState<Region | 'all'>('all');
  const [objective, setObjective] = useState<Objective | 'all'>('all');

  // Get unique values for dropdowns
  const sectors = [...new Set(profiles.map(p => p.sector))];
  const regions = [...new Set(profiles.map(p => p.region))];
  const allAiTools = [...new Set(profiles.flatMap(p => p.aiTools))];
  const objectives = [...new Set(profiles.map(p => p.objective))];
  const roles = [...new Set(profiles.map(p => p.role))];

  // Apply filters
  useEffect(() => {
    let result = [...profiles];

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        profile => 
          profile.name.toLowerCase().includes(term) || 
          profile.pitch.toLowerCase().includes(term) ||
          profile.vision.toLowerCase().includes(term) ||
          (profile.projectName && profile.projectName.toLowerCase().includes(term))
      );
    }

    // Profile type filter
    if (profileType !== 'all') {
      result = result.filter(profile => profile.profileType === profileType);
    }

    // Sector filter
    if (sector !== 'all') {
      result = result.filter(profile => profile.sector === sector);
    }

    // Role filter
    if (role !== 'all') {
      result = result.filter(
        profile => profile.role === role || profile.seekingRoles.includes(role as Role)
      );
    }

    // AI Tools filter
    if (aiTools.length > 0) {
      result = result.filter(profile => 
        profile.aiTools.some(tool => aiTools.includes(tool))
      );
    }

    // Region filter
    if (region !== 'all') {
      result = result.filter(profile => profile.region === region);
    }

    // Objective filter
    if (objective !== 'all') {
      result = result.filter(profile => profile.objective === objective);
    }

    setFilteredProfiles(result);
  }, [profiles, searchTerm, profileType, sector, role, aiTools, region, objective]);

  const toggleAITool = (tool: AITool) => {
    setAiTools(prev => 
      prev.includes(tool)
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    );
  };

  const handleMatch = (profileId: string) => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour contacter un profil");
      navigate('/auth');
      return;
    }
    
    toast.success("Demande de contact envoyée !");
    // In a real app, this would send a match request to the backend
  };

  const clearFilters = () => {
    setSearchTerm('');
    setProfileType('all');
    setSector('all');
    setRole('all');
    setAiTools([]);
    setRegion('all');
    setObjective('all');
  };

  return (
    <div className="space-y-6">
      {/* Search and filter header */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <Input
            type="text"
            placeholder="Rechercher par nom, compétence ou secteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/20 border-startupia-turquoise/30 focus-visible:ring-startupia-turquoise/50"
          />
        </div>
        <Button
          variant="outline"
          className="border-startupia-turquoise text-white flex items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2" size={16} />
          Filtres
        </Button>
      </div>

      {/* Filters */}
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
                  <SelectContent>
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
                  <SelectContent>
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
                  <SelectContent>
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
                  <SelectContent>
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
                  <SelectContent>
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

      {/* Results count */}
      <div className="flex justify-between items-center">
        <p className="text-white/70">
          {filteredProfiles.length} {filteredProfiles.length > 1 ? "profils trouvés" : "profil trouvé"}
        </p>
      </div>

      {/* Profile cards */}
      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard 
              key={profile.id} 
              profile={profile} 
              onMatch={() => handleMatch(profile.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card">
          <p className="text-white/70 text-lg">Aucun profil ne correspond à vos critères.</p>
          <Button 
            className="mt-4 bg-startupia-turquoise hover:bg-startupia-turquoise/90"
            onClick={clearFilters}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoFounderSearch;

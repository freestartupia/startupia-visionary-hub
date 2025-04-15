
import { useState, useEffect } from 'react';
import { CofounderProfile, ProfileType, Sector, Role, AITool, Region, Objective } from '@/types/cofounders';

export const useCofounderFilters = (profiles: CofounderProfile[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState<CofounderProfile[]>(profiles);
  const [showFilters, setShowFilters] = useState(false);
  
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

  const clearFilters = () => {
    setSearchTerm('');
    setProfileType('all');
    setSector('all');
    setRole('all');
    setAiTools([]);
    setRegion('all');
    setObjective('all');
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredProfiles,
    showFilters,
    setShowFilters,
    profileType,
    setProfileType,
    sector,
    setSector,
    role,
    setRole,
    aiTools,
    setAiTools,
    region,
    setRegion,
    objective,
    setObjective,
    sectors,
    regions,
    allAiTools,
    objectives,
    roles,
    toggleAITool,
    clearFilters
  };
};

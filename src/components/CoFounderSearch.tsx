
import React from 'react';
import { CofounderProfile } from '@/types/cofounders';
import { useCofounderFilters } from '@/hooks/useCofounderFilters';
import SearchBar from './cofounders/SearchBar';
import FilterToggle from './cofounders/FilterToggle';
import FilterSection from './cofounders/FilterSection';
import ResultsCount from './cofounders/ResultsCount';
import ProfileGrid from './cofounders/ProfileGrid';
import NoResultsMessage from './cofounders/NoResultsMessage';

interface CoFounderSearchProps {
  profiles: CofounderProfile[];
  requireAuth?: boolean;
  onMatchRequest?: (profileId: string) => void;
}

const CoFounderSearch = ({ 
  profiles, 
  requireAuth = false, 
  onMatchRequest 
}: CoFounderSearchProps) => {
  const {
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
  } = useCofounderFilters(profiles);

  const handleMatch = (profileId: string) => {
    if (onMatchRequest) {
      onMatchRequest(profileId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and filter header */}
      <div className="flex flex-col md:flex-row gap-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FilterToggle showFilters={showFilters} setShowFilters={setShowFilters} />
      </div>

      {/* Filters */}
      <FilterSection
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sectors={sectors}
        regions={regions}
        objectives={objectives}
        roles={roles}
        allAiTools={allAiTools}
        profileType={profileType}
        sector={sector}
        role={role}
        aiTools={aiTools}
        region={region}
        objective={objective}
        setProfileType={setProfileType}
        setSector={setSector}
        setRole={setRole}
        setAiTools={() => {}} // This is handled by toggleAITool
        setRegion={setRegion}
        setObjective={setObjective}
        toggleAITool={toggleAITool}
        clearFilters={clearFilters}
      />

      {/* Results count */}
      <ResultsCount count={filteredProfiles.length} />

      {/* Profile cards */}
      {filteredProfiles.length > 0 ? (
        <ProfileGrid profiles={filteredProfiles} onMatch={handleMatch} />
      ) : (
        <NoResultsMessage clearFilters={clearFilters} />
      )}
    </div>
  );
};

export default CoFounderSearch;

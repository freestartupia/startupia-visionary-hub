
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '@/types/community';

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedStatus: ProjectStatus | 'all';
  onStatusChange: (status: ProjectStatus | 'all') => void;
  statuses: (ProjectStatus | 'all')[];
  onProposeProject: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  statuses,
  onProposeProject
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un projet..."
            className="pl-10"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        <Button className="flex items-center gap-2" onClick={onProposeProject}>
          Proposer un projet
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((status) => (
          <Badge 
            key={status} 
            variant={selectedStatus === status ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onStatusChange(status)}
          >
            {status === 'all' ? 'Tous' : status}
          </Badge>
        ))}
      </div>
    </>
  );
};

export default ProjectFilters;

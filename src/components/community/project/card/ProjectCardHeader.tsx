
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardHeader } from '@/components/ui/card';
import { ProjectStatus } from '@/types/community';

interface ProjectCardHeaderProps {
  title: string;
  status: ProjectStatus;
  category: string;
}

const ProjectCardHeader: React.FC<ProjectCardHeaderProps> = ({ title, status, category }) => {
  const getBadgeColorForStatus = (status: ProjectStatus) => {
    switch(status) {
      case 'Idée': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'En cours': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Recherche de collaborateurs': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'MVP': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Lancé': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default: return '';
    }
  };

  return (
    <CardHeader>
      <div className="flex justify-between items-start mb-2">
        <Badge className={getBadgeColorForStatus(status)}>
          {status}
        </Badge>
        <Badge variant="outline">{category}</Badge>
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </CardHeader>
  );
};

export default ProjectCardHeader;


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';

interface ProjectCardContentProps {
  description: string;
  skills: string[];
}

const ProjectCardContent: React.FC<ProjectCardContentProps> = ({ description, skills }) => {
  const truncateDescription = (text: string) => {
    if (text.length <= 120) return text;
    return text.slice(0, 120) + '...';
  };

  return (
    <CardContent>
      <div className="text-white/80 mb-4">
        {truncateDescription(description)}
      </div>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-1">Compétences recherchées :</p>
        <div className="flex flex-wrap gap-1">
          {skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </CardContent>
  );
};

export default ProjectCardContent;

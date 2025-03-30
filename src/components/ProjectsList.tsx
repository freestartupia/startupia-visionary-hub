
import React, { useState } from 'react';
import { CofounderProfile } from '@/types/cofounders';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProjectsListProps {
  projects: CofounderProfile[];
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);

  // Filter projects when search term changes
  React.useEffect(() => {
    if (searchTerm === '') {
      setFilteredProjects(projects);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = projects.filter(
        project =>
          (project.projectName && project.projectName.toLowerCase().includes(term)) ||
          project.name.toLowerCase().includes(term) ||
          project.sector.toLowerCase().includes(term) ||
          project.pitch.toLowerCase().includes(term)
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm, projects]);

  const handleContact = (projectId: string) => {
    toast.success("Demande de contact envoyée !");
    // In a real app, this would initiate a contact request
  };

  // Get all seeking roles from all projects
  const allSeekingRoles = Array.from(
    new Set(projects.flatMap(project => project.seekingRoles || []))
  );

  return (
    <div>
      <div className="glass-card p-6 mb-8">
        <h2 className="font-semibold text-xl mb-4">Projets en recherche de talents</h2>
        <p className="text-white/70 mb-6">
          Découvrez les projets AI actuellement à la recherche de co-fondateurs ou collaborateurs.
        </p>

        <div className="flex gap-4 items-center mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <Input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-startupia-turquoise/30 focus-visible:ring-startupia-turquoise/50"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-startupia-turquoise/20">
          <Table>
            <TableHeader className="bg-black/30">
              <TableRow>
                <TableHead>Projet</TableHead>
                <TableHead>Fondateur</TableHead>
                <TableHead className="hidden md:table-cell">Secteur</TableHead>
                <TableHead className="hidden md:table-cell">Stade</TableHead>
                <TableHead>Rôles recherchés</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-startupia-turquoise/5">
                    <TableCell className="font-medium">
                      {project.projectName || "Sans nom"}
                      <div className="text-xs text-white/60 mt-1 md:hidden">
                        {project.sector}
                      </div>
                    </TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{project.sector}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="border-white/30">
                        {project.projectStage || "Idée"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.seekingRoles && project.seekingRoles.length > 0 ? (
                          project.seekingRoles.map((role, index) => (
                            <Badge 
                              key={index}
                              className="bg-startupia-turquoise/20 text-startupia-turquoise border-none"
                            >
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-white/50 text-sm">Non spécifié</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm"
                        variant="outline" 
                        className="border-startupia-turquoise text-startupia-turquoise hover:bg-startupia-turquoise/10"
                        onClick={() => handleContact(project.id)}
                      >
                        Contacter
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun projet ne correspond à votre recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg mb-4">Rôles les plus recherchés</h3>
        <div className="flex flex-wrap gap-3">
          {allSeekingRoles.map((role) => {
            // Count how many projects are searching for this role
            const count = projects.filter(
              p => p.seekingRoles?.includes(role)
            ).length;
            
            return (
              <Badge 
                key={role}
                className={`
                  text-sm py-2 px-4
                  ${count > 2 
                    ? 'bg-startupia-turquoise text-black' 
                    : 'bg-startupia-turquoise/20 text-startupia-turquoise'}
                `}
              >
                {role} ({count})
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;

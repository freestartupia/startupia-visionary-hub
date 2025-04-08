
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProjectStage } from '@/types/cofounders';

interface ProfileDetailsProps {
  projectName: string;
  setProjectName: (value: string) => void;
  projectStage: ProjectStage | '';
  setProjectStage: (value: ProjectStage | '') => void;
  vision: string;
  setVision: (value: string) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  projectName,
  setProjectName,
  projectStage,
  setProjectStage,
  vision,
  setVision,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Détails du projet</h3>

      <div className="space-y-2">
        <Label htmlFor="projectName">Nom du projet</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Nom de votre projet ou startup"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectStage">Stade du projet</Label>
        <Select
          value={projectStage}
          onValueChange={(value) => setProjectStage(value as ProjectStage)}
        >
          <SelectTrigger id="projectStage">
            <SelectValue placeholder="Sélectionner un stade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Sélectionner un stade</SelectItem>
            <SelectItem value="Idée">Idée</SelectItem>
            <SelectItem value="MVP">MVP</SelectItem>
            <SelectItem value="Beta">Beta</SelectItem>
            <SelectItem value="Lancé">Lancé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vision">Vision</Label>
        <Textarea
          id="vision"
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          placeholder="Décrivez votre vision à long terme pour ce projet"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ProfileDetails;

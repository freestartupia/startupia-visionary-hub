
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
import { UseFormReturn } from 'react-hook-form';

interface ProfileDetailsProps {
  form: UseFormReturn<any, any, undefined>;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Détails du projet</h3>

      <div className="space-y-2">
        <Label htmlFor="projectName">Nom du projet</Label>
        <Input
          id="projectName"
          {...form.register('projectName')}
          placeholder="Nom de votre projet ou startup"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectStage">Stade du projet</Label>
        <Select
          value={form.watch('projectStage')}
          onValueChange={(value) => form.setValue('projectStage', value as ProjectStage)}
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
          {...form.register('vision')}
          placeholder="Décrivez votre vision à long terme pour ce projet"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ProfileDetails;

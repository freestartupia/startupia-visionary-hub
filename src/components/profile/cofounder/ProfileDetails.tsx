
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileDetailsProps {
  form: UseFormReturn<any>;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      {form.watch('profileType') === 'project-owner' && (
        <>
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du projet</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de votre startup/projet" {...field} className="bg-black/20 border-white/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectStage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stade du projet</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-black/20 border-white/20">
                      <SelectValue placeholder="Sélectionner un stade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Idée">Idée</SelectItem>
                    <SelectItem value="Prototype">Prototype</SelectItem>
                    <SelectItem value="MVP">MVP</SelectItem>
                    <SelectItem value="Beta">Beta</SelectItem>
                    <SelectItem value="Lancé">Lancé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <FormField
        control={form.control}
        name="objective"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objectif</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-black/20 border-white/20">
                  <SelectValue placeholder="Sélectionner un objectif" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Créer une startup">Créer une startup</SelectItem>
                <SelectItem value="Trouver un associé">Trouver un associé</SelectItem>
                <SelectItem value="Rejoindre un projet">Rejoindre un projet</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="availability"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Disponibilité</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-black/20 border-white/20">
                  <SelectValue placeholder="Sélectionner une disponibilité" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Temps plein">Temps plein</SelectItem>
                <SelectItem value="Mi-temps">Mi-temps</SelectItem>
                <SelectItem value="Soirs et weekends">Soirs et weekends</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileDetails;

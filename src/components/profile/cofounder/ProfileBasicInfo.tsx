
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileBasicInfoProps {
  form: UseFormReturn<any>;
}

const ProfileBasicInfo: React.FC<ProfileBasicInfoProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom complet</FormLabel>
            <FormControl>
              <Input placeholder="Votre nom" {...field} className="bg-black/20 border-white/20" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="profileType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de profil</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-black/20 border-white/20">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="collaborator">Collaborateur</SelectItem>
                <SelectItem value="project-owner">Porteur de projet</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-white/60">
              Vous cherchez à rejoindre un projet ou vous en avez un à proposer?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Votre rôle</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Développeur, Designer, CTO..." {...field} className="bg-black/20 border-white/20" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sector"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Secteur d'activité</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-black/20 border-white/20">
                  <SelectValue placeholder="Sélectionner un secteur" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Santé">Santé</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileBasicInfo;

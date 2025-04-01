import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { AITool, Availability, Region, Sector, CofounderProfile } from '@/types/cofounders';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

// Form schema
const formSchema = z.object({
  profileType: z.enum(['project-owner', 'collaborator']),
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  role: z.string().min(1, { message: 'Veuillez sélectionner un rôle' }),
  seekingRoles: z.array(z.string()).optional(),
  pitch: z.string().max(300, { message: 'Le pitch ne doit pas dépasser 300 caractères' }),
  sector: z.string().min(1, { message: 'Veuillez sélectionner un secteur' }),
  objective: z.string().min(1, { message: 'Veuillez sélectionner un objectif' }),
  aiTools: z.array(z.string()).min(1, { message: 'Sélectionnez au moins un outil IA' }),
  availability: z.string().min(1, { message: 'Veuillez indiquer votre disponibilité' }),
  vision: z.string().max(1000, { message: 'La vision ne doit pas dépasser 1000 caractères' }),
  region: z.string().min(1, { message: 'Veuillez indiquer votre région' }),
  linkedinUrl: z.string().url({ message: 'URL LinkedIn invalide' }).optional().or(z.literal('')),
  portfolioUrl: z.string().url({ message: 'URL Portfolio invalide' }).optional().or(z.literal('')),
  websiteUrl: z.string().url({ message: 'URL Website invalide' }).optional().or(z.literal('')),
  projectName: z.string().optional(),
  projectStage: z.enum(['Idée', 'MVP', 'Beta', 'Lancé']).optional(),
});

interface CoFounderProfileProps {
  onProfileCreated?: () => void;
  onProfileUpdated?: () => void;
  initialData?: CofounderProfile;
  isEditing?: boolean;
}

const CoFounderProfile = ({ onProfileCreated, onProfileUpdated, initialData, isEditing = false }: CoFounderProfileProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      profileType: initialData.profileType,
      name: initialData.name,
      role: initialData.role,
      seekingRoles: initialData.seekingRoles || [],
      pitch: initialData.pitch,
      sector: initialData.sector,
      objective: initialData.objective,
      aiTools: initialData.aiTools || [],
      availability: initialData.availability,
      vision: initialData.vision,
      region: initialData.region,
      linkedinUrl: initialData.linkedinUrl || '',
      portfolioUrl: initialData.portfolioUrl || '',
      websiteUrl: initialData.websiteUrl || '',
      projectName: initialData.projectName || '',
      projectStage: initialData.projectStage as any,
    } : {
      profileType: 'collaborator',
      name: user?.email?.split('@')[0] || '',
      role: '',
      seekingRoles: [],
      pitch: '',
      sector: '',
      objective: '',
      aiTools: [],
      availability: '',
      vision: '',
      region: '',
      linkedinUrl: '',
      portfolioUrl: '',
      websiteUrl: '',
      projectName: '',
      projectStage: undefined,
    },
  });

  const profileType = form.watch('profileType');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Create the cofounder profile object for database
      const profileData = {
        name: values.name,
        profile_type: values.profileType,
        role: values.role,
        seeking_roles: values.seekingRoles || [],
        pitch: values.pitch,
        sector: values.sector,
        objective: values.objective,
        ai_tools: values.aiTools,
        availability: values.availability,
        vision: values.vision,
        region: values.region,
        linkedin_url: values.linkedinUrl || null,
        portfolio_url: values.portfolioUrl || null,
        website_url: values.websiteUrl || null,
        photo_url: user?.email ? `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=random` : null,
        has_ai_badge: values.aiTools.length > 3, // Simple logic for AI badge
        project_name: values.profileType === 'project-owner' ? values.projectName : null,
        project_stage: values.profileType === 'project-owner' ? values.projectStage : null,
      };

      if (isEditing && initialData) {
        // Update existing profile
        const { error } = await supabase
          .from('cofounder_profiles')
          .update(profileData)
          .eq('id', initialData.id);
          
        if (error) throw error;
        
        toast.success("Votre profil a été mis à jour avec succès !");
        
        if (onProfileUpdated) {
          onProfileUpdated();
        }
      } else {
        // Create new profile
        const { error } = await supabase
          .from('cofounder_profiles')
          .insert([{ 
            ...profileData,
            id: uuidv4(),
            user_id: user?.id,
            date_created: new Date().toISOString(),
            matches: []
          }]);
          
        if (error) throw error;
        
        toast.success("Votre profil a été créé avec succès !", {
          description: "Vous pouvez maintenant rechercher ou être trouvé par d'autres cofondateurs"
        });
        
        if (onProfileCreated) {
          onProfileCreated();
        }
      }

      // Redirect after a delay to let the user see the success message
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Une erreur est survenue lors de la sauvegarde du profil");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availabilityOptions: Availability[] = [
    "Temps plein",
    "Mi-temps",
    "Soirs et weekends",
    "Quelques heures par semaine",
    "À définir",
  ];

  const regionOptions: Region[] = [
    "Paris",
    "Lyon",
    "Marseille",
    "Bordeaux",
    "Lille",
    "Toulouse",
    "Nantes",
    "Strasbourg",
    "Remote",
    "Autre",
  ];

  const sectorOptions: Sector[] = [
    "Santé",
    "RH",
    "Retail",
    "Finance", 
    "Education",
    "Marketing",
    "Légal",
    "Transport",
    "Immobilier",
    "Agriculture",
    "Energie",
    "Autre",
  ];
  
  const aiToolOptions: AITool[] = [
    "Python",
    "TensorFlow",
    "PyTorch",
    "ChatGPT",
    "Claude",
    "Midjourney",
    "LangChain",
    "Stable Diffusion",
    "Hugging Face",
    "No-code tools",
    "Autre",
  ];

  const roleOptions = [
    "Founder",
    "CTO",
    "Developer",
    "ML Engineer",
    "Data Scientist",
    "Designer",
    "Prompt Engineer", 
    "Business Developer",
    "Marketing",
    "Product Manager",
    "Other"
  ];

  const objectiveOptions = [
    "Créer une startup",
    "Rejoindre un projet",
    "Réseauter",
    "Explorer des idées",
    "Trouver un associé",
    "Autre"
  ];

  return (
    <div className="glass-card p-6">
      <h2 className="font-semibold text-xl mb-6">
        {isEditing ? "Modifier votre profil de cofondateur" : "Créer votre profil de cofondateur"}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Type */}
          <FormField
            control={form.control}
            name="profileType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Type de profil</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="project-owner" id="project-owner" className="border-startupia-turquoise text-startupia-turquoise" />
                      <label htmlFor="project-owner" className="cursor-pointer">Porteur de projet IA (j'ai une idée à développer)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="collaborator" id="collaborator" className="border-startupia-turquoise text-startupia-turquoise" />
                      <label htmlFor="collaborator" className="cursor-pointer">Collaborateur potentiel (je souhaite rejoindre un projet)</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom / Pseudo</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} className="bg-black/20 border-startupia-turquoise/30" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{profileType === 'collaborator' ? 'Rôle proposé' : 'Votre rôle actuel'}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Project Owner specific fields */}
          {profileType === 'project-owner' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du projet</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de votre projet ou startup" {...field} className="bg-black/20 border-startupia-turquoise/30" />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                          <SelectValue placeholder="Sélectionner le stade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Idée">Idée</SelectItem>
                        <SelectItem value="MVP">MVP</SelectItem>
                        <SelectItem value="Beta">Beta</SelectItem>
                        <SelectItem value="Lancé">Lancé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Project Owner seeking roles */}
          {profileType === 'project-owner' && (
            <FormField
              control={form.control}
              name="seekingRoles"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Rôles recherchés</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {roleOptions.map((role) => (
                      <FormField
                        key={role}
                        control={form.control}
                        name="seekingRoles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role}
                              className="flex flex-row items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), role])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role
                                          )
                                        )
                                  }}
                                  className="border-startupia-turquoise/50 data-[state=checked]:bg-startupia-turquoise"
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {role}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Pitch */}
          <FormField
            control={form.control}
            name="pitch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {profileType === 'project-owner' ? 'Pitch de votre idée' : 'Pitch de votre expertise'}
                  <span className="text-xs text-white/50 ml-2">(max 300 caractères)</span>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={
                      profileType === 'project-owner'
                        ? "Décrivez brièvement votre idée de startup..."
                        : "Décrivez vos compétences et ce que vous pouvez apporter..."
                    }
                    className="bg-black/20 border-startupia-turquoise/30 resize-none"
                    {...field}
                    maxLength={300}
                  />
                </FormControl>
                <div className="text-right text-xs text-white/50 mt-1">
                  {field.value.length}/300
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Main dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secteur cible</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                        <SelectValue placeholder="Sélectionner un secteur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectorOptions.map((sector) => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectif principal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                        <SelectValue placeholder="Sélectionner un objectif" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {objectiveOptions.map((objective) => (
                        <SelectItem key={objective} value={objective}>{objective}</SelectItem>
                      ))}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                        <SelectValue placeholder="Sélectionner votre disponibilité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Région / Télétravail</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                        <SelectValue placeholder="Sélectionner votre région" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regionOptions.map((region) => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* AI Tools */}
          <FormField
            control={form.control}
            name="aiTools"
            render={() => (
              <FormItem>
                <div className="mb-2">
                  <FormLabel>Outils IA maîtrisés</FormLabel>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {aiToolOptions.map((tool) => (
                    <FormField
                      key={tool}
                      control={form.control}
                      name="aiTools"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={tool}
                            className="flex flex-row items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(tool)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), tool])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== tool
                                        )
                                      )
                                }}
                                className="border-startupia-turquoise/50 data-[state=checked]:bg-startupia-turquoise"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {tool}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vision */}
          <FormField
            control={form.control}
            name="vision"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {profileType === 'project-owner' ? 'Vision du projet' : 'Vision professionnelle'}
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={
                      profileType === 'project-owner'
                        ? "Décrivez votre vision à long terme pour ce projet..."
                        : "Partagez votre vision professionnelle et vos objectifs..."
                    }
                    className="bg-black/20 border-startupia-turquoise/30 min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Social links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn (optionnel)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://linkedin.com/in/..." 
                      {...field} 
                      className="bg-black/20 border-startupia-turquoise/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio (optionnel)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://..." 
                      {...field} 
                      className="bg-black/20 border-startupia-turquoise/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web (optionnel)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://..." 
                      {...field} 
                      className="bg-black/20 border-startupia-turquoise/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black button-glow"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? 'Mise à jour en cours...' : 'Création en cours...'}
                </>
              ) : (
                isEditing ? 'Mettre à jour mon profil' : 'Créer mon profil'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CoFounderProfile;

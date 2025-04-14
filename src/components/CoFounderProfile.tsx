
import React, { useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createCofounderProfile } from '@/services/cofounderService';

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
}

const CoFounderProfile = ({ onProfileCreated }: CoFounderProfileProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    if (!user) {
      toast.error("Vous devez être connecté pour créer un profil");
      navigate('/auth');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the profile in the database
      await createCofounderProfile({
        name: values.name,
        profileType: values.profileType,
        role: values.role as any,
        seekingRoles: values.seekingRoles as any[] || [],
        pitch: values.pitch,
        sector: values.sector as any,
        objective: values.objective as any,
        aiTools: values.aiTools as any[],
        availability: values.availability as any,
        vision: values.vision,
        region: values.region as any,
        linkedinUrl: values.linkedinUrl || undefined,
        portfolioUrl: values.portfolioUrl || undefined,
        websiteUrl: values.websiteUrl || undefined,
        photoUrl: user?.email ? `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=random` : undefined,
        hasAIBadge: values.aiTools.length > 3,
        projectName: values.profileType === 'project-owner' ? values.projectName : undefined,
        projectStage: values.profileType === 'project-owner' ? values.projectStage : undefined,
      });
      
      toast.success("Votre profil a été créé avec succès !", {
        description: "Vous pouvez maintenant rechercher ou être trouvé par d'autres cofondateurs"
      });
      
      // Call the onProfileCreated callback if provided or navigate to profile page
      if (onProfileCreated) {
        onProfileCreated();
      } else {
        navigate('/profile?tab=cofounder');
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Erreur lors de la création du profil", {
        description: error instanceof Error ? error.message : "Une erreur s'est produite"
      });
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
      <h2 className="font-semibold text-xl mb-6">Créer votre profil Co-Founder</h2>
      
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
                      <SelectItem value="Founder">Founder</SelectItem>
                      <SelectItem value="CTO">CTO</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="ML Engineer">ML Engineer</SelectItem>
                      <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                      <SelectItem value="Designer">Designer</SelectItem>
                      <SelectItem value="Prompt Engineer">Prompt Engineer</SelectItem>
                      <SelectItem value="Business Developer">Business Developer</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Product Manager">Product Manager</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
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
                    {["Founder", "CTO", "Developer", "ML Engineer", "Data Scientist", "Designer", "Prompt Engineer", "Business Developer", "Marketing", "Product Manager", "Other"].map((role) => (
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
                      <SelectItem value="Santé">Santé</SelectItem>
                      <SelectItem value="RH">RH</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Légal">Légal</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Immobilier">Immobilier</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Energie">Energie</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
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
                      <SelectItem value="Créer une startup">Créer une startup</SelectItem>
                      <SelectItem value="Rejoindre un projet">Rejoindre un projet</SelectItem>
                      <SelectItem value="Réseauter">Réseauter</SelectItem>
                      <SelectItem value="Explorer des idées">Explorer des idées</SelectItem>
                      <SelectItem value="Trouver un associé">Trouver un associé</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
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
                      <SelectItem value="Temps plein">Temps plein</SelectItem>
                      <SelectItem value="Mi-temps">Mi-temps</SelectItem>
                      <SelectItem value="Soirs et weekends">Soirs et weekends</SelectItem>
                      <SelectItem value="Quelques heures par semaine">Quelques heures par semaine</SelectItem>
                      <SelectItem value="À définir">À définir</SelectItem>
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
                      <SelectItem value="Paris">Paris</SelectItem>
                      <SelectItem value="Lyon">Lyon</SelectItem>
                      <SelectItem value="Marseille">Marseille</SelectItem>
                      <SelectItem value="Bordeaux">Bordeaux</SelectItem>
                      <SelectItem value="Lille">Lille</SelectItem>
                      <SelectItem value="Toulouse">Toulouse</SelectItem>
                      <SelectItem value="Nantes">Nantes</SelectItem>
                      <SelectItem value="Strasbourg">Strasbourg</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
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
                  {["Python", "TensorFlow", "PyTorch", "ChatGPT", "Claude", "Midjourney", "LangChain", "Stable Diffusion", "Hugging Face", "No-code tools", "Autre"].map((tool) => (
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
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                  Création en cours...
                </>
              ) : (
                'Créer mon profil'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CoFounderProfile;

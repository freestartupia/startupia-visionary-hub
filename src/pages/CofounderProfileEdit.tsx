import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCofounderProfile, updateCofounderProfile, createCofounderProfile, deleteCofounderProfile } from '@/services/cofounderService';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { CofounderProfile, ProfileType, Role, Sector, Objective, Availability, Region, AITool, ProjectStage } from '@/types/cofounders';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AvatarUpload from '@/components/AvatarUpload';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  profileType: z.enum(['collaborator', 'project-owner']),
  role: z.string().min(1, "Le rôle est requis"),
  seekingRoles: z.array(z.string()).optional().default([]),
  pitch: z.string().min(10, "Le pitch doit comporter au moins 10 caractères"),
  sector: z.string().min(1, "Le secteur est requis"),
  objective: z.string().min(1, "L'objectif est requis"),
  aiTools: z.array(z.string()).optional().default([]),
  availability: z.string().min(1, "La disponibilité est requise"),
  vision: z.string().min(10, "La vision doit comporter au moins 10 caractères"),
  region: z.string().min(1, "La région est requise"),
  photoUrl: z.string().optional().default(""),
  portfolioUrl: z.string().optional().default(""),
  linkedinUrl: z.string().optional().default(""),
  websiteUrl: z.string().optional().default(""),
  projectName: z.string().optional().default(""),
  projectStage: z.string().optional().default(""),
  hasAIBadge: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const CofounderProfileEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isNewProfile = !id;
  const queryClient = useQueryClient();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['cofounderProfile', id],
    queryFn: () => getCofounderProfile(id as string),
    enabled: !isNewProfile && !!id,
    staleTime: 60 * 1000,
  });
  
  const saveMutation = useMutation({
    mutationFn: (data: Partial<CofounderProfile>) => 
      isNewProfile ? createCofounderProfile(data) : updateCofounderProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cofounderProfile'] });
      queryClient.invalidateQueries({ queryKey: ['myCofounderProfiles'] });
      toast({
        title: isNewProfile ? "Profil créé" : "Profil mis à jour",
        description: isNewProfile 
          ? "Votre profil a été créé avec succès." 
          : "Votre profil a été mis à jour avec succès.",
      });
      navigate('/profile?tab=cofounder');
    },
    onError: (error) => {
      console.error(`Erreur lors de ${isNewProfile ? 'la création' : 'la mise à jour'} du profil:`, error);
      toast({
        title: "Erreur",
        description: `Impossible ${isNewProfile ? "de créer" : "de mettre à jour"} le profil: ${error}`,
        variant: "destructive",
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteCofounderProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCofounderProfiles'] });
      toast({
        title: "Profil supprimé",
        description: "Le profil a été supprimé avec succès.",
      });
      navigate('/profile?tab=cofounder');
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le profil",
        variant: "destructive",
      });
      setShowDeleteConfirm(false);
    }
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      profileType: 'collaborator' as ProfileType,
      role: '',
      seekingRoles: [],
      pitch: '',
      sector: '',
      objective: '',
      aiTools: [],
      availability: '',
      vision: '',
      region: '',
      photoUrl: '',
      portfolioUrl: '',
      linkedinUrl: '',
      websiteUrl: '',
      projectName: '',
      projectStage: '',
      hasAIBadge: false
    }
  });

  React.useEffect(() => {
    if (profile && !isNewProfile) {
      form.reset({
        id: profile.id,
        name: profile.name,
        profileType: profile.profileType as ProfileType,
        role: profile.role,
        seekingRoles: profile.seekingRoles,
        pitch: profile.pitch,
        sector: profile.sector,
        objective: profile.objective,
        availability: profile.availability,
        region: profile.region,
        photoUrl: profile.photoUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        websiteUrl: profile.websiteUrl || '',
        projectName: profile.projectName || '',
        projectStage: profile.projectStage || '',
        hasAIBadge: profile.hasAIBadge || false
      });
    }
  }, [profile, form, isNewProfile]);

  const onSubmit = (data: FormValues) => {
    const profileData: Partial<CofounderProfile> = {
      ...data,
      id: isNewProfile ? undefined : id,
      role: data.role as Role,
      sector: data.sector as Sector,
      objective: data.objective as Objective,
      availability: data.availability as Availability,
      region: data.region as Region,
      seekingRoles: data.seekingRoles as Role[],
      aiTools: data.aiTools as AITool[],
      projectStage: data.projectStage as ProjectStage | undefined,
      photoUrl: avatarUrl || data.photoUrl
    };

    saveMutation.mutate(profileData);
  };

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

  const profileType = form.watch('profileType');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-hero-pattern text-white">
        <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile?tab=cofounder')}
            className="mb-6"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour au profil
          </Button>

          <div className="glass-card p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">
                {isNewProfile ? "Créer un profil cofondateur" : "Modifier votre profil cofondateur"}
              </h1>
              
              {!isNewProfile && (
                <Button 
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Trash2 size={16} className="mr-2" />
                  )}
                  Supprimer
                </Button>
              )}
            </div>

            {user && (
              <div className="mb-6 flex justify-center">
                <AvatarUpload 
                  userId={user.id}
                  existingImageUrl={profile?.photoUrl || null}
                  onImageUploaded={(url) => setAvatarUrl(url)}
                />
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="profileType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Type de profil</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom / Pseudo</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} className="bg-black/20 border-white/20" />
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/20">
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

                {profileType === 'project-owner' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du projet</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom de votre projet ou startup" {...field} className="bg-black/20 border-white/20" />
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/20 border-white/20">
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

                <FormField
                  control={form.control}
                  name="pitch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pitch</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez brièvement votre projet ou vos compétences..." 
                          {...field} 
                          className="bg-black/20 border-white/20 min-h-[100px]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vision</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Partagez votre vision à long terme..." 
                          {...field} 
                          className="bg-black/20 border-white/20 min-h-[100px]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secteur cible</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/20">
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/20">
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/20">
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/20 border-white/20">
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
                            className="bg-black/20 border-white/20" 
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
                            className="bg-black/20 border-white/20" 
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
                            className="bg-black/20 border-white/20" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black"
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                  )}
                  <Save size={16} className="mr-2" />
                  {isNewProfile ? "Créer le profil" : "Enregistrer les modifications"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce profil?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce profil seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
};

export default CofounderProfileEdit;

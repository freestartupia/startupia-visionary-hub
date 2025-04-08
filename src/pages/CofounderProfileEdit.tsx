import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCofounderProfile, updateCofounderProfile, createCofounderProfile } from '@/services/cofounderService';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CofounderProfile, ProfileType, Role, Sector, Objective, Availability, Region } from '@/types/cofounders';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (isNewProfile) {
        setLoading(false);
        return;
      }

      try {
        const fetchedProfile = await getCofounderProfile(id as string);
        if (fetchedProfile) {
          form.reset({
            ...fetchedProfile,
            profileType: fetchedProfile.profileType as ProfileType,
            role: fetchedProfile.role as string,
            sector: fetchedProfile.sector as string,
            objective: fetchedProfile.objective as string,
            availability: fetchedProfile.availability as string,
            region: fetchedProfile.region as string,
            hasAIBadge: fetchedProfile.hasAIBadge || false
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil",
          variant: "destructive",
        });
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isNewProfile, navigate, toast, form]);

  const onSubmit = async (data: FormValues) => {
    setSaving(true);

    try {
      const profileData: Partial<CofounderProfile> = {
        ...data,
        role: data.role as Role,
        sector: data.sector as Sector,
        objective: data.objective as Objective,
        availability: data.availability as Availability,
        region: data.region as Region
      };

      if (isNewProfile) {
        await createCofounderProfile(profileData);
        toast({
          title: "Profil créé",
          description: "Votre profil a été créé avec succès.",
        });
      } else {
        await updateCofounderProfile(profileData);
        toast({
          title: "Profil mis à jour",
          description: "Votre profil a été mis à jour avec succès.",
        });
      }
      navigate('/profile?tab=cofounder');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du profil:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer le profil: ${error}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce profil? Cette action est irréversible.")) {
      return;
    }
    
    setDeleting(true);
    try {
      await fetch(`/api/cofounder/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      toast({
        title: "Profil supprimé",
        description: "Votre profil a été supprimé avec succès.",
      });
      navigate('/profile?tab=cofounder');
    } catch (error) {
      console.error('Erreur lors de la suppression du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le profil",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

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
                  onClick={() => {
                    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce profil? Cette action est irréversible.")) {
                      setDeleting(true);
                      fetch(`/api/cofounder/${id}`, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      })
                        .then(() => {
                          toast({
                            title: "Profil supprimé",
                            description: "Votre profil a été supprimé avec succès.",
                          });
                          navigate('/profile?tab=cofounder');
                        })
                        .catch((error) => {
                          console.error('Erreur lors de la suppression du profil:', error);
                          toast({
                            title: "Erreur",
                            description: "Impossible de supprimer le profil",
                            variant: "destructive",
                          });
                        })
                        .finally(() => {
                          setDeleting(false);
                        });
                    }
                  }}
                  disabled={deleting}
                >
                  {deleting && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>}
                  <Trash2 size={16} className="mr-2" />
                  Supprimer ce profil
                </Button>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div className="space-y-6">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/username" {...field} className="bg-black/20 border-white/20" />
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
                          <FormLabel>Site web URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://monsite.com" {...field} className="bg-black/20 border-white/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="portfolioUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio/Github URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/username" {...field} className="bg-black/20 border-white/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Région</FormLabel>
                          <FormControl>
                            <Input placeholder="Paris, Lyon, Remote..." {...field} className="bg-black/20 border-white/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="hasAIBadge"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Badge IA</FormLabel>
                        <FormDescription className="text-white/60">
                          Activez cette option si vous avez une expertise en Intelligence Artificielle
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black"
                  disabled={saving}
                >
                  {saving && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>}
                  <Save size={16} className="mr-2" />
                  {isNewProfile ? "Créer le profil" : "Enregistrer les modifications"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CofounderProfileEdit;

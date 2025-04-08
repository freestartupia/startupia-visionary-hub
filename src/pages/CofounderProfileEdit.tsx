
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCofounderProfile, updateCofounderProfile, createCofounderProfile } from '@/services/cofounderService';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { CofounderProfile, ProfileType, Role, Sector, Objective, Availability, Region } from '@/types/cofounders';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ProfileBasicInfo from '@/components/profile/cofounder/ProfileBasicInfo';
import ProfileDetails from '@/components/profile/cofounder/ProfileDetails';
import ProfileLinks from '@/components/profile/cofounder/ProfileLinks';
import DeleteProfileButton from '@/components/profile/cofounder/DeleteProfileButton';

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
            role: fetchedProfile.role,
            sector: fetchedProfile.sector,
            objective: fetchedProfile.objective,
            availability: fetchedProfile.availability,
            region: fetchedProfile.region,
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
        region: data.region as Region,
        seekingRoles: data.seekingRoles as Role[] // Cast seekingRoles to Role[] type
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
              
              {!isNewProfile && <DeleteProfileButton id={id as string} onSuccess={() => navigate('/profile?tab=cofounder')} />}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileBasicInfo form={form} />
                  <ProfileDetails form={form} />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="pitch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pitch</FormLabel>
                        <FormControl>
                          <textarea 
                            placeholder="Décrivez brièvement votre projet ou vos compétences..." 
                            {...field} 
                            className="bg-black/20 border-white/20 min-h-[100px] w-full rounded-md border px-3 py-2" 
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
                          <textarea 
                            placeholder="Partagez votre vision à long terme..." 
                            {...field} 
                            className="bg-black/20 border-white/20 min-h-[100px] w-full rounded-md border px-3 py-2" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <ProfileLinks form={form} />
                
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

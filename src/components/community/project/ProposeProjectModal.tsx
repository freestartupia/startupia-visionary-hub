
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CollaborativeProject, ProjectStatus } from '@/types/community';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { Badge } from '@/components/ui/badge';

interface ProposeProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: CollaborativeProject) => void;
  statuses: (ProjectStatus | 'all')[];
}

type ProjectFormData = {
  title: string;
  description: string;
  status: ProjectStatus;
  category: string;
  skills: string;
};

const ProposeProjectModal: React.FC<ProposeProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  statuses 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      description: '',
      status: 'Idée',
      category: 'IA générative',
      skills: '',
    }
  });

  const handleSubmit = async (data: ProjectFormData) => {
    if (!user) {
      toast.error("Vous devez être connecté pour proposer un projet");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format skills as array
      const skillsArray = data.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill !== '');
      
      // Get user profile info for the project initiator
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      const initiatorName = profileData ? 
        `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() : 
        'Utilisateur anonyme';
      
      const newProject: CollaborativeProject = {
        id: uuidv4(),
        title: data.title,
        description: data.description,
        status: data.status,
        category: data.category,
        skills: skillsArray,
        initiator_id: user.id,
        initiator_name: initiatorName,
        initiator_avatar: profileData?.avatar_url || null,
        created_at: new Date().toISOString(),
        likes: 0,
        applications: 0
      };
      
      const { error } = await supabase
        .from('collaborative_projects')
        .insert(newProject);
      
      if (error) throw error;
      
      toast.success("Votre projet a été proposé avec succès!");
      onSuccess(newProject);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error("Une erreur est survenue lors de la soumission du projet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = [
    'IA générative',
    'Automatisation',
    'Traitement du langage',
    'Analyse de données',
    'Vision par ordinateur',
    'Chatbot',
    'Education',
    'Finance',
    'Santé',
    'Autre'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glass-card border border-white/20 bg-black/90">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Proposer un projet</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Le titre est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du projet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Assistant IA pour rédaction d'articles" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "La description est requise" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre projet, ses objectifs et sa vision..." 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                rules={{ required: "Le statut est requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut du projet</FormLabel>
                    <FormControl>
                      <select 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                        {...field}
                      >
                        {statuses.filter(s => s !== 'all').map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                rules={{ required: "La catégorie est requise" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <FormControl>
                      <select 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                        {...field}
                      >
                        {availableCategories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="skills"
              rules={{ required: "Au moins une compétence est requise" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compétences recherchées</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Python, React, Prompt Engineering (séparés par des virgules)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Proposer le projet'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposeProjectModal;

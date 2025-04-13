
import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ServiceCategory, ServiceListing } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface ProposeServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (service: ServiceListing) => void;
  categories: (ServiceCategory | 'all')[];
}

type FormValues = {
  title: string;
  description: string;
  category: ServiceCategory;
  expertise: string;
  price: string;
  contactLink?: string;
  linkedinUrl?: string;
};

const ProposeServiceModal: React.FC<ProposeServiceModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess,
  categories 
}) => {
  const { user } = useAuth();
  const filteredCategories = categories.filter(cat => cat !== 'all') as ServiceCategory[];
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: 'Autre',
      expertise: '',
      price: '',
      contactLink: '',
      linkedinUrl: ''
    }
  });

  const onSubmit = (data: FormValues) => {
    if (!user) {
      toast.error("Vous devez être connecté pour proposer un service");
      return;
    }

    // Convert comma-separated expertise to array
    const expertiseArray = data.expertise
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');

    // Create new service object
    const newService: ServiceListing = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      category: data.category,
      expertise: expertiseArray,
      price: data.price,
      providerId: user.id,
      providerName: user.user_metadata?.full_name || 'Utilisateur',
      providerAvatar: user.user_metadata?.avatar_url,
      contactLink: data.contactLink,
      linkedinUrl: data.linkedinUrl,
      createdAt: new Date().toISOString()
    };

    // In a real application, we would submit to Supabase here
    // For now, we'll pass the service to the parent component
    onSuccess(newService);
    
    // Close the modal and reset the form
    toast.success("Service proposé avec succès!");
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-black border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            Proposer un service
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "Le titre est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du service</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Développement d'agents IA personnalisés" {...field} />
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
                      placeholder="Décrivez votre service en détail" 
                      className="min-h-[100px]"
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
                        {filteredCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                rules={{ required: "Le tarif est requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarif</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: À partir de 500€ / jour ou Sur devis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expertise"
              rules={{ required: "Les compétences sont requises" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compétences (séparées par des virgules)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: ChatGPT, Midjourney, Python, Prompt Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien de contact (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: https://calendly.com/votre-nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: https://linkedin.com/in/votre-nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                Annuler
              </Button>
              <Button type="submit">
                Proposer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposeServiceModal;

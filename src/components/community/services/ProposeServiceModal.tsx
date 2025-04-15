
import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Mail, Instagram, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceCategory, ServiceListing } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { addService } from '@/services/serviceListingService';
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
  contactMethod: 'calendly' | 'email' | 'instagram' | 'linkedin' | 'other';
  contactLink: string;
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
      contactMethod: 'calendly',
      contactLink: '',
      linkedinUrl: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
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

    try {
      // Send to Supabase
      const result = await addService(newService);
      
      if (result) {
        toast.success("Service proposé avec succès!");
        onSuccess(result);
        form.reset();
        onClose();
      } else {
        toast.error("Erreur lors de la proposition du service");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Erreur lors de la proposition du service");
    }
  };

  const selectedContactMethod = form.watch('contactMethod');

  const getContactPlaceholder = () => {
    switch (selectedContactMethod) {
      case 'calendly':
        return "Ex: https://calendly.com/votre-nom";
      case 'email':
        return "Ex: votre-email@gmail.com";
      case 'instagram':
        return "Ex: https://instagram.com/votre-compte ou @votre-compte";
      case 'linkedin':
        return "Ex: https://linkedin.com/in/votre-nom";
      case 'other':
        return "Entrez votre lien de contact préféré";
      default:
        return "Entrez votre lien de contact";
    }
  };

  const getContactIcon = () => {
    switch (selectedContactMethod) {
      case 'calendly':
        return <Calendar className="h-4 w-4 mr-2" />;
      case 'email':
        return <Mail className="h-4 w-4 mr-2" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 mr-2" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 mr-2" />;
      default:
        return <Calendar className="h-4 w-4 mr-2" />;
    }
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

            <FormField
              control={form.control}
              name="contactMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment souhaitez-vous être contacté ?</FormLabel>
                  <FormControl>
                    <Tabs 
                      defaultValue={field.value} 
                      onValueChange={field.onChange as (value: string) => void}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-5 w-full">
                        <TabsTrigger value="calendly">Calendly</TabsTrigger>
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="instagram">Instagram</TabsTrigger>
                        <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                        <TabsTrigger value="other">Autre</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactLink"
              rules={{ 
                required: "Le lien de contact est requis",
                validate: {
                  validEmail: v => selectedContactMethod !== 'email' || /\S+@\S+\.\S+/.test(v) || "Veuillez entrer une adresse email valide",
                  validUrl: v => selectedContactMethod === 'email' || v.startsWith('http') || "Veuillez entrer une URL valide commençant par http:// ou https://"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien de contact</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      {getContactIcon()}
                      <Input 
                        placeholder={getContactPlaceholder()} 
                        {...field} 
                        value={selectedContactMethod === 'email' && field.value.startsWith('mailto:') 
                          ? field.value.replace('mailto:', '') 
                          : field.value}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (selectedContactMethod === 'email' && !value.startsWith('mailto:') && value.includes('@')) {
                            // Don't add mailto: in the input field to avoid confusion
                            field.onChange(value);
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {selectedContactMethod === 'email' 
                      ? "Entrez votre adresse email" 
                      : selectedContactMethod === 'calendly' 
                        ? "Entrez votre lien Calendly pour permettre aux utilisateurs de réserver un rendez-vous"
                        : selectedContactMethod === 'instagram'
                          ? "Entrez votre profil Instagram ou @username"
                          : "Entrez le lien où vous souhaitez être contacté"}
                  </FormDescription>
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

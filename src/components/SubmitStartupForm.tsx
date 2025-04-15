import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { createStartup } from '@/services/startupService';

// Schéma de validation
const startupFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit comporter au moins 2 caractères' }),
  shortDescription: z.string().min(10, { message: 'La description doit comporter au moins 10 caractères' }).max(200, { message: 'La description ne doit pas dépasser 200 caractères' }),
  websiteUrl: z.string().url({ message: 'Veuillez entrer une URL valide' }),
  category: z.string().min(1, { message: 'Veuillez sélectionner une catégorie' }),
  aiTechnology: z.string().optional(),
  launchDate: z.string().optional(),
});

type StartupFormValues = z.infer<typeof startupFormSchema>;

interface SubmitStartupFormProps {
  onSuccess?: () => void;
}

const SubmitStartupForm: React.FC<SubmitStartupFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      websiteUrl: '',
      category: '',
      aiTechnology: '',
      launchDate: '',
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: StartupFormValues) => {
    setIsSubmitting(true);
    try {
      await createStartup({
        ...values,
        logoFile: logoFile || undefined,
      });

      toast({
        title: "Startup ajoutée",
        description: "Votre startup a été ajoutée avec succès !",
      });

      form.reset();
      setLogoFile(null);
      setLogoPreview(null);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la startup",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "IA Générale", "IA Santé", "IA Finance", "IA RH", 
    "IA Education", "IA Marketing", "IA Légal", 
    "IA Logistique", "Autre"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="flex flex-col items-center">
              <div 
                className="h-40 w-40 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center mb-4 overflow-hidden hover:border-startupia-turquoise/40 transition-colors cursor-pointer"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center p-4 text-center">
                    <Upload className="h-10 w-10 text-white/40 mb-2" />
                    <p className="text-sm text-white/60">Cliquez pour ajouter un logo</p>
                  </div>
                )}
              </div>
              <input 
                id="logo-upload"
                type="file" 
                accept="image/*" 
                onChange={handleLogoChange} 
                className="hidden"
              />
              <p className="text-xs text-white/60 text-center">Format recommandé : 512x512px, JPG ou PNG</p>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la startup *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: IA Santé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description courte *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="En quelques mots, que fait votre startup ?"
                      className="resize-none" 
                      {...field} 
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
                  <FormLabel>Site web *</FormLabel>
                  <FormControl>
                    <Input placeholder="https://votrestartup.fr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie *</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    {...field}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
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
            name="aiTechnology"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technologie IA (optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: NLP, Computer Vision, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="launchDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de lancement (optionnel)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-startupia-turquoise hover:bg-startupia-turquoise/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : 'Soumettre ma startup'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubmitStartupForm;

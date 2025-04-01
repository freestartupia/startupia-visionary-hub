import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from '@/components/ui/separator';
import { productService } from '@/services/productService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ProductLaunch } from '@/types/productLaunch';
import { mockProductLaunches } from '@/data/mockProductLaunches';
import { ArrowLeft, Upload, Calendar } from 'lucide-react';
import SEO from '@/components/SEO';

const ProductForm = () => {
  const { id } = useParams();
  const isEditing = id !== 'new' && id !== undefined;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const ProductSchema = z.object({
    name: z.string().min(2, {
      message: "Le nom du produit doit comporter au moins 2 caractères.",
    }),
    description: z.string().min(10, {
      message: "La description doit comporter au moins 10 caractères.",
    }),
    websiteUrl: z.string().url({
      message: "L'URL du site web doit être une URL valide.",
    }),
    category: z.string().min(1, {
      message: "Veuillez sélectionner une catégorie.",
    }),
    status: z.enum(['upcoming', 'launching_today', 'launched']).default('upcoming'),
    launchDate: z.date(),
  });

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      description: '',
      websiteUrl: '',
      category: '',
      status: 'upcoming',
      launchDate: new Date(),
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      const productToEdit = mockProductLaunches.find(product => product.id === id);
      if (productToEdit) {
        form.reset({
          name: productToEdit.name,
          description: productToEdit.description,
          websiteUrl: productToEdit.websiteUrl,
          category: productToEdit.category[0] || '',
          status: productToEdit.status,
          launchDate: new Date(productToEdit.launchDate),
        });
        setImagePreview(productToEdit.imageUrl);
      } else {
        toast({
          title: "Erreur",
          description: "Produit non trouvé.",
        });
        navigate('/products');
      }
    }
  }, [isEditing, id, navigate, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: z.infer<typeof ProductSchema>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Produit ${isEditing ? 'modifié' : 'ajouté'} avec succès !`);
      navigate('/products');
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement du produit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-pattern text-white pb-8">
      <SEO 
        title={isEditing ? "Modifier un produit – StartupIA.fr" : "Ajouter un produit – StartupIA.fr"}
        description="Ajoutez ou modifiez votre produit ou outil IA sur StartupIA.fr pour le présenter à la communauté des innovateurs de l'intelligence artificielle en France."
        noindex={true}
      />
      
      <div className="container mx-auto px-4 pt-24 relative z-10">
        <Button variant="ghost" onClick={() => navigate('/products')} className="mb-4">
          <ArrowLeft className="mr-2" size={16} />
          Retour à la liste
        </Button>
        
        <Card className="bg-black/70 backdrop-blur-md border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
            </CardTitle>
            <CardDescription>
              {isEditing ? 'Modifiez les informations de votre produit.' : 'Ajoutez un nouveau produit à la liste.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du produit</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de votre produit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description de votre produit"
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
                      <FormLabel>URL du site web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://votreproduit.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IA Générative">IA Générative</SelectItem>
                          <SelectItem value="Outils No-Code">Outils No-Code</SelectItem>
                          <SelectItem value="Analyse de données">Analyse de données</SelectItem>
                          <SelectItem value="Automatisation">Automatisation</SelectItem>
                          <SelectItem value="Marketing IA">Marketing IA</SelectItem>
                          <SelectItem value="Autres">Autres</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status du lancement</FormLabel>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="upcoming" id="upcoming" />
                          </FormControl>
                          <FormLabel htmlFor="upcoming">À venir</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="launching_today" id="launching_today" />
                          </FormControl>
                          <FormLabel htmlFor="launching_today">Lancement aujourd'hui</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="launched" id="launched" />
                          </FormControl>
                          <FormLabel htmlFor="launched">Lancé</FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="launchDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de lancement</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image du produit</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button variant="outline" asChild>
                    <Label htmlFor="image" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Télécharger une image
                    </Label>
                  </Button>
                  {imagePreview && (
                    <div className="relative w-32 h-32 rounded-md overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Aperçu de l'image"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductForm;

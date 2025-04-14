
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { ProductLaunch } from '@/types/productLaunch';
import { createProduct } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

const ProductForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 7));
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>(['']);

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    tagline: '',
    description: '',
    createdBy: '',
    creatorAvatarUrl: '',
    websiteUrl: '',
    demoUrl: '',
    betaSignupUrl: '',
    status: 'upcoming' as const
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddMediaUrl = () => {
    setMediaUrls(prev => [...prev, '']);
  };

  const handleMediaUrlChange = (index: number, value: string) => {
    setMediaUrls(prev => prev.map((url, i) => (i === index ? value : url)));
  };

  const handleRemoveMediaUrl = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.tagline || !formData.description || !formData.websiteUrl || !formData.createdBy || !date || categories.length === 0) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const productData: Omit<ProductLaunch, 'id' | 'upvotes' | 'comments'> = {
        name: formData.name,
        logoUrl: formData.logoUrl,
        tagline: formData.tagline,
        description: formData.description,
        launchDate: date.toISOString(),
        createdBy: formData.createdBy,
        creatorAvatarUrl: formData.creatorAvatarUrl || undefined,
        websiteUrl: formData.websiteUrl,
        demoUrl: formData.demoUrl || undefined,
        category: categories,
        status: formData.status,
        startupId: undefined, // À relier plus tard à un compte utilisateur
        mediaUrls: mediaUrls.filter(url => url.trim() !== ''),
        betaSignupUrl: formData.betaSignupUrl || undefined,
        featuredOrder: undefined,
        badgeCode: undefined
      };
      
      const result = await createProduct(productData);
      
      if (result) {
        toast({
          title: "Produit créé avec succès",
          description: "Votre produit a été enregistré et sera bientôt visible."
        });
        navigate(`/product/${result.id}`);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer le produit. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du produit.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-gold/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <Navbar />
      
      <main className="relative container mx-auto pt-24 pb-16 px-4 z-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Lancer votre produit</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Partagez votre innovation avec la communauté Startupia et obtenez de la visibilité, des retours et vos premiers utilisateurs.
          </p>
        </div>
        
        <Card className="glass-card border border-startupia-turquoise/20 bg-black/30 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Formulaire de lancement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="Le nom de votre produit"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tagline">Slogan *</Label>
                  <Input 
                    id="tagline"
                    name="tagline"
                    placeholder="Une phrase accrocheuse décrivant votre produit"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                  />
                </div>
                
                <div>
                  <Label htmlFor="logoUrl">URL du logo</Label>
                  <Input 
                    id="logoUrl"
                    name="logoUrl"
                    placeholder="https://exemple.com/votre-logo.png"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    placeholder="Décrivez votre produit en détail"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                    rows={5}
                  />
                </div>
                
                <div>
                  <Label>Date de lancement *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-black/30 border-startupia-turquoise/30",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Choisir une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="createdBy">Créé par *</Label>
                  <Input 
                    id="createdBy"
                    name="createdBy"
                    placeholder="Votre nom ou celui de l'équipe"
                    value={formData.createdBy}
                    onChange={handleInputChange}
                    className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                  />
                </div>
                
                <div>
                  <Label htmlFor="creatorAvatarUrl">URL de votre avatar</Label>
                  <Input 
                    id="creatorAvatarUrl"
                    name="creatorAvatarUrl"
                    placeholder="https://exemple.com/votre-avatar.png"
                    value={formData.creatorAvatarUrl}
                    onChange={handleInputChange}
                    className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                  />
                </div>
                
                <div>
                  <Label htmlFor="websiteUrl">URL du site web *</Label>
                  <Input 
                    id="websiteUrl"
                    name="websiteUrl"
                    placeholder="https://votre-produit.com"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                  />
                </div>
                
                <div>
                  <Label htmlFor="demoUrl">URL de la démo (optionnel)</Label>
                  <Input 
                    id="demoUrl"
                    name="demoUrl"
                    placeholder="https://demo.votre-produit.com"
                    value={formData.demoUrl}
                    onChange={handleInputChange}
                    className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                  />
                </div>
                
                <div>
                  <Label htmlFor="betaSignupUrl">URL d'inscription à la bêta (optionnel)</Label>
                  <Input 
                    id="betaSignupUrl"
                    name="betaSignupUrl"
                    placeholder="https://votre-produit.com/beta"
                    value={formData.betaSignupUrl}
                    onChange={handleInputChange}
                    className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Statut *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise">
                      <SelectValue placeholder="Choisir un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">À venir</SelectItem>
                      <SelectItem value="launching_today">Lancement aujourd'hui</SelectItem>
                      <SelectItem value="launched">Déjà lancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="mb-2 block">Catégories *</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {categories.map((category, index) => (
                      <div 
                        key={index} 
                        className="bg-startupia-turquoise/20 text-startupia-turquoise px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <span>{category}</span>
                        <X 
                          size={14} 
                          className="cursor-pointer" 
                          onClick={() => handleRemoveCategory(index)} 
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Ajouter une catégorie"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddCategory}
                      variant="outline" 
                      className="border-startupia-turquoise text-startupia-turquoise"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Images du produit</Label>
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input 
                        placeholder="URL de l'image"
                        value={url}
                        onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                        className="bg-black/30 border-startupia-turquoise/30 focus:border-startupia-turquoise"
                      />
                      {mediaUrls.length > 1 && (
                        <Button 
                          type="button" 
                          onClick={() => handleRemoveMediaUrl(index)}
                          variant="outline" 
                          className="border-red-500 text-red-500"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    onClick={handleAddMediaUrl}
                    variant="outline" 
                    className="border-startupia-turquoise text-startupia-turquoise"
                  >
                    <Plus size={16} className="mr-2" />
                    Ajouter une image
                  </Button>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-startupia-gold hover:bg-startupia-light-gold text-black font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Création en cours...' : 'Lancer mon produit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ProductForm;

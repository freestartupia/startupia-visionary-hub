
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { toast as sonnerToast } from 'sonner';
import { BlogCategory } from '@/types/blog';
import { submitBlogPost } from '@/services/blogService';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubmitArticleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubmitArticleModal = ({ open, onOpenChange }: SubmitArticleModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '' as BlogCategory,
    tags: ''
  });

  // Redirect to authentication page if not logged in
  const handleAuthRequired = () => {
    sonnerToast.error("Vous devez être connecté pour soumettre un article");
    onOpenChange(false);
    navigate('/auth');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing again
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Basic validation
    if (!formValues.title.trim()) {
      setErrorMessage("Le titre est requis");
      return;
    }
    if (!formValues.excerpt.trim()) {
      setErrorMessage("Le résumé est requis");
      return;
    }
    if (!formValues.content.trim()) {
      setErrorMessage("Le contenu est requis");
      return;
    }
    if (!formValues.category) {
      setErrorMessage("Veuillez sélectionner une catégorie");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      console.log("Submitting form with user:", user.id);
      
      // Create a slug from the title
      const slug = slugify(formValues.title, { lower: true, strict: true });
      
      // Split tags by comma
      const tags = formValues.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      // Prepare author name from user metadata
      const authorName = user.user_metadata?.first_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
        : user.email?.split('@')[0] || 'Anonymous';
      
      console.log("Prepared author name:", authorName);
      console.log("User avatar:", user.user_metadata?.avatar_url);
      
      // Submit the post
      await submitBlogPost({
        title: formValues.title,
        slug,
        excerpt: formValues.excerpt,
        content: `<p>${formValues.content.replace(/\n/g, '</p><p>')}</p>`,
        category: formValues.category as BlogCategory,
        authorId: user.id,
        authorName,
        authorAvatar: user.user_metadata?.avatar_url,
        tags,
        readingTime: `${Math.max(1, Math.ceil(formValues.content.length / 1000))} min`,
        featured: false // Explicitly set to false for new submissions
      });
      
      toast({
        title: "Article soumis !",
        description: "Votre article a été soumis avec succès et est en attente d'approbation par un modérateur.",
      });
      
      // Reset form and close modal
      setFormValues({
        title: '',
        excerpt: '',
        content: '',
        category: '' as BlogCategory,
        tags: ''
      });
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error submitting article:", error);
      setErrorMessage(
        error instanceof Error 
          ? `Erreur: ${error.message}` 
          : "Une erreur est survenue lors de la soumission de votre article."
      );
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission de votre article. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not authenticated, show a message and option to login
  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-black border border-startupia-turquoise/30">
          <DialogHeader>
            <DialogTitle className="text-white">Authentification requise</DialogTitle>
            <DialogDescription>
              Vous devez être connecté pour soumettre un article sur Startupia.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <p className="text-white/70 mb-4 text-center">
              Créez un compte ou connectez-vous pour partager vos connaissances avec la communauté.
            </p>
            <Button 
              onClick={handleAuthRequired}
              className="bg-startupia-turquoise text-black hover:bg-startupia-deep-turquoise"
            >
              Se connecter / S'inscrire
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black border border-startupia-turquoise/30">
        <DialogHeader>
          <DialogTitle className="text-white">Soumettre un article</DialogTitle>
          <DialogDescription>
            Partagez vos connaissances et idées avec la communauté Startupia.
          </DialogDescription>
        </DialogHeader>
        
        {errorMessage && (
          <Alert variant="destructive" className="bg-red-950 border-red-800 my-2">
            <AlertDescription className="text-white">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre de l'article</Label>
            <Input 
              id="title" 
              value={formValues.title}
              onChange={handleInputChange}
              placeholder="Titre accrocheur de votre article" 
              className="bg-black/30" 
              required
            />
          </div>
          <div>
            <Label htmlFor="excerpt">Résumé</Label>
            <Textarea 
              id="excerpt" 
              value={formValues.excerpt}
              onChange={handleInputChange}
              placeholder="Bref résumé de votre article (max 150 mots)" 
              className="bg-black/30" 
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Contenu</Label>
            <Textarea 
              id="content" 
              value={formValues.content}
              onChange={handleInputChange}
              placeholder="Contenu de votre article" 
              className="bg-black/30 min-h-[200px]" 
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <select 
              id="category" 
              value={formValues.category}
              onChange={handleInputChange}
              className="w-full rounded-md border border-input bg-black/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Actualités">Actualités</option>
              <option value="Growth">Growth</option>
              <option value="Technique">Technique</option>
              <option value="Interviews">Interviews</option>
              <option value="Outils">Outils</option>
              <option value="Levées de fonds">Levées de fonds</option>
              <option value="Startup du mois">Startup du mois</option>
            </select>
          </div>
          <div>
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input 
              id="tags" 
              value={formValues.tags}
              onChange={handleInputChange}
              placeholder="IA, StartUp, Marketing, etc." 
              className="bg-black/30" 
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-startupia-turquoise text-black hover:bg-startupia-deep-turquoise"
            >
              {isSubmitting ? 'Soumission en cours...' : 'Soumettre'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitArticleModal;

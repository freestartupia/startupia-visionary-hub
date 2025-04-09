
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

interface SubmitArticleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubmitArticleModal = ({ open, onOpenChange }: SubmitArticleModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to authentication page if not logged in
  const handleAuthRequired = () => {
    sonnerToast.error("Vous devez être connecté pour soumettre un article");
    onOpenChange(false);
    navigate('/auth');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Article soumis !",
      description: "Nous examinerons votre article et reviendrons vers vous rapidement.",
    });
    onOpenChange(false);
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" placeholder="Votre nom" className="bg-black/30" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" className="bg-black/30" />
          </div>
          <div>
            <Label htmlFor="title">Titre de l'article</Label>
            <Input id="title" placeholder="Titre accrocheur de votre article" className="bg-black/30" />
          </div>
          <div>
            <Label htmlFor="excerpt">Résumé</Label>
            <Textarea id="excerpt" placeholder="Bref résumé de votre article (max 150 mots)" className="bg-black/30" />
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <select id="category" className="w-full rounded-md border border-input bg-black/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground">
              <option value="">Sélectionner une catégorie</option>
              <option value="Actualités">Actualités</option>
              <option value="Growth">Growth</option>
              <option value="Technique">Technique</option>
              <option value="Interviews">Interviews</option>
              <option value="Outils">Outils</option>
              <option value="Levées de fonds">Levées de fonds</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-startupia-turquoise text-black hover:bg-startupia-deep-turquoise">
              Soumettre
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitArticleModal;

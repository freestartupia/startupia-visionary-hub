
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { ForumCategory } from '@/types/community';
import { createForumPost } from '@/services/forumService';
import { toast } from 'sonner';

interface CreateForumPostProps {
  onPostCreated: () => void;
}

const CreateForumPost: React.FC<CreateForumPostProps> = ({ onPostCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumCategory>('Général');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez être connecté pour créer un post');
      navigate('/auth');
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      toast.error('Tous les champs sont obligatoires');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const userName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || 'Utilisateur';
      const avatarUrl = user.user_metadata?.avatar_url;
      
      await createForumPost(
        title,
        content,
        category,
        userName,
        avatarUrl
      );
      
      // Réinitialiser le formulaire
      setTitle('');
      setContent('');
      setCategory('Général');
      setIsOpen(false);
      
      // Notifier le composant parent
      onPostCreated();
      
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: ForumCategory[] = [
    'Général',
    'Tech & Dev IA',
    'Prompt Engineering',
    'No-code & IA',
    'Startups IA',
    'Trouver un projet / recruter',
    'Formations & conseils'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90">
          <PlusCircle size={18} className="mr-2" />
          Nouvelle discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-black border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle discussion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as ForumCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de votre discussion"
              className="bg-black/30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Décrivez votre question ou sujet..."
              className="min-h-[200px] bg-black/30"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? 'Publication...' : 'Publier'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateForumPost;

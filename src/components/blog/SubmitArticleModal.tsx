
import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlogCategory } from '@/types/blog';
import { submitBlogPost } from '@/services/blogService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { generateSlug } from '@/lib/utils';

interface SubmitArticleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: BlogCategory[] = [
  'Actualités',
  'Growth',
  'Technique',
  'Interviews',
  'Outils',
  'Levées de fonds',
  'Startup du mois'
];

const SubmitArticleModal: React.FC<SubmitArticleModalProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<BlogCategory | ''>('');
  const [tags, setTags] = useState('');
  
  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('');
    setTags('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez être connecté pour soumettre un article');
      navigate('/auth');
      return;
    }
    
    if (!title || !excerpt || !content || !category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userProfile = user.user_metadata || {};
      const slug = generateSlug(title);
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      const readingTime = Math.ceil(content.split(' ').length / 200) + ' min';
      
      const result = await submitBlogPost({
        title,
        slug,
        excerpt,
        content,
        category: category as BlogCategory,
        coverImage: undefined,
        authorId: user.id,
        authorName: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Utilisateur StartupIA',
        authorAvatar: userProfile.avatar_url,
        tags: tagsArray,
        featured: false,
        readingTime
      });
      
      if (result.success) {
        toast.success('Article soumis avec succès! Il sera publié après modération.');
        resetForm();
        onOpenChange(false);
      } else {
        toast.error(result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      toast.error('Une erreur est survenue lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenChange = (newOpen: boolean) => {
    // If the modal is closing and we're not in the middle of submitting, reset the form
    if (!newOpen && !isSubmitting) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background-dark border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Proposer un article</DialogTitle>
          <DialogDescription className="text-white/70">
            Partagez votre expertise avec la communauté. Les articles sont soumis à modération avant publication.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'article *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Un titre accrocheur"
              required
              className="bg-background-light border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="excerpt">Résumé *</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Un court résumé de votre article (150 caractères max)"
              maxLength={150}
              required
              className="bg-background-light border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Le contenu détaillé de votre article"
              required
              className="min-h-[200px] bg-background-light border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as BlogCategory)}>
              <SelectTrigger className="bg-background-light border-gray-700">
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-background-light border-gray-700">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ia, startup, tech"
              className="bg-background-light border-gray-700"
            />
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-gray-700 text-white hover:bg-gray-700"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-startupia-turquoise text-black hover:bg-startupia-light-turquoise"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre l\'article'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitArticleModal;

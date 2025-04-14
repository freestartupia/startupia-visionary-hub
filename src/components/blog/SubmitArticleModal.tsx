
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
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { createStorageBucket, uploadFile, getPublicUrl } from '@/integrations/supabase/storage';

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
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('');
    setTags('');
    setCoverImage(null);
    setImagePreview(null);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.type !== 'image/webp' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
        toast.error('Format d\'image non supporté. Utilisez WebP, JPEG ou PNG.');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error('L\'image est trop grande. La taille maximum est de 2MB.');
        return;
      }
      
      setCoverImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setCoverImage(null);
    setImagePreview(null);
  };
  
  const uploadCoverImage = async (slug: string): Promise<string | undefined> => {
    if (!coverImage) return undefined;
    
    try {
      await createStorageBucket('blog_images');
      
      const fileExt = coverImage.name.split('.').pop();
      const fileName = `${slug}-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;
      
      await uploadFile('blog_images', filePath, coverImage);
      return getPublicUrl('blog_images', filePath);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
      return undefined;
    }
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
      
      // Upload cover image if provided
      const coverImageUrl = await uploadCoverImage(slug);
      
      const result = await submitBlogPost({
        title,
        slug,
        excerpt,
        content,
        category: category as BlogCategory,
        coverImage: coverImageUrl,
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
      <DialogContent className="sm:max-w-[700px] bg-black border-gray-700 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Proposer un article</DialogTitle>
          <DialogDescription className="text-white/70">
            Partagez votre expertise avec la communauté. Les articles sont soumis à modération avant publication.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Titre de l'article *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Un titre accrocheur"
              required
              className="bg-gray-900 border-gray-700 text-white focus:border-startupia-turquoise"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-white">Résumé *</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Un court résumé de votre article (150 caractères max)"
              maxLength={150}
              required
              className="bg-gray-900 border-gray-700 text-white focus:border-startupia-turquoise"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white">Contenu *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Le contenu détaillé de votre article"
              required
              className="min-h-[200px] bg-gray-900 border-gray-700 text-white focus:border-startupia-turquoise"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Catégorie *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as BlogCategory)}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white focus:border-startupia-turquoise">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-white hover:bg-gray-800">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-white">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ia, startup, tech"
                className="bg-gray-900 border-gray-700 text-white focus:border-startupia-turquoise"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverImage" className="text-white">Image de couverture (WebP, JPEG, PNG - max 2MB)</Label>
            {!imagePreview ? (
              <div className="flex items-center justify-center w-full">
                <label htmlFor="coverImage" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 bg-gray-900 hover:bg-gray-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-startupia-turquoise" />
                    <p className="mb-2 text-sm text-white">
                      <span className="font-semibold">Cliquez pour télécharger</span> ou glisser-déposer
                    </p>
                    <p className="text-xs text-gray-400">WebP, JPEG ou PNG (MAX. 2MB)</p>
                  </div>
                  <Input 
                    id="coverImage" 
                    type="file" 
                    className="hidden" 
                    accept=".webp,.jpg,.jpeg,.png"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            ) : (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-700">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/70 p-1 rounded-full hover:bg-black"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80 transition-colors"
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

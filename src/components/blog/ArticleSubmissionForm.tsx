
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BlogCategory } from '@/types/blog';
import ImageUpload from './ImageUpload';

interface ArticleSubmissionFormProps {
  isSubmitting: boolean;
  title: string;
  setTitle: (value: string) => void;
  excerpt: string;
  setExcerpt: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  category: BlogCategory | '';
  setCategory: (value: BlogCategory | '') => void;
  tags: string;
  setTags: (value: string) => void;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
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

const ArticleSubmissionForm: React.FC<ArticleSubmissionFormProps> = ({
  isSubmitting,
  title,
  setTitle,
  excerpt,
  setExcerpt,
  content,
  setContent,
  category,
  setCategory,
  tags,
  setTags,
  imagePreview,
  handleImageChange,
  handleRemoveImage,
  handleSubmit,
  onCancel
}) => {
  return (
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
      
      <ImageUpload
        onImageChange={handleImageChange}
        imagePreview={imagePreview}
        onImageRemove={handleRemoveImage}
        label="Image de couverture (WebP, JPEG, PNG - max 2MB)"
      />
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
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
      </div>
    </form>
  );
};

export default ArticleSubmissionForm;

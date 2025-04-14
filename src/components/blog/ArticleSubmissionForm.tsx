
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlogCategory } from '@/types/blog';
import { BlogCategoryLabels } from '@/data/blogCategories';
import ImageUpload from './ImageUpload';

interface ArticleSubmissionFormProps {
  isSubmitting: boolean;
  title: string;
  setTitle: (title: string) => void;
  excerpt: string;
  setExcerpt: (excerpt: string) => void;
  content: string;
  setContent: (content: string) => void;
  category: BlogCategory | '';
  setCategory: (category: BlogCategory | '') => void;
  tags: string;
  setTags: (tags: string) => void;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

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
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Titre *
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Un titre captivant pour votre article"
            required
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
            Résumé court *
          </label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Décrivez votre article en quelques phrases"
            required
            className="bg-gray-800 border-gray-700 text-white h-24"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Contenu *
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Le contenu complet de votre article"
            required
            className="bg-gray-800 border-gray-700 text-white h-48"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Catégorie *
          </label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as BlogCategory)}
            required
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {Object.entries(BlogCategoryLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags (séparés par des virgules)
          </label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ia, startups, prompt-engineering, etc."
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Image de couverture
          </label>
          <ImageUpload
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-startupia-turquoise hover:bg-startupia-turquoise/80"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre l\'article'}
        </Button>
      </div>
    </form>
  );
};

export default ArticleSubmissionForm;

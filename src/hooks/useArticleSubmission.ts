
import { useState } from 'react';
import { BlogCategory } from '@/types/blog';
import { submitBlogPost } from '@/services/blogService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { generateSlug } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { createStorageBucket, uploadFile, getPublicUrl } from '@/integrations/supabase/storage';

export const useArticleSubmission = (onSuccess: () => void) => {
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
      let coverImageUrl: string | undefined;
      
      try {
        if (coverImage) {
          await createStorageBucket('blog_images');
          
          const fileExt = coverImage.name.split('.').pop();
          const fileName = `${slug}-${Date.now()}.${fileExt}`;
          const filePath = `covers/${fileName}`;
          
          await uploadFile('blog_images', filePath, coverImage);
          coverImageUrl = getPublicUrl('blog_images', filePath);
        }
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast.warning('Erreur lors du téléchargement de l\'image, l\'article sera soumis sans image');
      }
      
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
        onSuccess();
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
  
  return {
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
    coverImage,
    imagePreview,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
    resetForm
  };
};

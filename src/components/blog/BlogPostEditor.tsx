
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { uploadFile, getPublicUrl } from '@/integrations/supabase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BlogPost, BlogCategory } from '@/types/blog';
import { ArrowLeft, Image, Save } from 'lucide-react';
import { toast } from 'sonner';

interface BlogPostEditorProps {
  post: BlogPost | null;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ post, onSave, onCancel }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [category, setCategory] = useState<BlogCategory>(post?.category || 'Actualités');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [featured, setFeatured] = useState(post?.featured || false);
  const [status, setStatus] = useState<'draft' | 'published' | 'pending'>(post?.status || 'draft');
  const [coverImage, setCoverImage] = useState<string | null>(post?.coverImage || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Generate slug from title
  useEffect(() => {
    if (!post && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  }, [title, post]);
  
  // Calculate reading time based on content length
  const calculateReadingTime = (text: string): string => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de lecture`;
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    try {
      setUploadingImage(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `blog/${fileName}`;
      
      await uploadFile('user_content', filePath, file);
      const publicUrl = getPublicUrl('user_content', filePath);
      
      setCoverImage(publicUrl);
      toast.success('Image téléchargée avec succès');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug || !excerpt || !content || !category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!user) {
      toast.error('Vous devez être connecté pour publier un article');
      return;
    }
    
    setSaving(true);
    
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      const authorName = profileData
        ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim()
        : user.email?.split('@')[0] || 'Auteur';
      
      const readingTime = calculateReadingTime(content);
      
      let savedPost;
      
      if (post) {
        // Update existing post
        const { data, error } = await supabase
          .from('blog_posts')
          .update({
            title: title,
            slug: slug,
            excerpt: excerpt,
            content: content,
            category: category,
            tags: tagsArray,
            featured: featured,
            cover_image: coverImage,
            updated_at: new Date().toISOString(),
            reading_time: readingTime,
            status: status
          })
          .eq('id', post.id)
          .select()
          .single();
        
        if (error) throw error;
        savedPost = data;
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            title: title,
            slug: slug,
            excerpt: excerpt,
            content: content,
            category: category,
            tags: tagsArray,
            featured: featured,
            cover_image: coverImage,
            author_id: user.id,
            author_name: authorName,
            author_avatar: profileData?.avatar_url || null,
            reading_time: readingTime,
            status: status
          })
          .select()
          .single();
        
        if (error) throw error;
        savedPost = data;
      }
      
      toast.success(post ? 'Article mis à jour avec succès' : 'Article créé avec succès');
      
      // Convert from snake_case to camelCase for the BlogPost interface
      const formattedPost: BlogPost = {
        id: savedPost.id,
        title: savedPost.title,
        slug: savedPost.slug,
        excerpt: savedPost.excerpt,
        content: savedPost.content,
        category: savedPost.category as BlogCategory,
        coverImage: savedPost.cover_image,
        authorId: savedPost.author_id,
        authorName: savedPost.author_name,
        authorAvatar: savedPost.author_avatar,
        createdAt: savedPost.created_at,
        updatedAt: savedPost.updated_at,
        tags: savedPost.tags,
        featured: savedPost.featured,
        readingTime: savedPost.reading_time,
        status: savedPost.status
      };
      
      onSave(formattedPost);
      navigate('/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Erreur lors de la sauvegarde de l\'article');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16 px-4">
      <div className="container mx-auto">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            onClick={onCancel} 
            className="text-white/80 hover:text-white"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold ml-4">
            {post ? 'Modifier l\'article' : 'Nouvel article'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-black/30 p-6 rounded-lg border border-startupia-turquoise/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de l'article"
                  required
                  className="bg-black/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="slug-de-l-article"
                  required
                  className="bg-black/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Extrait *</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Courte description de l'article (sera affichée dans les aperçus)"
                  required
                  className="bg-black/50 min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select 
                    value={category} 
                    onValueChange={(value) => setCategory(value as BlogCategory)}
                  >
                    <SelectTrigger className="bg-black/50">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actualités">Actualités</SelectItem>
                      <SelectItem value="Growth">Growth</SelectItem>
                      <SelectItem value="Technique">Technique</SelectItem>
                      <SelectItem value="Interviews">Interviews</SelectItem>
                      <SelectItem value="Outils">Outils</SelectItem>
                      <SelectItem value="Levées de fonds">Levées de fonds</SelectItem>
                      <SelectItem value="Startup du mois">Startup du mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="bg-black/50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                  <Label htmlFor="featured">Article à la une</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value as 'draft' | 'published' | 'pending')}
                  >
                    <SelectTrigger className="bg-black/50">
                      <SelectValue placeholder="Choisir un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Image de couverture</Label>
                <div className="flex items-center space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    <Image size={16} className="mr-2" />
                    {uploadingImage ? 'Téléchargement...' : 'Choisir une image'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </div>
                {coverImage && (
                  <div className="mt-2">
                    <img 
                      src={coverImage} 
                      alt="Cover preview" 
                      className="max-h-40 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Contenu de l'article en Markdown"
                  required
                  className="bg-black/50 min-h-[400px]"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="mr-4"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/80"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPostEditor;

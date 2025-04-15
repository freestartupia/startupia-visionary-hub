import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BlogPost, BlogCategory } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ImagePlus, Save, ArrowLeft, Eye } from 'lucide-react';
import { getAllBlogCategories } from '@/data/mockBlogPosts';
import { createBlogPost, updateBlogPost, fetchBlogPostBySlug, generateSlug, estimateReadingTime } from '@/services/blogService';
import { uploadBlogImage } from '@/services/imageUploadService';
import { toast } from '@/hooks/use-toast';

interface BlogPostFormValues {
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string;
  coverImageFile?: FileList;
}

const BlogPostEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [existingPost, setExistingPost] = useState<BlogPost | null>(null);
  const categories = getAllBlogCategories();

  const form = useForm<BlogPostFormValues>({
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: 'Actualités',
      tags: '',
    },
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer ou modifier un article",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    const loadArticle = async () => {
      if (slug && slug !== 'new') {
        setIsLoading(true);
        try {
          const post = await fetchBlogPostBySlug(slug);
          if (post) {
            setExistingPost(post);
            form.reset({
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              category: post.category,
              tags: post.tags.join(', '),
            });
            setCoverImagePreview(post.coverImage || null);
          } else {
            toast({
              title: "Erreur",
              description: "Article introuvable",
              variant: "destructive",
            });
            navigate('/blog');
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'article:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadArticle();
  }, [slug, navigate, user, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: BlogPostFormValues, status: 'draft' | 'published' = 'published') => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour publier un article",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      // Télécharger l'image si une nouvelle est sélectionnée
      let coverImageUrl = existingPost?.coverImage || null;
      const file = data.coverImageFile?.[0];
      if (file) {
        coverImageUrl = await uploadBlogImage(file);
        if (!coverImageUrl) {
          setIsSubmitting(false);
          return; // Arrêter si le téléchargement a échoué
        }
      }

      // Préparer les données de l'article
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const blogData: Partial<BlogPost> = {
        title: data.title,
        slug: existingPost?.slug || generateSlug(data.title),
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: tagsArray,
        coverImage: coverImageUrl,
        authorId: user.id,
        authorName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur anonyme',
        authorAvatar: user.user_metadata?.avatar_url || null,
        readingTime: estimateReadingTime(data.content),
        status: status,
        featured: false,
      };

      // Créer ou mettre à jour l'article
      let result;
      if (existingPost) {
        result = await updateBlogPost(existingPost.id, blogData);
      } else {
        result = await createBlogPost(blogData);
      }

      if (result) {
        toast({
          title: "Succès",
          description: existingPost 
            ? "L'article a été mis à jour avec succès" 
            : "L'article a été créé avec succès",
        });
        navigate('/blog');
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'article:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de l'article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-startupia-turquoise" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center text-white hover:text-startupia-turquoise"
          onClick={() => navigate('/blog')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au blog
        </Button>
        <h1 className="text-2xl font-bold text-white">
          {existingPost ? 'Modifier l\'article' : 'Nouvel article'}
        </h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="border-startupia-turquoise text-startupia-turquoise hover:bg-startupia-turquoise/20" 
            onClick={() => form.handleSubmit(data => onSubmit(data, 'draft'))()}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Enregistrer brouillon
          </Button>
          <Button 
            className="bg-startupia-turquoise hover:bg-startupia-turquoise/80" 
            onClick={form.handleSubmit(data => onSubmit(data, 'published'))}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            Publier
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Le titre est requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Titre</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Titre de l'article" 
                        {...field} 
                        className="bg-black/50 border-white/20 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                rules={{ required: "Le résumé est requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Résumé</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Un bref résumé de l'article" 
                        {...field} 
                        className="bg-black/50 border-white/20 text-white min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: "La catégorie est requise" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Catégorie</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-black/50 border-white/20 text-white">
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-white/20 text-white">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Tags (séparés par des virgules)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="IA, Startups, Tech..." 
                          {...field} 
                          className="bg-black/50 border-white/20 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="coverImageFile"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel className="text-white">Image de couverture</FormLabel>
                    <div className="flex flex-col items-center justify-center">
                      {coverImagePreview ? (
                        <div className="relative mb-4 w-full h-[200px] rounded-lg overflow-hidden">
                          <img 
                            src={coverImagePreview} 
                            alt="Aperçu de l'image" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-2 right-2 bg-black/70 text-white hover:bg-black/90"
                            onClick={() => setCoverImagePreview(null)}
                          >
                            Changer
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-12 w-full mb-4 flex flex-col items-center justify-center cursor-pointer hover:border-startupia-turquoise/50 transition-colors">
                          <ImagePlus className="h-12 w-12 text-white/50 mb-2" />
                          <p className="text-white/70 text-center">
                            Cliquez ou glissez-déposez une image ici
                          </p>
                          <p className="text-white/50 text-xs mt-1">
                            JPG, PNG, GIF, WEBP • Max 2MB
                          </p>
                        </div>
                      )}
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="coverImage"
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleImageChange(e);
                          }}
                          {...fieldProps}
                        />
                      </FormControl>
                      <label htmlFor="coverImage">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-startupia-turquoise text-startupia-turquoise hover:bg-startupia-turquoise/20 cursor-pointer"
                          asChild
                        >
                          <span>
                            <ImagePlus className="h-4 w-4 mr-2" />
                            {coverImagePreview ? "Changer l'image" : "Ajouter une image"}
                          </span>
                        </Button>
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              rules={{ required: "Le contenu est requis" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Contenu</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Contenu de l'article..." 
                      {...field} 
                      className="bg-black/50 border-white/20 text-white min-h-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BlogPostEditor;

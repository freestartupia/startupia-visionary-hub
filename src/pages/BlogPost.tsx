
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { fetchBlogPostBySlug } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { useToast } from "@/components/ui/use-toast";

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadBlogPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const post = await fetchBlogPostBySlug(slug);
        setPost(post);
        
        if (!post) {
          toast({
            title: "Article introuvable",
            description: "L'article que vous recherchez n'existe pas ou a été supprimé.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error loading blog post:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'article. Veuillez réessayer plus tard.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBlogPost();
  }, [slug, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto pt-32 pb-16 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto pt-32 pb-16 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Article introuvable</h1>
          <p className="mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2" size={16} />
              Retour au blog
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title={`${post.title} | Startupia Blog`}
        description={post.excerpt}
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-startupia-turquoise hover:underline mb-8">
            <ArrowLeft className="mr-2" size={16} />
            Retour au blog
          </Link>
          
          <Badge variant="outline" className="text-startupia-turquoise border-startupia-turquoise mb-4">
            {post.category}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-white/70 mb-8">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {format(new Date(post.createdAt), "dd MMMM yyyy")}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              {post.readingTime}
            </div>
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              {post.authorName}
            </div>
          </div>
          
          {post.coverImage && (
            <div className="mb-10 rounded-lg overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                <Tag size={16} className="mr-2" />
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-black/30 text-white/70">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;

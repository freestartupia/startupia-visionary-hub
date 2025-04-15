
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost as BlogPostType } from '@/types/blog';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Convert from snake_case to camelCase for the BlogPost interface
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        coverImage: data.cover_image,
        authorId: data.author_id,
        authorName: data.author_name,
        authorAvatar: data.author_avatar,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        tags: data.tags || [],
        featured: data.featured,
        readingTime: data.reading_time,
      } as BlogPostType;
    }
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Article introuvable</h2>
          <p className="text-white/70 mb-8">
            L'article que vous recherchez n'existe pas ou a été déplacé.
          </p>
          <Button onClick={() => navigate('/blog')}>
            Retour au blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Format the date
  const formattedDate = format(new Date(post.createdAt), 'dd MMMM yyyy');
  
  // Create paragraphs from content
  const contentParagraphs = post.content.split('\n\n');
  
  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title={`${post.title} | Blog Startupia`}
        description={post.excerpt}
      />
      
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/blog')}
          className="mb-6 text-white/80 hover:text-white"
        >
          <ArrowLeft size={16} className="mr-2" />
          Retour au blog
        </Button>
        
        <div className="max-w-4xl mx-auto">
          {post.coverImage && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          <Badge variant="outline" className="mb-4 text-startupia-turquoise border-startupia-turquoise">
            {post.category}
          </Badge>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex flex-col md:flex-row md:items-center mb-8 text-white/80 space-y-4 md:space-y-0">
            <div className="flex items-center mr-6">
              <Avatar className="w-10 h-10 mr-3">
                {post.authorAvatar ? (
                  <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                ) : (
                  <AvatarFallback className="bg-startupia-turquoise/30">
                    {post.authorName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <span>{post.authorName}</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>
          
          <div className="prose prose-lg prose-invert max-w-none mb-10">
            {contentParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center mt-8 border-t border-white/10 pt-6">
              <Tag size={16} className="mr-3 text-white/60" />
              {post.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="mr-2 mb-2"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;

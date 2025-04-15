
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlogPostBySlug } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { Loader2, Calendar, Clock, Edit, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const BlogPostView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const fetchedPost = await fetchBlogPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          navigate('/blog');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPost();
  }, [slug, navigate]);

  const isAuthor = user && post && post.authorId === user.id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-startupia-turquoise" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Article introuvable</h1>
        <Link to="/blog">
          <Button variant="default" className="bg-startupia-turquoise hover:bg-startupia-turquoise/80">
            Retour au blog
          </Button>
        </Link>
      </div>
    );
  }

  // Création des données SEO à partir des données de l'article
  const postTitle = post.seoTitle || post.title;
  const postDescription = post.seoDescription || post.excerpt;
  const postUrl = `${window.location.origin}/blog/${post.slug}`;
  const postImage = post.coverImage || `${window.location.origin}/og-image.png`;

  // Function to parse and format content
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      // Check if the paragraph is an H2 (starts with ##)
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-white">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      // Check if the paragraph is an H3 (starts with ###)
      else if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-white">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      // Regular paragraph
      else if (paragraph.trim()) {
        return <p key={index} className="mb-4">{paragraph}</p>;
      }
      // Empty line
      return <br key={index} />;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title={postTitle}
        description={postDescription}
        canonical={postUrl}
        image={postImage}
        type="article"
        author={post.authorName}
        publishedTime={post.createdAt}
        noindex={post.status === 'draft'}
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <Link to="/blog" className="inline-flex items-center text-white/70 hover:text-startupia-turquoise mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au blog
        </Link>
        
        <article className="max-w-4xl mx-auto">
          {post.coverImage && (
            <div className="w-full h-[400px] mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {post.authorAvatar ? (
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-startupia-turquoise/30 flex items-center justify-center mr-3">
                      {post.authorName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{post.authorName}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-white/60">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(new Date(post.createdAt), 'dd MMM yyyy')}</span>
                </div>
                
                <div className="flex items-center text-white/60">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readingTime}</span>
                </div>
              </div>
              
              {isAuthor && (
                <Link to={`/blog/edit/${post.slug}`}>
                  <Button variant="outline" size="sm" className="border-startupia-turquoise text-startupia-turquoise hover:bg-startupia-turquoise/20">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-6">
              <span className="bg-startupia-turquoise/20 text-startupia-turquoise px-3 py-1 rounded text-sm">
                {post.category}
              </span>
              {post.tags.map(tag => (
                <span key={tag} className="bg-white/10 text-white/80 px-3 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <p className="text-xl text-white/80 italic mb-8">{post.excerpt}</p>
          </div>
          
          <div className="prose prose-lg prose-invert max-w-none">
            {formatContent(post.content)}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostView;

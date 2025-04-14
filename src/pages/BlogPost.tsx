
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { fetchBlogPostBySlug } from '@/services/blogService';
import BlogPostDetail from '@/components/blog/BlogPostDetail';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { 
    data: post, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => fetchBlogPostBySlug(slug || ''),
    enabled: !!slug
  });
  
  // Redirect to blog list if post not found
  React.useEffect(() => {
    if (!isLoading && !post) {
      navigate('/blog');
    }
  }, [isLoading, post, navigate]);

  return (
    <div className="min-h-screen bg-black text-white">
      {post && (
        <SEO 
          title={`${post.title} | StartupIA Blog`}
          description={post.excerpt}
        />
      )}
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/4 bg-gray-800/50" />
            <Skeleton className="h-16 w-full bg-gray-800/50" />
            <Skeleton className="h-8 w-1/2 bg-gray-800/50" />
            <Skeleton className="h-[400px] w-full bg-gray-800/50" />
            <Skeleton className="h-96 w-full bg-gray-800/50" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-white/60">Une erreur est survenue lors du chargement de l'article.</p>
          </div>
        ) : post ? (
          <BlogPostDetail post={post} />
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;

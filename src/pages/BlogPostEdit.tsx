
import React from 'react';
import BlogPostEditor from '@/components/blog/BlogPostEditor';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Toaster } from "@/components/ui/toaster";
import { useParams } from 'react-router-dom';

const BlogPostEdit = () => {
  const { slug } = useParams<{ slug: string }>();
  const isNew = !slug || slug === 'new';
  
  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title={isNew ? "Rédiger un article | StartupIA" : "Modifier un article | StartupIA"}
        description={isNew 
          ? "Créez et éditez des articles sur l'actualité IA et des startups françaises."
          : "Modifiez votre article sur l'actualité IA et des startups françaises."}
        noindex={true} // Les pages d'édition ne doivent pas être indexées
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <main className="pt-24 pb-16 relative z-10">
        <BlogPostEditor />
      </main>

      <Footer />
      <Toaster />
    </div>
  );
};

export default BlogPostEdit;

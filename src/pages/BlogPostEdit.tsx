
import React from 'react';
import BlogPostEditor from '@/components/blog/BlogPostEditor';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Toaster } from "@/components/ui/toaster";

const BlogPostEdit = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Rédiger un article | StartupIA"
        description="Créez et éditez des articles sur l'actualité IA et des startups françaises."
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

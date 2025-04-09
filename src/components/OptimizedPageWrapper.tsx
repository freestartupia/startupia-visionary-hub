
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OptimizedPageWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const OptimizedPageWrapper: React.FC<OptimizedPageWrapperProps> = ({ 
  children, 
  title, 
  description 
}) => {
  // Précharger les ressources critiques
  React.useEffect(() => {
    // Précharger les images critiques
    const preloadImages = [
      '/logo.svg',
      // Ajouter d'autres images critiques
    ];
    
    preloadImages.forEach(imageUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;
      document.head.appendChild(link);
    });
    
    return () => {
      // Nettoyer lorsque le composant est démonté
      document.querySelectorAll('link[rel="preload"][as="image"]').forEach(el => {
        el.remove();
      });
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className="content-wrapper">
        {children}
      </div>
    </>
  );
};

export default OptimizedPageWrapper;

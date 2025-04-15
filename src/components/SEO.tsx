
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  lang?: string;
  noindex?: boolean;
  image?: string;
  type?: string;
  author?: string;
  twitterCard?: string;
  twitterCreator?: string;
  publishedTime?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  lang = "fr",
  noindex = false,
  image,
  type = "article",
  author,
  twitterCard = "summary_large_image",
  twitterCreator,
  publishedTime,
}) => {
  // Default image if none provided
  const ogImage = image || "https://startupia.fr/og-image.png";
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <html lang={lang} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="StartupIA" />
      {author && <meta property="article:author" content={author} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
      <meta name="twitter:site" content="@startupia_fr" />
    </Helmet>
  );
};

export default SEO;

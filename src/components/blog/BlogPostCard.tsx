
import React from 'react';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogPostCard = ({ post, featured = false }: BlogPostCardProps) => {
  const cardClass = featured
    ? 'flex flex-col md:flex-row gap-6 bg-black/30 border border-startupia-turquoise/20 hover:border-startupia-turquoise/40 p-6 rounded-lg transition-all hover:bg-black/50'
    : 'flex flex-col h-full bg-black/30 border border-white/10 hover:border-white/30 p-6 rounded-lg transition-all hover:bg-black/50';

  return (
    <Link to={`/blog/post/${post.slug}`} className={cardClass}>
      {post.coverImage && (
        <div className={featured ? 'w-full md:w-1/3 mb-6 md:mb-0' : 'w-full mb-6'}>
          <div className="rounded-lg overflow-hidden h-[200px]">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      <div className={featured ? 'flex-1' : ''}>
        <div className="flex items-center mb-3">
          <span className="bg-startupia-turquoise/20 text-startupia-turquoise text-xs px-2 py-1 rounded mr-2">
            {post.category}
          </span>
          <span className="text-white/50 text-xs">
            {format(new Date(post.createdAt), 'dd MMM yyyy')}
          </span>
        </div>
        
        <h3 className={featured ? "text-2xl font-bold mb-3" : "text-xl font-bold mb-3"}>
          {post.title}
        </h3>
        
        <p className="text-white/70 mb-4 line-clamp-2">{post.excerpt}</p>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center">
            {post.authorAvatar ? (
              <img 
                src={post.authorAvatar} 
                alt={post.authorName} 
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-startupia-turquoise/30 flex items-center justify-center mr-2">
                {post.authorName?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-sm">{post.authorName}</span>
          </div>
          
          <span className="text-white/50 text-xs">
            {post.readingTime}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;

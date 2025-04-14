
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
  isPending?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, featured = false, isPending = false }) => {
  return (
    <Card className={`relative overflow-hidden border-none bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 ${
      featured ? 'md:grid md:grid-cols-2 gap-4' : ''
    }`}>
      {isPending && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-yellow-500 text-black">
            <AlertTriangle className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        </div>
      )}
      
      {post.coverImage && (
        <Link to={`/blog/${post.slug}`} className={`block ${featured ? 'h-full max-h-[300px]' : 'aspect-video'} overflow-hidden`}>
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </Link>
      )}
      
      <div className="flex flex-col h-full">
        <CardContent className={`flex-grow ${featured ? 'p-6' : 'p-4'}`}>
          <div className="mb-2">
            <Badge variant="outline" className="text-startupia-turquoise border-startupia-turquoise">
              {post.category}
            </Badge>
          </div>
          
          <Link to={`/blog/${post.slug}`} className="hover:text-startupia-turquoise transition-colors">
            <h3 className={`font-bold mb-2 ${featured ? 'text-2xl' : 'text-xl'}`}>
              {post.title}
            </h3>
          </Link>
          
          <p className="text-white/70 text-sm line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        </CardContent>
        
        <CardFooter className="pt-0 px-4 pb-4 border-t border-white/10 flex flex-wrap gap-y-2 gap-x-4 text-white/60 text-xs">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {format(new Date(post.createdAt), "dd MMM yyyy")}
          </div>
          {post.readingTime && (
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              {post.readingTime}
            </div>
          )}
          <div className="flex items-center ml-auto">
            <User size={14} className="mr-1" />
            {post.authorName}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default BlogPostCard;

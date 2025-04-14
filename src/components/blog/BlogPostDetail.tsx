
import React from 'react';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, Tag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

interface BlogPostDetailProps {
  post: BlogPost;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  const formattedDate = format(new Date(post.createdAt), "dd MMMM yyyy");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" asChild className="text-startupia-turquoise">
          <Link to="/blog" className="flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Retour aux articles
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <Badge variant="outline" className="text-startupia-turquoise border-startupia-turquoise mb-4">
          {post.category}
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between flex-wrap gap-4 text-white/60 text-sm">
          <div className="flex items-center space-x-4">
            {post.authorAvatar && (
              <img 
                src={post.authorAvatar} 
                alt={post.authorName}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <span>{post.authorName}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <CalendarIcon size={14} className="mr-1" /> {formattedDate}
            </span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1" /> {post.readingTime}
            </span>
          </div>
        </div>
      </div>

      {post.coverImage && (
        <div className="w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <Card className="glass-card border-none bg-black/30">
        <CardContent className="pt-6">
          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </CardContent>
      </Card>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-black/30">
              <Tag size={12} className="mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPostDetail;

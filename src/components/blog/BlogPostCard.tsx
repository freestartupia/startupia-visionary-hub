
import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, Clock, Tag } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogPostCard = ({ post, featured = false }: BlogPostCardProps) => {
  const formattedDate = format(new Date(post.createdAt), "dd MMM yyyy");
  
  if (featured) {
    return (
      <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-black/30 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative h-[240px] md:h-full overflow-hidden">
            <img 
              src={post.coverImage || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485"} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-6 flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="text-startupia-turquoise border-startupia-turquoise">
                  {post.category}
                </Badge>
                <span className="text-xs text-white/60 flex items-center gap-1">
                  <CalendarIcon size={14} /> {formattedDate}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
              <p className="text-white/80 mb-4 line-clamp-3">{post.excerpt}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {post.authorAvatar && (
                  <img 
                    src={post.authorAvatar} 
                    alt={post.authorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-white/70">{post.authorName}</span>
              </div>
              <span className="text-xs text-white/60 flex items-center gap-1">
                <Clock size={14} /> {post.readingTime}
              </span>
            </div>
            <div className="mt-4">
              <Link 
                to={`/blog/${post.slug}`} 
                className="block text-startupia-turquoise hover:underline"
              >
                Lire la suite →
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`}>
      <Card className="overflow-hidden h-full border border-startupia-turquoise/20 bg-black/30 hover-scale glass-card">
        <div className="h-48 overflow-hidden">
          <img 
            src={post.coverImage || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <Badge variant="outline" className="text-startupia-turquoise border-startupia-turquoise">
              {post.category}
            </Badge>
            <span className="text-xs text-white/60 flex items-center gap-1">
              <Clock size={12} /> {post.readingTime}
            </span>
          </div>
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-white/80 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              {post.authorAvatar && (
                <img 
                  src={post.authorAvatar} 
                  alt={post.authorName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="text-xs text-white/70">{post.authorName}</span>
            </div>
            <span className="text-xs text-white/60">
              {formattedDate}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogPostCard;


import React from 'react';
import { ThumbsUp, Eye, Calendar, Tag, Link2 } from 'lucide-react';
import { ForumPost } from '@/types/community';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

interface PostContentProps {
  post: ForumPost;
  onLike: () => void;
}

const PostContent: React.FC<PostContentProps> = ({ post, onLike }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (error) {
      return 'date inconnue';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const copyLinkToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // Vous pouvez ajouter un toast ici
  };

  return (
    <Card className="glass-card overflow-hidden border-white/10">
      <div className="bg-gradient-to-r from-startupia-turquoise/10 to-transparent p-4">
        <div className="flex justify-between mb-1">
          <Badge variant="outline" className="bg-white/10 text-xs font-medium py-1 px-2 rounded">
            {post.category}
          </Badge>
          
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Calendar size={14} />
            {formatDate(post.createdAt)}
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mt-2">{post.title}</h1>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.authorAvatar || '/placeholder.svg'} alt={post.authorName} />
              <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.authorName}</div>
              <div className="text-xs text-white/60">Auteur</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-white/60">
              <Eye size={16} />
              <span>{post.views}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={copyLinkToClipboard} 
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Link2 size={16} />
            </Button>
          </div>
        </div>
        
        <div className="post-content text-white/90 leading-relaxed mb-6">
          {post.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Tag size={16} className="text-white/60 mr-1" />
            {post.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="bg-white/5">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <Separator className="my-6 bg-white/10" />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-white/60">
            {post.replies.length} réponse{post.replies.length !== 1 ? 's' : ''}
          </div>
          
          <Button 
            onClick={onLike} 
            variant="outline" 
            className={`flex items-center gap-2 ${post.isLiked ? "bg-startupia-turquoise/20 text-startupia-turquoise border-startupia-turquoise/30" : ""}`}
          >
            <ThumbsUp size={16} />
            J'aime ({post.likes})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostContent;

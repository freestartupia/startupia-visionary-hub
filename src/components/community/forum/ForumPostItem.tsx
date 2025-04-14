
import React from 'react';
import { ThumbsUp, MessageCircle, Eye, Pin, ArrowUp } from 'lucide-react';
import { ForumPost } from '@/types/community';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AuthRequired from '@/components/AuthRequired';

interface ForumPostItemProps {
  post: ForumPost;
  onViewPost: (postId: string) => void;
  onLikePost: (e: React.MouseEvent, postId: string) => void;
  onUpvotePost?: (e: React.MouseEvent, postId: string) => void;
  requireAuth?: boolean;
}

const ForumPostItem: React.FC<ForumPostItemProps> = ({ 
  post, 
  onViewPost, 
  onLikePost,
  onUpvotePost,
  requireAuth = false 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
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

  return (
    <div 
      className="glass-card p-5 hover:bg-white/5 transition-colors cursor-pointer rounded-xl border border-white/10"
      onClick={() => onViewPost(post.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="bg-white/10 text-xs font-medium py-1 px-2 rounded">
            {post.category}
          </Badge>
          
          {post.isPinned && (
            <Badge className="bg-startupia-turquoise/20 text-startupia-turquoise text-xs font-medium py-1 px-2 rounded flex items-center gap-1">
              <Pin size={12} />
              Épinglé
            </Badge>
          )}
        </div>
        
        <div className="text-xs text-white/60">
          {formatDate(post.createdAt)}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
      
      <p className="text-white/70 mb-4 line-clamp-2">
        {post.content}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={post.authorAvatar || ''} alt={post.authorName} />
            <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{post.authorName}</span>
        </div>
        
        <div className="flex gap-4">
          {onUpvotePost && (
            <AuthRequired forActiveParticipation={true}>
              <button 
                onClick={(e) => onUpvotePost(e, post.id)}
                className={`flex items-center gap-1 ${post.isUpvoted ? "text-startupia-turquoise" : "text-white/60 hover:text-white"}`}
              >
                <ArrowUp size={16} />
                <span>{post.upvotesCount || 0}</span>
              </button>
            </AuthRequired>
          )}
          
          <AuthRequired forActiveParticipation={true}>
            <button 
              onClick={(e) => onLikePost(e, post.id)}
              className={`flex items-center gap-1 ${post.isLiked ? "text-startupia-turquoise" : "text-white/60 hover:text-white"}`}
            >
              <ThumbsUp size={16} />
              <span>{post.likes}</span>
            </button>
          </AuthRequired>
          
          <div className="flex items-center gap-1 text-white/60">
            <MessageCircle size={16} />
            <span>{post.replies?.length || 0}</span>
          </div>
          
          <div className="flex items-center gap-1 text-white/60">
            <Eye size={16} />
            <span>{post.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPostItem;

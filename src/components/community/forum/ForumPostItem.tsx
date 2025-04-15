
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
      className="bg-black rounded-xl border border-white/20 shadow-lg overflow-hidden hover:border-startupia-turquoise/50 transition-all cursor-pointer"
      onClick={() => onViewPost(post.id)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-startupia-turquoise/20 text-white font-medium py-1 px-2 rounded border-startupia-turquoise/30">
              {post.category}
            </Badge>
            
            {post.isPinned && (
              <Badge className="bg-white/10 text-white font-medium py-1 px-2 rounded flex items-center gap-1 border border-white/20">
                <Pin size={12} className="text-startupia-turquoise" />
                Épinglé
              </Badge>
            )}
          </div>
          
          <div className="text-xs text-white/60">
            {formatDate(post.createdAt)}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-white">{post.title}</h3>
        
        <p className="text-white/80 mb-4 line-clamp-2">
          {post.content}
        </p>
      </div>
      
      <div className="bg-startupia-turquoise px-5 py-3 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <Avatar className="h-8 w-8 mr-2 border border-black/20">
            {post.authorAvatar ? (
              <AvatarImage src={post.authorAvatar} alt={post.authorName} />
            ) : (
              <AvatarFallback className="bg-black/70 text-white">{getInitials(post.authorName)}</AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-black">{post.authorName}</span>
        </div>
        
        <div className="flex gap-4">
          {onUpvotePost && (
            <AuthRequired forActiveParticipation={true}>
              <button 
                onClick={(e) => onUpvotePost(e, post.id)}
                className={`flex items-center gap-1 text-black transition-colors`}
              >
                <ArrowUp size={16} className="stroke-black" />
                <span>{post.upvotesCount || 0}</span>
              </button>
            </AuthRequired>
          )}
          
          <AuthRequired forActiveParticipation={true}>
            <button 
              onClick={(e) => onLikePost(e, post.id)}
              className={`flex items-center gap-1 text-black transition-colors`}
            >
              <ThumbsUp size={16} className="stroke-black" />
              <span>{post.likes}</span>
            </button>
          </AuthRequired>
          
          <div className="flex items-center gap-1 text-black">
            <MessageCircle size={16} className="stroke-black" />
            <span>{post.replies?.length || 0}</span>
          </div>
          
          <div className="flex items-center gap-1 text-black">
            <Eye size={16} className="stroke-black" />
            <span>{post.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPostItem;

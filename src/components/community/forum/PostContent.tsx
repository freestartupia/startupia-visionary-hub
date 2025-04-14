
import React from 'react';
import { ForumPost } from '@/types/community';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ThumbsUp, Eye, MessageCircle, Pin, ArrowUp } from 'lucide-react';

interface PostContentProps {
  post: ForumPost;
  onLike: () => void;
  onUpvote?: () => void;
}

const PostContent: React.FC<PostContentProps> = ({ post, onLike, onUpvote }) => {
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

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-white/10">
            {post.category}
          </Badge>
          
          {post.isPinned && (
            <Badge className="bg-startupia-turquoise/20 text-startupia-turquoise flex items-center gap-1">
              <Pin size={14} className="shrink-0" />
              Épinglé
            </Badge>
          )}
        </div>
      
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center mb-6">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={post.authorAvatar || ''} alt={post.authorName} />
            <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{post.authorName}</div>
            <div className="text-sm text-white/60">{formatDate(post.createdAt)}</div>
          </div>
        </div>
        
        <div className="prose prose-invert max-w-full mb-6">
          <p className="whitespace-pre-line">{post.content}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
          <button 
            onClick={onLike}
            className={`flex items-center gap-1.5 ${post.isLiked ? "text-startupia-turquoise" : "text-white/60 hover:text-white"}`}
          >
            <ThumbsUp size={18} />
            <span>{post.likes} j'aime{post.likes > 1 ? 's' : ''}</span>
          </button>

          {onUpvote && (
            <button 
              onClick={onUpvote}
              className={`flex items-center gap-1.5 ${post.isUpvoted ? "text-startupia-turquoise" : "text-white/60 hover:text-white"}`}
            >
              <ArrowUp size={18} />
              <span>{post.upvotesCount || 0} vote{(post.upvotesCount || 0) > 1 ? 's' : ''}</span>
            </button>
          )}
          
          <div className="flex items-center gap-1.5 text-white/60">
            <MessageCircle size={18} />
            <span>{post.replies?.length || 0} réponse{post.replies?.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-white/60">
            <Eye size={18} />
            <span>{post.views} vue{post.views !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostContent;

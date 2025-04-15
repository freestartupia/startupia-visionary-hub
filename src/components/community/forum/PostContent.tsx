
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
    <div className="glass-card rounded-xl overflow-hidden border border-white/20 shadow-lg backdrop-blur-md">
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-startupia-turquoise/20 text-white font-medium py-1 px-3 rounded border-startupia-turquoise/30">
            {post.category}
          </Badge>
          
          {post.isPinned && (
            <Badge className="bg-white/10 text-white font-medium py-1 px-3 rounded flex items-center gap-1 border border-white/20">
              <Pin size={14} className="text-startupia-turquoise shrink-0" />
              Épinglé
            </Badge>
          )}
        </div>
      
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">{post.title}</h1>
        
        <div className="flex items-center mb-6 p-3 bg-white/5 rounded-lg border border-white/10">
          <Avatar className="h-12 w-12 mr-3 border-2 border-white/20">
            {post.authorAvatar ? (
              <AvatarImage src={post.authorAvatar} alt={post.authorName} />
            ) : (
              <AvatarFallback className="bg-startupia-turquoise/30 text-white">{getInitials(post.authorName)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="font-medium text-white">{post.authorName}</div>
            <div className="text-sm text-white/70">{formatDate(post.createdAt)}</div>
          </div>
        </div>
        
        <div className="prose prose-invert max-w-full mb-6 leading-relaxed">
          <p className="whitespace-pre-line text-white/90">{post.content}</p>
        </div>
        
        <div className="flex flex-wrap gap-6 pt-4 border-t border-white/20">
          <button 
            onClick={onLike}
            className={`flex items-center gap-2 px-3 py-2 rounded-full ${post.isLiked ? "bg-startupia-turquoise/20 text-white border border-startupia-turquoise/30" : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 hover:text-white"} transition-all`}
          >
            <ThumbsUp size={18} className={post.isLiked ? "text-startupia-turquoise" : ""} />
            <span>{post.likes} j'aime{post.likes > 1 ? 's' : ''}</span>
          </button>

          {onUpvote && (
            <button 
              onClick={onUpvote}
              className={`flex items-center gap-2 px-3 py-2 rounded-full ${post.isUpvoted ? "bg-startupia-turquoise/20 text-white border border-startupia-turquoise/30" : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 hover:text-white"} transition-all`}
            >
              <ArrowUp size={18} className={post.isUpvoted ? "text-startupia-turquoise" : ""} />
              <span>{post.upvotesCount || 0} vote{(post.upvotesCount || 0) > 1 ? 's' : ''}</span>
            </button>
          )}
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 text-white/70 border border-white/10">
            <MessageCircle size={18} />
            <span>{post.replies?.length || 0} réponse{post.replies?.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 text-white/70 border border-white/10">
            <Eye size={18} />
            <span>{post.views} vue{post.views !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostContent;

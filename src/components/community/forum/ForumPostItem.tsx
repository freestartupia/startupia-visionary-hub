
import React from 'react';
import { ThumbsUp, MessageCircle, Eye } from 'lucide-react';
import { ForumPost } from '@/types/community';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AuthRequired from '@/components/AuthRequired';

interface ForumPostItemProps {
  post: ForumPost;
  onViewPost: (postId: string) => void;
  onLikePost: (e: React.MouseEvent, postId: string) => void;
  requireAuth?: boolean;
}

const ForumPostItem: React.FC<ForumPostItemProps> = ({ 
  post, 
  onViewPost, 
  onLikePost,
  requireAuth = false 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'date inconnue';
    }
  };

  return (
    <div 
      className="glass-card p-4 hover:bg-white/5 transition-colors cursor-pointer"
      onClick={() => onViewPost(post.id)}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-white/10 text-xs font-medium py-1 px-2 rounded">
          {post.category}
        </span>
        {post.isPinned && (
          <span className="bg-startupia-gold/20 text-startupia-gold text-xs font-medium py-1 px-2 rounded">
            Épinglé
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
      
      <p className="text-white/70 mb-3 line-clamp-2">
        {post.content}
      </p>
      
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center text-sm text-white/60 mb-2 sm:mb-0">
          <img 
            src={post.authorAvatar || '/placeholder.svg'} 
            alt={post.authorName} 
            className="w-6 h-6 rounded-full mr-2"
          />
          <span>{post.authorName}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        
        <div className="flex gap-4">
          <AuthRequired forActiveParticipation={requireAuth}>
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

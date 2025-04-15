
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, Reply } from 'lucide-react';
import { ForumReply } from '@/types/community';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NestedReplyProps {
  reply: ForumReply;
  onLike: (replyId: string) => void;
  onReplyToComment: (replyId: string) => void;
}

const NestedReply: React.FC<NestedReplyProps> = ({ reply, onLike, onReplyToComment }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr
      });
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
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    onLike(reply.id);
  };

  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-2">
        <Avatar className="h-6 w-6 border border-white/20">
          <AvatarImage src={reply.authorAvatar} alt={reply.authorName} />
          <AvatarFallback className="bg-startupia-turquoise/20 text-white text-xs">{getInitials(reply.authorName)}</AvatarFallback>
        </Avatar>
        <div>
          <h5 className="font-medium text-sm text-white">{reply.authorName}</h5>
          <div className="text-xs text-white/60">
            {formatDate(reply.createdAt)}
          </div>
        </div>
      </div>
      <p className="text-sm text-white/80 whitespace-pre-wrap">{reply.content}</p>
      
      <div className="flex mt-2 pt-1 gap-3">
        <button 
          onClick={handleLikeClick}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs ${reply.isLiked ? "bg-startupia-turquoise/20 text-white" : "text-white/70 hover:text-white hover:bg-white/5"} transition-colors`}
        >
          <ThumbsUp size={12} className={reply.isLiked ? "text-startupia-turquoise" : ""} />
          <span>{reply.likes}</span>
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (!user) {
              navigate('/auth');
              return;
            }
            onReplyToComment(reply.id);
          }}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Reply size={12} />
          <span>Répondre</span>
        </button>
      </div>
    </div>
  );
};

export default NestedReply;

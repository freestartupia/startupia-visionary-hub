
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { ForumReply } from '@/types/community';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import NestedReply from './NestedReply';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ReplyItemProps {
  reply: ForumReply;
  onLike: (replyId: string) => void;
  onReplyToComment: (replyId: string) => void;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onLike, onReplyToComment }) => {
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
  
  const handleLikeClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    onLike(reply.id);
  };

  return (
    <Card className="glass-card border-white/20 shadow-md backdrop-blur-md">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-9 w-9 border border-white/20">
            <AvatarImage src={reply.authorAvatar} alt={reply.authorName} />
            <AvatarFallback className="bg-startupia-turquoise/30 text-white">{getInitials(reply.authorName)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-white">{reply.authorName}</h4>
            <div className="text-xs text-white/70">
              {formatDate(reply.createdAt)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="whitespace-pre-wrap text-white/90 leading-relaxed">{reply.content}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t border-white/10">
        <div className="flex gap-4">
          <button 
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${reply.isLiked ? "bg-startupia-turquoise/20 text-white" : "text-white/70 hover:text-white hover:bg-white/5"} transition-colors`}
          >
            <ThumbsUp size={16} className={reply.isLiked ? "text-startupia-turquoise" : ""} />
            <span>{reply.likes}</span>
          </button>
          
          <button 
            onClick={() => {
              if (!user) {
                navigate('/auth');
                return;
              }
              onReplyToComment(reply.id);
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <MessageCircle size={16} />
            <span>Répondre</span>
          </button>
        </div>
      </CardFooter>
      
      {reply.nestedReplies && reply.nestedReplies.length > 0 && (
        <div className="ml-8 pl-4 border-l border-white/20 mt-2 mb-4 mx-4 space-y-3">
          {reply.nestedReplies.map((nestedReply) => (
            <NestedReply key={nestedReply.id} reply={nestedReply} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default ReplyItem;

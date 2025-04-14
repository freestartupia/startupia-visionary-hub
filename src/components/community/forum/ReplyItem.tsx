
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { ForumReply } from '@/types/community';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import NestedReply from './NestedReply';

interface ReplyItemProps {
  reply: ForumReply;
  onLike: (replyId: string) => void;
  onReplyToComment: (replyId: string) => void;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onLike, onReplyToComment }) => {
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

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={reply.authorAvatar} alt={reply.authorName} />
            <AvatarFallback>{getInitials(reply.authorName)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{reply.authorName}</h4>
            <div className="text-sm text-white/60">
              {formatDate(reply.createdAt)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="whitespace-pre-wrap">{reply.content}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-4">
          <button 
            onClick={() => onLike(reply.id)}
            className={`flex items-center gap-1 ${reply.isLiked ? "text-startupia-turquoise" : "text-white/60 hover:text-white"}`}
          >
            <ThumbsUp size={16} />
            <span>{reply.likes}</span>
          </button>
          
          <button 
            onClick={() => onReplyToComment(reply.id)}
            className="flex items-center gap-1 text-white/60 hover:text-white"
          >
            <MessageCircle size={16} />
            <span>Répondre</span>
          </button>
        </div>
      </CardFooter>
      
      {reply.nestedReplies && reply.nestedReplies.length > 0 && (
        <div className="ml-8 pl-4 border-l border-white/10 mt-2 space-y-3">
          {reply.nestedReplies.map((nestedReply) => (
            <NestedReply key={nestedReply.id} reply={nestedReply} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default ReplyItem;

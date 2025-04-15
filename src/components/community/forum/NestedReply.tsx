
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ForumReply } from '@/types/community';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NestedReplyProps {
  reply: ForumReply;
}

const NestedReply: React.FC<NestedReplyProps> = ({ reply }) => {
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
    </div>
  );
};

export default NestedReply;

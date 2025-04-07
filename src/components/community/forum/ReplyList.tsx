
import React from 'react';
import { ForumReply } from '@/types/community';
import { MessageCircle } from 'lucide-react';
import ReplyItem from './ReplyItem';

interface ReplyListProps {
  replies: ForumReply[];
  onLikeReply: (replyId: string) => void;
  onReplyToComment: (replyId: string) => void;
}

const ReplyList: React.FC<ReplyListProps> = ({ replies, onLikeReply, onReplyToComment }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Réponses ({replies.length || 0})</h3>
      
      {replies.length > 0 ? (
        replies.map((reply) => (
          <ReplyItem 
            key={reply.id} 
            reply={reply}
            onLike={onLikeReply}
            onReplyToComment={onReplyToComment}
          />
        ))
      ) : (
        <div className="text-center py-12 text-white/60">
          <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <h4 className="text-lg font-medium">Aucune réponse pour l'instant</h4>
          <p>Soyez le premier à répondre à cette discussion !</p>
        </div>
      )}
    </div>
  );
};

export default ReplyList;

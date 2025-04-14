
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StartupComment } from '@/types/startup';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { deleteStartupComment } from '@/services/comments/commentService';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface CommentListProps {
  comments: StartupComment[];
  onCommentDeleted: () => void;
}

const CommentList = ({ comments, onCommentDeleted }: CommentListProps) => {
  const { user } = useAuth();
  
  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      try {
        const success = await deleteStartupComment(commentId);
        if (success) {
          toast.success('Commentaire supprimé');
          onCommentDeleted();
        } else {
          toast.error('Erreur lors de la suppression du commentaire');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Une erreur est survenue');
      }
    }
  };
  
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-white/70">
        <p>Aucun commentaire pour le moment. Soyez le premier à donner votre avis !</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div 
          key={comment.id} 
          className="bg-black/40 border border-startupia-turquoise/20 rounded-md p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-startupia-turquoise/20 flex items-center justify-center mr-3">
                {comment.user_avatar ? (
                  <img 
                    src={comment.user_avatar} 
                    alt={comment.user_name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {comment.user_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-white">{comment.user_name}</p>
                <p className="text-sm text-white/60">
                  {formatDistanceToNow(new Date(comment.created_at), { 
                    addSuffix: true,
                    locale: fr
                  })}
                </p>
              </div>
            </div>
            
            {user && user.id === comment.user_id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteComment(comment.id)}
                className="text-white/60 hover:text-white hover:bg-red-900/30"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
          
          <div className="mt-3 text-white/90 whitespace-pre-line">
            {comment.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;

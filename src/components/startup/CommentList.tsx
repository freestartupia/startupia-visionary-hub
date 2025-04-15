
import React from 'react';
import { StartupComment } from '@/types/startup';
import { useAuth } from '@/contexts/AuthContext';
import { deleteComment } from '@/services/comments/commentService';
import { useToast } from '@/hooks/use-toast';

interface CommentListProps {
  comments: StartupComment[];
  onCommentDeleted: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onCommentDeleted }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleDeleteComment = async (commentId: string) => {
    try {
      const success = await deleteComment(commentId);
      if (success) {
        toast({
          title: "Commentaire supprimé",
          description: "Le commentaire a été supprimé avec succès.",
        });
        onCommentDeleted();
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du commentaire.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      toast({
        title: "Erreur",
        description: "Une erreur technique est survenue.",
        variant: "destructive"
      });
    }
  };
  
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 glass-card border border-white/10 rounded-lg">
        <p className="text-white/70">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="glass-card border border-white/10 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {comment.userAvatar ? (
                <img 
                  src={comment.userAvatar} 
                  alt={`${comment.userName}`} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-lg font-bold text-startupia-turquoise">
                  {comment.userName[0]}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{comment.userName}</p>
                  <p className="text-xs text-white/60">
                    {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                {user && comment.userId === user.id && (
                  <button 
                    className="text-xs text-white/40 hover:text-white/60"
                    onClick={() => {
                      if (window.confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
                        handleDeleteComment(comment.id);
                      }
                    }}
                  >
                    Supprimer
                  </button>
                )}
              </div>
              
              <p className="mt-2 text-white/80">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;

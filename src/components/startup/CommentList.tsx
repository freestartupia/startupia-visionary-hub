
import React, { useState } from 'react';
import { StartupComment } from '@/types/startup';
import { useAuth } from '@/contexts/AuthContext';
import { deleteComment } from '@/services/comments/commentService';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

interface CommentListProps {
  comments: StartupComment[];
  onCommentDeleted: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onCommentDeleted }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  
  const openDeleteDialog = (commentId: string) => {
    setCommentToDelete(commentId);
    setIsOpen(true);
  };
  
  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      const success = await deleteComment(commentToDelete);
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
    } finally {
      setIsOpen(false);
      setCommentToDelete(null);
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
    <>
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
                      className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1"
                      onClick={() => openDeleteDialog(comment.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Supprimer</span>
                    </button>
                  )}
                </div>
                
                <p className="mt-2 text-white/80">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="bg-gray-900 border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-white/20 text-white hover:bg-white/10">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteComment}
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CommentList;

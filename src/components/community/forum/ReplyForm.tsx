
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Send, X } from 'lucide-react';
import { addReplyToPost } from '@/services/forumReplyService';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ReplyFormProps {
  postId: string;
  user: User | null;
  replyingTo: string | null;
  replyingToName?: string;
  onReplyAdded: () => void;
  onCancelReply: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ 
  postId, 
  user, 
  replyingTo, 
  replyingToName,
  onReplyAdded, 
  onCancelReply 
}) => {
  const [replyContent, setReplyContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Reset content when switching between replying to post vs comment
  useEffect(() => {
    setReplyContent('');
  }, [replyingTo]);

  const handleSubmitReply = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour répondre");
      navigate('/auth');
      return;
    }
    
    if (!replyContent.trim()) return;
    
    try {
      setIsSubmitting(true);
      const userName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email || 'Utilisateur';
      const avatarUrl = user.user_metadata?.avatar_url;
      
      await addReplyToPost(
        postId,
        replyContent,
        userName,
        avatarUrl,
        replyingTo
      );
      
      // Reset the form
      setReplyContent('');
      toast.success(replyingTo ? "Réponse au commentaire envoyée" : "Réponse envoyée");
      onReplyAdded();
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      toast.error("Impossible d'envoyer votre réponse");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-card" id="reply-form">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center">
            {replyingTo ? (
              <div className="flex items-center">
                <span className="text-startupia-turquoise font-semibold">Réponse</span>
                <span className="mx-1">à</span>
                {replyingToName && (
                  <span className="font-semibold">{replyingToName}</span>
                )}
              </div>
            ) : (
              "Ajouter une réponse"
            )}
          </h3>
          
          {replyingTo && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancelReply}
              className="text-white/60 hover:text-white h-8 px-2"
            >
              <X size={16} className="mr-1" />
              Annuler
            </Button>
          )}
        </div>
        
        {replyingTo && (
          <div className="text-sm text-white/60 italic border-l-2 pl-2 border-startupia-turquoise/50 mt-1">
            Vous répondez à un commentaire spécifique
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Textarea
          placeholder={user ? "Votre réponse..." : "Connectez-vous pour répondre"}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          className="min-h-[100px] bg-black/30"
          disabled={!user || isSubmitting}
        />
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {!user ? (
          <Button onClick={() => navigate('/auth')}>
            Se connecter pour répondre
          </Button>
        ) : (
          <Button 
            onClick={handleSubmitReply} 
            disabled={!replyContent.trim() || isSubmitting}
            className="bg-startupia-turquoise hover:bg-startupia-turquoise/80 text-black"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                <span>Envoi...</span>
              </div>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> 
                Répondre
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ReplyForm;

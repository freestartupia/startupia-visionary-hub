
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addReplyToPost } from '@/services/forum/replyService';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, X } from 'lucide-react';
import { toast } from 'sonner';

interface ReplyFormProps {
  postId: string;
  user: User | null;
  replyingTo: string | null;
  onReplyAdded: () => void;
  onCancelReply: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ 
  postId, 
  user, 
  replyingTo, 
  onReplyAdded, 
  onCancelReply 
}) => {
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez être connecté pour répondre');
      navigate('/auth');
      return;
    }
    
    if (content.trim() === '') {
      toast.error('Le contenu de la réponse ne peut pas être vide');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addReplyToPost(
        postId,
        content,
        user.user_metadata.full_name || 'Utilisateur',
        user.user_metadata.avatar_url,
        replyingTo
      );
      
      setContent('');
      toast.success('Réponse ajoutée avec succès');
      onReplyAdded();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      toast.error('Erreur lors de l\'ajout de la réponse');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-6 glass-card">
        <p className="text-white/70 mb-4">Connectez-vous pour participer à la discussion</p>
        <Button onClick={() => navigate('/auth')}>Se connecter</Button>
      </div>
    );
  }

  return (
    <Card id="reply-form" className="glass-card border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>
            {replyingTo ? 'Répondre au commentaire' : 'Ajouter une réponse'}
          </span>
          {replyingTo && (
            <Button variant="ghost" size="icon" onClick={onCancelReply} className="h-6 w-6">
              <X size={16} />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            placeholder="Partagez votre avis..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] bg-white/5 border-white/10 focus-visible:ring-startupia-turquoise"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || content.trim() === ''} 
            className="flex items-center gap-2"
          >
            <Send size={16} /> 
            Publier
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReplyForm;

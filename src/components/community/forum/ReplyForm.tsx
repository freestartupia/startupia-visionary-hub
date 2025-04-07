
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { addReplyToPost } from '@/services/forumService';

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
  const [replyContent, setReplyContent] = useState<string>('');

  const handleSubmitReply = async () => {
    if (!user || !replyContent.trim()) return;
    
    try {
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
      onReplyAdded();
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
    }
  };

  return (
    <Card className="glass-card" id="reply-form">
      <CardHeader>
        <h3 className="text-lg font-medium">
          {replyingTo ? 'Répondre à un commentaire' : 'Ajouter une réponse'}
        </h3>
        {replyingTo && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancelReply}
            className="text-xs text-white/60"
          >
            Annuler la réponse
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Votre réponse..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          className="min-h-[100px] bg-black/30"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmitReply} disabled={!user || !replyContent.trim()}>
          <Send className="mr-2 h-4 w-4" /> 
          Répondre
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReplyForm;

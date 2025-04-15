
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addReplyToPost } from '@/services/forum/replyService';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les données du profil de l'utilisateur connecté
    const fetchUserProfile = async () => {
      if (user) {
        console.log('Récupération du profil utilisateur pour le forum:', user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          console.log('Profil utilisateur récupéré pour le forum:', data);
          setUserProfile(data);
        } else {
          console.error('Erreur lors de la récupération du profil pour le forum:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

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
      
      // Déterminer le nom complet et l'avatar de l'utilisateur
      let fullName = 'Utilisateur';
      let avatarUrl = null;
      
      if (userProfile) {
        const firstName = userProfile.first_name || '';
        const lastName = userProfile.last_name || '';
        fullName = `${firstName} ${lastName}`.trim();
        
        if (!fullName || fullName === '') {
          fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur';
        }
        
        avatarUrl = userProfile.avatar_url;
      } else {
        fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur';
        avatarUrl = user.user_metadata?.avatar_url;
      }
      
      console.log('Ajout de réponse forum avec nom:', fullName, 'et avatar:', avatarUrl);
      
      await addReplyToPost(
        postId,
        content,
        fullName !== '' ? fullName : 'Utilisateur',
        avatarUrl,
        replyingTo
      );
      
      setContent('');
      toast.success('Réponse ajoutée avec succès');
      // onReplyAdded sera déclenché automatiquement par le canal temps réel
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      toast.error('Erreur lors de l\'ajout de la réponse');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-6 glass-card border border-white/20 rounded-xl backdrop-blur-md">
        <p className="text-white/80 mb-4">Connectez-vous pour participer à la discussion</p>
        <Button 
          onClick={() => navigate('/auth')}
          className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80 transition-colors"
        >
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <Card id="reply-form" className="glass-card border-white/20 shadow-lg backdrop-blur-md">
      <CardHeader className={`pb-2 ${replyingTo ? 'border-b border-white/10' : ''}`}>
        <CardTitle className="text-lg flex justify-between items-center">
          <span className="text-white">
            {replyingTo ? 'Répondre au commentaire' : 'Ajouter une réponse'}
          </span>
          {replyingTo && (
            <Button variant="ghost" size="icon" onClick={onCancelReply} className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10">
              <X size={16} />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-4">
          <Textarea
            placeholder="Partagez votre avis..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-white/5 border-white/20 focus-visible:ring-startupia-turquoise text-white/90 resize-none"
          />
        </CardContent>
        <CardFooter className="flex justify-end pt-2 border-t border-white/10">
          <Button 
            type="submit" 
            disabled={isSubmitting || content.trim() === ''} 
            className="flex items-center gap-2 bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80 transition-colors"
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

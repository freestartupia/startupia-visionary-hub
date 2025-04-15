
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addComment } from '@/services/comments/commentService';
import { supabase } from '@/integrations/supabase/client';

interface CommentFormProps {
  startupId: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ startupId, onCommentAdded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  useEffect(() => {
    // Récupérer les données du profil de l'utilisateur connecté
    const fetchUserProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          setUserProfile(data);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour laisser un commentaire.",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Commentaire vide",
        description: "Veuillez écrire un commentaire avant de soumettre.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Utiliser les informations du profil pour le nom complet et l'avatar
      const fullName = userProfile 
        ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() 
        : user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur';
      
      const avatarUrl = userProfile?.avatar_url || user.user_metadata?.avatar_url;
      
      await addComment({
        startupId,
        content,
        userId: user.id,
        userName: fullName,
        userAvatar: avatarUrl
      });
      
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès."
      });
      
      setContent('');
      onCommentAdded();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du commentaire.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="glass-card border border-white/10 p-6 rounded-lg mb-8 text-center">
        <p className="text-white/80 mb-4">Vous devez être connecté pour laisser un commentaire.</p>
        <Button asChild className="bg-startupia-turquoise hover:bg-startupia-turquoise/90">
          <a href="/auth">Se connecter</a>
        </Button>
      </div>
    );
  }

  const fullName = userProfile 
    ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() 
    : user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur';
  
  const avatarUrl = userProfile?.avatar_url || user.user_metadata?.avatar_url;
  const initials = fullName !== 'Utilisateur' ? fullName.charAt(0) : 'U';

  return (
    <form onSubmit={handleSubmit} className="glass-card border border-white/10 p-6 rounded-lg mb-8">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={fullName} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-lg font-bold text-startupia-turquoise">
              {initials.toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <Textarea
            placeholder="Partagez votre avis sur cette startup..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none mb-3 bg-transparent border-white/20 focus-visible:ring-startupia-turquoise"
            rows={3}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi...' : 'Publier le commentaire'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;

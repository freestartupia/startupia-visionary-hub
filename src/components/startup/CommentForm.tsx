
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
        console.log('Récupération du profil utilisateur pour', user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          console.log('Profil utilisateur récupéré:', data);
          setUserProfile(data);
        } else {
          console.error('Erreur lors de la récupération du profil:', error);
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
      let fullName = 'Utilisateur';
      let avatarUrl = null;
      
      if (userProfile) {
        // Si nous avons un profil, utiliser ces données
        const firstName = userProfile.first_name || '';
        const lastName = userProfile.last_name || '';
        fullName = `${firstName} ${lastName}`.trim();
        avatarUrl = userProfile.avatar_url;
        
        // Si le nom complet est vide, essayer d'utiliser les métadonnées de l'utilisateur
        if (!fullName || fullName === '') {
          fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur';
        }
      } else {
        // Sinon, utiliser les métadonnées de l'utilisateur
        fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur';
        avatarUrl = user.user_metadata?.avatar_url;
      }
      
      console.log('Ajout de commentaire avec nom:', fullName, 'et avatar:', avatarUrl);
      
      await addComment({
        startupId,
        content,
        userId: user.id,
        userName: fullName !== '' ? fullName : 'Utilisateur',
        userAvatar: avatarUrl
      });
      
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès."
      });
      
      setContent('');
      // onCommentAdded sera déclenché automatiquement par le canal temps réel
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
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

  // Déterminer le nom complet et l'avatar de l'utilisateur
  let fullName = 'Utilisateur';
  let avatarUrl = null;
  
  if (userProfile) {
    const firstName = userProfile.first_name || '';
    const lastName = userProfile.last_name || '';
    fullName = `${firstName} ${lastName}`.trim();
    
    if (!fullName || fullName === '') {
      fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'Utilisateur';
    }
    
    avatarUrl = userProfile.avatar_url;
  } else if (user) {
    fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Utilisateur';
    avatarUrl = user.user_metadata?.avatar_url;
  }
  
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

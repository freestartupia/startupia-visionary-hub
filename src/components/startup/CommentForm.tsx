
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { addStartupComment } from "@/services/comments/commentService";

interface CommentFormProps {
  startupId: string;
  onCommentAdded: () => void;
}

const CommentForm = ({ startupId, onCommentAdded }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vous devez être connecté pour laisser un commentaire");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userName = user.user_metadata?.first_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
        : user.email || 'Utilisateur';
      
      const result = await addStartupComment(
        startupId,
        content,
        user.id,
        userName,
        user.user_metadata?.avatar_url
      );
      
      if (result) {
        toast.success("Commentaire ajouté avec succès");
        setContent('');
        onCommentAdded();
      } else {
        toast.error("Erreur lors de l'ajout du commentaire");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <div className="bg-black/40 border border-startupia-turquoise/20 rounded-md p-4 mb-6 text-center">
        <p className="text-white/70 mb-2">Connectez-vous pour laisser un commentaire</p>
        <Button 
          variant="default" 
          className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black"
          onClick={() => window.location.href = '/auth'}>
          Se connecter
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-black/40 border border-startupia-turquoise/20 rounded-md p-4 mb-6">
      <h3 className="text-lg font-medium mb-2">Laisser un commentaire</h3>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Partagez votre avis sur cette startup..."
        className="mb-3 bg-black/50 border-startupia-turquoise/30 text-white"
        rows={4}
      />
      <Button 
        type="submit" 
        disabled={isSubmitting || !content.trim()}
        className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black">
        {isSubmitting ? 'Envoi en cours...' : 'Publier'}
      </Button>
    </form>
  );
};

export default CommentForm;

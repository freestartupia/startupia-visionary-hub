
import React, { useState } from 'react';
import { PlusCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CreateForumPost from '../CreateForumPost';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ForumEmptyStateProps {
  onPostCreated: () => void;
}

const ForumEmptyState: React.FC<ForumEmptyStateProps> = ({ onPostCreated }) => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNewPostClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setIsCreatingPost(true);
  };

  const handlePostSuccess = () => {
    setIsCreatingPost(false);
    onPostCreated();
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center py-16 px-4 glass-card border border-white/20 rounded-xl backdrop-blur-md">
        <MessageSquare className="h-16 w-16 mb-4 text-white/30" />
        <h3 className="text-2xl font-semibold mb-2 text-white">Aucune discussion pour le moment</h3>
        <p className="text-white/70 text-center max-w-md mb-6">
          Soyez le premier à partager votre expertise, poser une question ou lancer une discussion sur l'IA.
        </p>
        <Button 
          onClick={handleNewPostClick}
          className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80 transition-colors flex items-center gap-2"
          size="lg"
        >
          <PlusCircle className="h-5 w-5" />
          Commencer une discussion
        </Button>
      </div>

      <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
        <DialogContent className="sm:max-w-2xl bg-black/90 border-white/20 text-white">
          <DialogTitle className="text-xl font-bold text-white">Créer une nouvelle discussion</DialogTitle>
          <DialogDescription className="text-white/70">
            Partagez vos idées, questions ou expériences avec la communauté.
          </DialogDescription>
          <CreateForumPost onSuccess={handlePostSuccess} onCancel={() => setIsCreatingPost(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForumEmptyState;

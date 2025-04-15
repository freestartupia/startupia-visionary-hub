
import React, { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CreateForumPost from '../CreateForumPost';

interface ForumHeaderProps {
  onSearch: (query: string) => void;
  onPostCreated: () => void;
}

const ForumHeader: React.FC<ForumHeaderProps> = ({ onSearch, onPostCreated }) => {
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
      <Card className="glass-card border-white/20 shadow-lg backdrop-blur-lg mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-2/3 relative">
              <Input
                placeholder="Rechercher dans le forum..."
                className="pl-10 bg-white/5 border-white/20 text-white focus-visible:ring-startupia-turquoise"
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
            </div>
            <Button 
              onClick={handleNewPostClick}
              className="w-full md:w-auto bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80 transition-colors flex items-center"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Nouvelle discussion
            </Button>
          </div>
        </CardContent>
      </Card>

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

export default ForumHeader;

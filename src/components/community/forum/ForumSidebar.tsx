
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Flame, Users, Book, MessageSquare, Settings, Info, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ForumSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const userInitials = user 
    ? getInitials(user.user_metadata?.full_name || user.email || 'User')
    : 'U';
  
  const userName = user
    ? user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
    : 'Non connecté';

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="w-[280px] min-h-[calc(100vh-80px)] bg-black/60 border-r border-white/20 p-4 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 mb-2"
            onClick={() => navigate('/community')}
          >
            <Home className="mr-2 h-5 w-5 text-startupia-turquoise" />
            Accueil Forum
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 mb-2"
          >
            <Flame className="mr-2 h-5 w-5 text-white/70" />
            Populaires
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 mb-2"
          >
            <MessageSquare className="mr-2 h-5 w-5 text-white/70" />
            Récents
          </Button>
        </div>
        
        <Separator className="my-4 bg-white/20" />
        
        <div className="mb-4">
          <h3 className="font-semibold text-white/80 px-3 py-2 text-sm">CATÉGORIES</h3>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
              Général
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
              Tech & Dev IA
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
              Startups IA
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
              Prompt Engineering
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/10">
              No-code & IA
            </Button>
          </div>
        </div>
        
        <Separator className="my-4 bg-white/20" />
        
        <div className="mb-4">
          <h3 className="font-semibold text-white/80 px-3 py-2 text-sm">STARTUPIA</h3>
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white/80 hover:bg-white/10"
              onClick={() => navigate('/community')}
            >
              <Users className="mr-2 h-5 w-5" />
              Communauté
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white/80 hover:bg-white/10"
              onClick={() => navigate('/tools')}
            >
              <Settings className="mr-2 h-5 w-5" />
              Outils IA
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white/80 hover:bg-white/10"
              onClick={() => navigate('/blog')}
            >
              <Book className="mr-2 h-5 w-5" />
              Blog
            </Button>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-white/20">
          {user ? (
            <div className="flex items-center p-2">
              <Avatar className="h-9 w-9 mr-2 border border-white/20">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userName} />
                ) : (
                  <AvatarFallback className="bg-startupia-turquoise/30 text-white">{userInitials}</AvatarFallback>
                )}
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-white/60 truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <Button 
              className="w-full bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80"
              onClick={() => navigate('/auth')}
            >
              Se connecter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumSidebar;

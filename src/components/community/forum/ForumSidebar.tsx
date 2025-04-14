
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getForumPosts } from '@/services/forumService';
import { ForumPost } from '@/types/community';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { ArrowLeft, MessageCircle, TrendingUp, Clock, Pin, ListFilter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-mobile';

const ForumSidebar = () => {
  const [recentPosts, setRecentPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await getForumPosts();
        // Sort by date (most recent first)
        const sortedPosts = [...posts].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentPosts(sortedPosts.slice(0, 10));
      } catch (error) {
        console.error('Erreur lors du chargement des posts récents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM', { locale: fr });
    } catch (error) {
      return 'date inconnue';
    }
  };

  const handleGoBack = () => {
    navigate('/community?tab=forum');
  };

  // Determine if we're on the forum list or a specific post
  const isPostDetail = location.pathname.includes('/post/');

  return (
    <Sidebar 
      className="border-r border-white/10 overflow-hidden" 
      collapsible={isMobile ? "offcanvas" : "icon"}
      variant={isMobile ? "sidebar" : "inset"}
    >
      <SidebarHeader className="px-4 py-3 border-b border-white/10">
        <button 
          onClick={handleGoBack}
          className="flex items-center gap-2 text-sm font-medium hover:text-startupia-turquoise transition-colors"
        >
          {isPostDetail && <ArrowLeft size={16} />}
          <MessageCircle size={16} className="shrink-0" />
          <span className="truncate">Forum IA</span>
        </button>
      </SidebarHeader>
      
      <SidebarContent>
        {isPostDetail && (
          <div className="px-4 py-2 md:hidden">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGoBack}
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Retour au forum
            </Button>
          </div>
        )}
      
        <SidebarGroup>
          <SidebarGroupLabel>
            <Clock size={14} className="mr-1 shrink-0" />
            Posts récents
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <div className="w-full px-2 py-1.5">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </SidebarMenuItem>
                ))
              ) : (
                recentPosts.map(post => (
                  <SidebarMenuItem key={post.id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={post.title}
                      isActive={location.pathname.includes(`/post/${post.id}`)}
                    >
                      <a 
                        href={`/community/post/${post.id}`}
                        className="flex flex-col items-start"
                      >
                        <span className="text-sm truncate w-full font-medium">
                          {post.isPinned && <Pin size={12} className="inline mr-1 text-startupia-turquoise" />}
                          {post.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <span>{formatDate(post.createdAt)}</span>
                          <span>•</span>
                          <span>{post.replies?.length || 0} réponses</span>
                        </div>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>
            <TrendingUp size={14} className="mr-1 shrink-0" />
            Posts populaires
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <div className="w-full px-2 py-1.5">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </SidebarMenuItem>
                ))
              ) : (
                [...recentPosts]
                  .sort((a, b) => b.likes - a.likes)
                  .slice(0, 5)
                  .map(post => (
                    <SidebarMenuItem key={post.id}>
                      <SidebarMenuButton
                        asChild
                        tooltip={post.title}
                        isActive={location.pathname.includes(`/post/${post.id}`)}
                      >
                        <a 
                          href={`/community/post/${post.id}`}
                          className="flex flex-col items-start"
                        >
                          <span className="text-sm truncate w-full font-medium">{post.title}</span>
                          <div className="flex items-center gap-2 text-xs text-white/60">
                            <span>{post.likes} likes</span>
                            <span>•</span>
                            <span>{post.views} vues</span>
                          </div>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>
            <ListFilter size={14} className="mr-1 shrink-0" />
            Catégories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {['IA Générative', 'Startups', 'Business', 'Développement', 'Éthique'].map(category => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton
                    asChild
                    tooltip={category}
                  >
                    <a 
                      href={`/community?tab=forum&category=${encodeURIComponent(category)}`}
                      className="flex items-center"
                    >
                      <span className="text-sm">{category}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ForumSidebar;

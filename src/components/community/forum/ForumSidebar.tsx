
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@/components/ui/sidebar';
import { MessageCircle, TrendingUp, Clock, Pin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ForumSidebar = () => {
  const [recentPosts, setRecentPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await getForumPosts();
        // Trier par date (plus récent en premier)
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

  return (
    <Sidebar className="border-r border-white/10" variant="sidebar" collapsible="icon">
      <SidebarHeader className="px-4 py-3 border-b border-white/10">
        <button 
          onClick={handleGoBack}
          className="text-sm font-medium hover:text-startupia-turquoise transition-colors flex items-center gap-2"
        >
          <MessageCircle size={16} />
          <span>Forum IA</span>
        </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Clock size={14} className="mr-1" />
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

        <SidebarGroup>
          <SidebarGroupLabel>
            <TrendingUp size={14} className="mr-1" />
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
      </SidebarContent>
    </Sidebar>
  );
};

export default ForumSidebar;

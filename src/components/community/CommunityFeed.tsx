
import React, { useEffect, useState } from 'react';
import { MessageSquare, Briefcase, BookOpen, Rocket, MessageCircle, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CommunityActivity } from '@/types/community';
import { mockActivityFeed } from '@/data/mockCommunityData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { usePagination } from '@/hooks/usePagination';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-message';

interface CommunityFeedProps {
  requireAuth?: boolean;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ requireAuth = false }) => {
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Setup pagination
  const pagination = usePagination({ initialPageSize: 5 });
  
  // Load activities
  useEffect(() => {
    fetchActivities();
  }, []);
  
  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setActivities(mockActivityFeed);
      pagination.setTotal(mockActivityFeed.length);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching activity feed:', err);
      setError("Impossible de charger le fil d'activité");
      setIsLoading(false);
    }
  };
  
  // Get paginated activities
  const paginatedActivities = activities.slice(
    pagination.pageItems.skip,
    pagination.pageItems.skip + pagination.pageItems.take
  );
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'post': return <MessageSquare className="h-5 w-5 text-blue-400" />;
      case 'service': return <Briefcase className="h-5 w-5 text-purple-400" />;
      case 'resource': return <BookOpen className="h-5 w-5 text-yellow-400" />;
      case 'project': return <Rocket className="h-5 w-5 text-green-400" />;
      case 'comment': return <MessageCircle className="h-5 w-5 text-cyan-400" />;
      default: return null;
    }
  };
  
  const getActivityText = (type: string) => {
    switch(type) {
      case 'post': return 'a créé une discussion';
      case 'service': return 'propose un nouveau service';
      case 'resource': return 'a partagé une ressource';
      case 'project': return 'a lancé un projet';
      case 'comment': return 'a commenté une discussion';
      default: return 'a été actif';
    }
  };
  
  const getTargetUrl = (activity: CommunityActivity) => {
    switch(activity.targetType) {
      case 'forum': return `/community?tab=forum&id=${activity.targetId}`;
      case 'service': return `/community?tab=services&id=${activity.targetId}`;
      case 'resource': return `/community?tab=resources&id=${activity.targetId}`;
      case 'project': return `/community?tab=projects&id=${activity.targetId}`;
      default: return '#';
    }
  };

  const handleRefresh = async () => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour actualiser le fil d'activité");
      navigate('/auth');
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Shuffle the array to simulate new content
      const shuffled = [...mockActivityFeed]
        .sort(() => 0.5 - Math.random())
        .map(activity => ({
          ...activity,
          createdAt: new Date().toISOString()
        }));
      
      setActivities(shuffled);
      pagination.setTotal(shuffled.length);
      pagination.goToPage(1); // Reset to first page
      toast.success("Actualisation réussie !");
    } catch (err) {
      console.error('Error refreshing activity feed:', err);
      toast.error("Erreur lors de l'actualisation");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleLoadMore = async () => {
    // Simulate loading more items
    setIsRefreshing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Increment page size to show more items
      pagination.setPageSize(pagination.pageSize + 5);
      toast.success("Contenu supplémentaire chargé");
    } catch (err) {
      console.error('Error loading more activities:', err);
      toast.error("Erreur de chargement");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Activité récente</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualisation...
            </>
          ) : (
            "Actualiser"
          )}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage 
          message={error} 
          onRetry={fetchActivities}
        />
      ) : (
        <div className="space-y-4">
          {paginatedActivities.map((activity) => (
            <Card key={activity.id} className="glass-card overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                          <AvatarFallback>{getInitials(activity.userName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.userName}</span>
                            {' '}
                            <span className="text-white/60">{getActivityText(activity.type)}</span>
                          </p>
                          <div className="flex items-center text-xs text-white/60">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(activity.createdAt)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{activity.targetType}</Badge>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="font-semibold text-base">{activity.title}</h4>
                      <p className="text-white/80 text-sm mt-1">{activity.summary}</p>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <a href={getTargetUrl(activity)}>
                          Voir plus
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="text-center my-8">
            <Button 
              onClick={handleLoadMore} 
              disabled={isRefreshing || paginatedActivities.length >= activities.length}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Voir plus d'activités"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;

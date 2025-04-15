
import React from 'react';
import { MessageSquare, Briefcase, BookOpen, Rocket, MessageCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CommunityActivity } from '@/types/community';
import { mockActivityFeed } from '@/data/mockCommunityData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CommunityFeedProps {
  requireAuth?: boolean;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ requireAuth = false }) => {
  const activities = mockActivityFeed;
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
    if (!activity.targetType || !activity.targetId) return '#';
    
    switch(activity.targetType) {
      case 'forum': return `/community?tab=forum&id=${activity.targetId}`;
      case 'service': return `/community?tab=services&id=${activity.targetId}`;
      case 'resource': return `/community?tab=resources&id=${activity.targetId}`;
      case 'project': return `/community?tab=projects&id=${activity.targetId}`;
      default: return '#';
    }
  };

  const handleRefresh = () => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour actualiser le fil d'activité");
      navigate('/auth');
      return;
    }
    
    toast.success("Actualisation en cours...");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Activité récente</h3>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          Actualiser
        </Button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
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
                    <Badge variant="outline" className="text-xs">{activity.targetType || 'activity'}</Badge>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="font-semibold text-base">{activity.title}</h4>
                    <p className="text-white/80 text-sm mt-1">{activity.summary || activity.content}</p>
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
          <Button>Voir plus d'activités</Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;

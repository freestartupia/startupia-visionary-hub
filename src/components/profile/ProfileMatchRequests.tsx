
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getUserMatchNotifications, updateMatchNotificationStatus } from '@/services/cofounderService';
import { MatchNotification } from '@/types/cofounders';
import { useAuth } from '@/contexts/AuthContext';

const ProfileMatchRequests = () => {
  const [notifications, setNotifications] = useState<MatchNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getUserMatchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Impossible de charger vos notifications');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleAccept = async (notificationId: string) => {
    try {
      await updateMatchNotificationStatus(notificationId, 'accepted');
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, status: 'accepted' } : notif
        )
      );
      toast.success('Demande acceptée');
    } catch (error) {
      console.error('Error accepting match request:', error);
      toast.error('Erreur lors de l\'acceptation de la demande');
    }
  };

  const handleReject = async (notificationId: string) => {
    try {
      await updateMatchNotificationStatus(notificationId, 'rejected');
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, status: 'rejected' } : notif
        )
      );
      toast.success('Demande rejetée');
    } catch (error) {
      console.error('Error rejecting match request:', error);
      toast.error('Erreur lors du refus de la demande');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium">Aucune demande de connection</h3>
          <p className="text-gray-400 mt-1">
            Vous n'avez pas encore de demandes de connection
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notifications.map(notification => {
          const isPending = notification.status === 'pending';
          const isFromCurrentUser = notification.senderId === user?.id;
          
          return (
            <Card key={notification.id} className="bg-black border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-startupia-turquoise text-black">
                      {notification.senderName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg flex flex-wrap items-center gap-2">
                      {isFromCurrentUser ? (
                        <>Vous avez envoyé une demande</>
                      ) : (
                        <>{notification.senderName} vous a envoyé une demande</>
                      )}
                      
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        notification.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                        notification.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {notification.status === 'pending' ? 'En attente' : 
                         notification.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                      </span>
                    </h3>
                    
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(notification.dateCreated).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    
                    {notification.message && (
                      <p className="mt-2 text-sm border-l-2 border-gray-700 pl-3 italic">
                        "{notification.message}"
                      </p>
                    )}
                  </div>
                  
                  {!isFromCurrentUser && isPending && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleAccept(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="border border-gray-800">
      <CardHeader>
        <CardTitle>Demandes de connexion</CardTitle>
        <CardDescription>
          Gérez vos demandes de connexion et de collaboration
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default ProfileMatchRequests;

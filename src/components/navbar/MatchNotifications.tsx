
import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MatchNotification } from '@/types/cofounders';
import { getUserMatchNotifications, updateMatchNotificationStatus } from '@/services/cofounderService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MatchNotifications = () => {
  const [notifications, setNotifications] = useState<MatchNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Charger les notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getUserMatchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer le nombre de notifications non lues (status: pending)
  const pendingCount = notifications.filter(
    n => n.status === 'pending' && n.recipientId === user?.id
  ).length;

  // Gérer les actions sur les notifications
  const handleAcceptMatch = async (notificationId: string, senderName: string) => {
    try {
      await updateMatchNotificationStatus(notificationId, 'accepted');
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, status: 'accepted' } : n
      ));
      toast.success(`Vous avez accepté la demande de contact de ${senderName}`);
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande:", error);
      toast.error("Une erreur est survenue lors de l'acceptation de la demande");
    }
  };

  const handleRejectMatch = async (notificationId: string) => {
    try {
      await updateMatchNotificationStatus(notificationId, 'rejected');
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, status: 'rejected' } : n
      ));
      toast.success("Demande de contact rejetée");
    } catch (error) {
      console.error("Erreur lors du rejet de la demande:", error);
      toast.error("Une erreur est survenue lors du rejet de la demande");
    }
  };

  // Formatter la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {pendingCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[16px] h-4 text-xs bg-startupia-turquoise text-black">
              {pendingCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black border border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Notifications</h3>
          <Button variant="ghost" size="sm" onClick={fetchNotifications} disabled={loading}>
            {loading ? "..." : "Actualiser"}
          </Button>
        </div>

        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              Aucune notification
            </div>
          ) : (
            notifications.map(notification => {
              const isRecipient = notification.recipientId === user.id;
              return (
                <div key={notification.id} className="p-2 border border-gray-800 rounded bg-black/60">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm">
                        {isRecipient ? (
                          <span><strong>{notification.senderName}</strong> souhaite vous contacter</span>
                        ) : (
                          <span>Vous avez demandé à contacter <strong>[Contact]</strong></span>
                        )}
                      </p>
                      {notification.message && (
                        <p className="text-xs text-gray-400 mt-1 italic">"{notification.message}"</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{formatDate(notification.dateCreated)}</p>
                    </div>
                    <Badge 
                      className={`${
                        notification.status === 'accepted' ? 'bg-green-600' :
                        notification.status === 'rejected' ? 'bg-red-600' :
                        'bg-yellow-600'
                      } text-white text-xs`}
                    >
                      {notification.status === 'accepted' ? 'Accepté' :
                       notification.status === 'rejected' ? 'Refusé' :
                       'En attente'}
                    </Badge>
                  </div>

                  {isRecipient && notification.status === 'pending' && (
                    <div className="flex justify-end gap-2 mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => handleRejectMatch(notification.id)}
                      >
                        Refuser
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 text-xs bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80"
                        onClick={() => handleAcceptMatch(notification.id, notification.senderName)}
                      >
                        Accepter
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MatchNotifications;

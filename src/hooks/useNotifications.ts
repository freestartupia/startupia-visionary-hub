
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchUserNotifications, 
  getUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  Notification 
} from '@/services/notificationService';
import { toast } from 'sonner';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('Chargement des notifications pour:', user.id);
      const notifs = await fetchUserNotifications();
      setNotifications(notifs);
      
      const count = await getUnreadCount();
      setUnreadCount(count);
      console.log('Nombre de notifications non lues:', count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;
    
    loadNotifications();
    
    console.log('Configuration du canal de notification pour:', user.id);
    
    // Subscribe to changes on the notifications table
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Nouvelle notification reçue:', payload);
          // Update notifications
          loadNotifications();
          
          // Show toast notification
          const newNotification = payload.new as Notification;
          toast({
            title: 'Nouvelle notification',
            description: `${newNotification.sender_name || 'Quelqu\'un'} ${newNotification.content || 'a interagi avec votre contenu'}`,
            position: 'top-right'
          });
        }
      )
      .subscribe((status) => {
        console.log('Statut de l\'abonnement aux notifications:', status);
      });
    
    return () => {
      console.log('Nettoyage du canal de notification');
      supabase.removeChannel(channel);
    };
  }, [user, loadNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    return success;
  }, []);

  const markAllAsRead = useCallback(async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    }
    return success;
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead
  };
};

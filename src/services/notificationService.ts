
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  recipient_id: string;
  sender_id: string | null;
  sender_name: string | null;
  sender_avatar: string | null;
  type: 'forum_comment' | 'startup_comment';
  entity_id: string;
  entity_type: 'forum_post' | 'startup';
  content: string | null;
  is_read: boolean;
  created_at: string;
}

export const fetchUserNotifications = async (limit = 20): Promise<Notification[]> => {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Aucun utilisateur connecté');
      return [];
    }
    
    console.log('Récupération des notifications pour:', user.id);
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    console.log('Notifications récupérées:', data);
    return data || [];
  } catch (error) {
    console.error('Error in fetchUserNotifications:', error);
    return [];
  }
};

export const getUnreadCount = async (): Promise<number> => {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return 0;
    }
    
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .eq('is_read', false);
      
    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getUnreadCount:', error);
    return 0;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
      
    if (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return false;
  }
};

export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    // Notifier l'utilisateur que le processus a commencé
    toast({
      title: "Suppression des notifications...",
    });
    
    // Suppression de toutes les notifications de l'utilisateur
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('recipient_id', user.id);
      
    if (error) {
      console.error('Error deleting all notifications:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression des notifications",
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Notifications supprimées avec succès",
    });
    
    return true;
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error);
    toast({
      title: "Erreur",
      description: "Erreur lors de la suppression des notifications",
      variant: "destructive"
    });
    return false;
  }
};

export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
      
    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    return false;
  }
};

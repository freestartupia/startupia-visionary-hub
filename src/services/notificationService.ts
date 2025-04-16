
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    toast.loading('Marquage des notifications comme lues...', { id: 'mark-all-read' });
    
    const { error, data } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', user.id)
      .eq('is_read', false)
      .select('id');
      
    if (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Erreur lors du marquage des notifications', { id: 'mark-all-read' });
      return false;
    }
    
    // Vérifier que la mise à jour s'est correctement effectuée
    const updatedCount = data?.length || 0;
    
    if (updatedCount > 0) {
      toast.success(`${updatedCount} notification${updatedCount > 1 ? 's' : ''} marquée${updatedCount > 1 ? 's' : ''} comme lue${updatedCount > 1 ? 's' : ''}`, { id: 'mark-all-read' });
    } else {
      toast.success('Aucune nouvelle notification à marquer', { id: 'mark-all-read' });
    }
    
    return true;
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error);
    toast.error('Erreur lors du marquage des notifications', { id: 'mark-all-read' });
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

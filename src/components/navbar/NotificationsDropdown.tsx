
import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Check, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/services/notificationService';

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    loadNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  // Log pour debugging
  useEffect(() => {
    if (user) {
      console.log('NotificationsDropdown - Utilisateur connecté:', user.id);
      console.log('NotificationsDropdown - Nombre de notifications:', notifications.length);
      console.log('NotificationsDropdown - Nombre de notifications non lues:', unreadCount);
    }
  }, [user, notifications, unreadCount]);

  // Load notifications when the dropdown is opened
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && user) {
      console.log('Ouverture du dropdown, chargement des notifications');
      loadNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    console.log('Marquage de toutes les notifications comme lues');
    await markAllAsRead();
    // Forcer la fermeture du dropdown après suppression
    setIsOpen(false);
  };

  const handleNotificationClick = async (notification: Notification) => {
    console.log('Notification cliquée:', notification);
    
    // Mark as read if it's not already read
    if (!notification.is_read) {
      await markAsRead(notification.id);
      // Recharger les notifications après avoir marqué comme lu
      await loadNotifications();
    }
    
    // Navigate to the relevant page
    if (notification.entity_type === 'forum_post') {
      navigate(`/community/post/${notification.entity_id}`);
    } else if (notification.entity_type === 'startup') {
      navigate(`/startup/${notification.entity_id}`);
    }
    
    // Close popover
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => setIsOpen(true)}
        >
          {unreadCount > 0 ? (
            <div className="relative">
              <BellRing className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-startupia-turquoise text-black text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 max-h-[400px] overflow-auto bg-black border border-white/20 p-0"
        align="end"
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="p-4 text-center text-white/70">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-startupia-turquoise mx-auto mb-2"></div>
            <p>Chargement des notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-white/70">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-25" />
            <p>Vous n'avez pas de notifications</p>
          </div>
        ) : (
          <div>
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 border-b border-white/10 flex items-start gap-3 hover:bg-white/5 cursor-pointer transition-colors ${!notification.is_read ? 'bg-startupia-turquoise/5' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {notification.sender_avatar ? (
                    <img 
                      src={notification.sender_avatar} 
                      alt={notification.sender_name || 'User'} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-startupia-turquoise" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{notification.sender_name || 'Quelqu\'un'}</span>
                    {' '}{notification.content || 'a interagi avec votre contenu'}
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
                {!notification.is_read && (
                  <span className="w-2 h-2 rounded-full bg-startupia-turquoise mt-2"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsDropdown;

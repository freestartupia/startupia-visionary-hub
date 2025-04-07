
import { fr } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';

export const formatDate = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: fr
    });
  } catch (error) {
    return 'date inconnue';
  }
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

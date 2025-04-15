
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useSecurity } from '@/contexts/SecurityContext';
import { sanitizeText } from '@/services/securityService';

/**
 * Hook personnalisé pour effectuer des requêtes sécurisées avec React Query
 * - Surveille les erreurs de sécurité potentielles
 * - Sanitize automatiquement les réponses textuelles
 */
export function useSecureQuery<TData = unknown, TError = unknown>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'>
) {
  const { reportSecurityEvent } = useSecurity();

  // Wrapper de la fonction de requête pour surveiller les problèmes et sanitiser les réponses
  const secureQueryFn = async () => {
    try {
      const response = await queryFn();
      
      // Sanitisation des réponses textuelles pour éviter les attaques XSS
      if (typeof response === 'string') {
        return sanitizeText(response) as unknown as TData;
      }
      
      // Si la réponse est un objet ou un tableau, parcourir récursivement
      if (response && typeof response === 'object') {
        const sanitizeRecursively = (obj: any): any => {
          if (Array.isArray(obj)) {
            return obj.map(item => sanitizeRecursively(item));
          }
          
          if (obj && typeof obj === 'object') {
            const sanitizedObj: any = {};
            for (const key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (typeof obj[key] === 'string') {
                  sanitizedObj[key] = sanitizeText(obj[key]);
                } else {
                  sanitizedObj[key] = sanitizeRecursively(obj[key]);
                }
              }
            }
            return sanitizedObj;
          }
          
          return obj;
        };
        
        return sanitizeRecursively(response);
      }
      
      return response;
    } catch (error: any) {
      // Détecter les erreurs potentielles liées à la sécurité
      if (error.message && (
        error.message.includes('CORS') || 
        error.message.includes('XSS') || 
        error.message.includes('injection') ||
        error.message.includes('permission') ||
        error.message.includes('unauthorized')
      )) {
        reportSecurityEvent('query-security-error', { error: error.message, queryKey });
      }
      
      throw error;
    }
  };

  return useQuery<TData, TError>({
    queryKey,
    queryFn: secureQueryFn,
    ...options
  });
}

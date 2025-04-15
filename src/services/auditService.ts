
import { supabase } from '@/integrations/supabase/client';

type AuditEventType = 
  | 'auth.login'
  | 'auth.logout'
  | 'auth.register'
  | 'auth.password_change'
  | 'auth.password_reset'
  | 'security.suspicious_activity'
  | 'data.sensitive_access'
  | 'admin.action';

interface AuditEvent {
  event_type: AuditEventType;
  user_id?: string | null;
  ip_address?: string;
  user_agent?: string;
  details?: any;
}

/**
 * Service d'audit pour suivre les événements de sécurité importants
 */
export const logAuditEvent = async (event: AuditEvent): Promise<void> => {
  try {
    // Obtenir l'utilisateur actuel
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || event.user_id || null;
    
    // Préparer les données d'audit
    const auditData = {
      event_type: event.event_type,
      user_id: userId,
      ip_address: event.ip_address || 'unknown',
      user_agent: event.user_agent || navigator.userAgent,
      details: event.details || {},
      timestamp: new Date().toISOString()
    };
    
    // En environnement de production, enregistrer dans Supabase
    // En environnement de développement, journaliser dans la console
    if (process.env.NODE_ENV === 'production') {
      // Envoyer à Supabase (si une table d'audit existe)
      // Note: Cette partie est commentée car nous n'avons pas encore créé la table d'audit
      // const { error } = await supabase.from('security_audit_logs').insert(auditData);
      // if (error) throw error;
      
      // En attendant, enregistrer dans localStorage (en tant que solution temporaire)
      const existingLogs = JSON.parse(localStorage.getItem('security_audit_logs') || '[]');
      localStorage.setItem('security_audit_logs', JSON.stringify([...existingLogs, auditData]));
    } else {
      console.log('Audit Event:', auditData);
    }
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
};

/**
 * Récupérer les logs d'audit (pour les administrateurs uniquement)
 */
export const getAuditLogs = async (): Promise<any[]> => {
  try {
    // En environnement de production, récupérer depuis Supabase
    // En environnement de développement, récupérer depuis localStorage
    if (process.env.NODE_ENV === 'production') {
      // const { data, error } = await supabase
      //   .from('security_audit_logs')
      //   .select('*')
      //   .order('timestamp', { ascending: false });
      // if (error) throw error;
      // return data || [];
      
      // En attendant, récupérer depuis localStorage
      return JSON.parse(localStorage.getItem('security_audit_logs') || '[]');
    } else {
      return JSON.parse(localStorage.getItem('security_audit_logs') || '[]');
    }
  } catch (error) {
    console.error('Error retrieving audit logs:', error);
    return [];
  }
};

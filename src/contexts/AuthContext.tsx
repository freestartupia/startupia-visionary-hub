
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logAuditEvent } from '@/services/auditService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Show a toast when authentication state changes
        if (event === 'SIGNED_IN') {
          toast({
            title: "Connecté avec succès",
            description: "Bienvenue sur Startupia.fr",
          });
          
          // Log successful login to audit
          logAuditEvent({
            event_type: 'auth.login',
            user_id: newSession?.user?.id,
            details: { method: 'password' }
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Déconnecté",
            description: "À bientôt !",
          });
          
          // Log logout to audit
          logAuditEvent({
            event_type: 'auth.logout',
            user_id: user?.id // Using the previous user before logout
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          logAuditEvent({
            event_type: 'auth.password_reset',
            user_id: newSession?.user?.id
          });
        } else if (event === 'USER_UPDATED') {
          logAuditEvent({
            event_type: 'auth.password_change',
            user_id: newSession?.user?.id
          });
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, user?.id]);

  const handleSignOut = async () => {
    // Log before sign out while we still have the user ID
    if (user) {
      logAuditEvent({
        event_type: 'auth.logout',
        user_id: user.id
      });
    }
    
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

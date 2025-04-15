
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { validateEmail, isStrongPassword, trackLoginAttempt, cleanupLoginAttempts } from './securityService';

export type AuthError = {
  message: string;
};

export async function signUp(email: string, password: string, firstName?: string, lastName?: string) {
  try {
    // Validation de l'entrée
    if (!validateEmail(email)) {
      return { user: null, session: null, error: { message: "Format d'email invalide" } };
    }
    
    if (!isStrongPassword(password)) {
      return { 
        user: null, 
        session: null, 
        error: { 
          message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial" 
        } 
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || '',
          last_name: lastName || '',
        },
      },
    });

    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { user: null, session: null, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    // Nettoyer les anciennes tentatives
    cleanupLoginAttempts();
    
    // Vérifier si l'utilisateur n'est pas bloqué
    if (!trackLoginAttempt(email, false)) {
      return { 
        user: null, 
        session: null, 
        error: { 
          message: "Trop de tentatives échouées. Veuillez réessayer dans 30 minutes." 
        } 
      };
    }

    // Validation de l'entrée
    if (!validateEmail(email)) {
      return { user: null, session: null, error: { message: "Format d'email invalide" } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login failed:', error.message);
      return { user: null, session: null, error };
    }
    
    // Marquer la connexion comme réussie
    trackLoginAttempt(email, true);
    
    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, session: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
}

export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null, error };
  }
}

// Fonction pour mettre à jour le mot de passe avec validation
export async function updatePassword(newPassword: string) {
  try {
    if (!isStrongPassword(newPassword)) {
      return { 
        error: { 
          message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial" 
        } 
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { error };
  }
}

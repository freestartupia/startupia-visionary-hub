
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export type AuthError = {
  message: string;
};

export type UserMetadata = {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
};

export async function signUp(email: string, password: string, firstName?: string, lastName?: string) {
  try {
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
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

export async function updateUserProfile(metadata: UserMetadata) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });
    
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { user: null, error };
  }
}

export async function updateUserPassword(password: string) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error updating user password:', error);
    return { user: null, error };
  }
}

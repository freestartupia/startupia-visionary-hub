
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'moderator' | 'user';

export interface UserRoleData {
  id: string;
  userId: string;
  role: UserRole;
  createdAt: string;
}

/**
 * Check if the current authenticated user has a specific role
 */
export const checkUserHasRole = async (role: UserRole): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Error getting user:', userError);
      return false;
    }
    
    // First check if the function exists in Supabase
    const { data: isAdminData, error: isAdminError } = await supabase.rpc('is_admin');
    
    // For hardcoded admin (temporary)
    if (userData.user.email === 'skyzohd22@gmail.com') {
      return true;
    }
    
    // If the is_admin function exists and the user is an admin, return true
    if (!isAdminError && isAdminData && role === 'admin') {
      return isAdminData;
    }
    
    // Check in the user_roles table
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('role', role)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user role:', error);
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

/**
 * Get all roles for the current authenticated user
 */
export const getUserRoles = async (): Promise<UserRole[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Error getting user:', userError);
      return [];
    }
    
    // Check if user is hardcoded admin (temporary)
    if (userData.user.email === 'skyzohd22@gmail.com') {
      return ['admin'];
    }
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id);
    
    if (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
    
    return data?.map(r => r.role as UserRole) || [];
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
};

/**
 * Assign a role to a user (admin operation)
 */
export const assignRoleToUser = async (userId: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
  try {
    // Only admins can assign roles
    const isAdmin = await checkUserHasRole('admin');
    
    if (!isAdmin) {
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions pour assigner des rôles'
      };
    }
    
    // Check if user already has this role
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', role)
      .single();
    
    if (existingRole) {
      return {
        success: false,
        error: 'L\'utilisateur a déjà ce rôle'
      };
    }
    
    // Assign the role
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role
      });
    
    if (error) {
      console.error('Error assigning role:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de l\'assignation du rôle'
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error assigning role:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de l\'assignation du rôle'
    };
  }
};

/**
 * Remove a role from a user (admin operation)
 */
export const removeRoleFromUser = async (userId: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
  try {
    // Only admins can remove roles
    const isAdmin = await checkUserHasRole('admin');
    
    if (!isAdmin) {
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions pour retirer des rôles'
      };
    }
    
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    
    if (error) {
      console.error('Error removing role:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de la suppression du rôle'
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error removing role:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la suppression du rôle'
    };
  }
};

/**
 * Get all users with their roles (admin operation)
 */
export const getUsersWithRoles = async (): Promise<{ id: string; email: string; roles: UserRole[] }[]> => {
  try {
    // Only admins can view all users
    const isAdmin = await checkUserHasRole('admin');
    
    if (!isAdmin) {
      return [];
    }
    
    // We need to get users from auth.users via RPC call or admin API
    // For now, we'll get profiles and their associated roles
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        email:id,
        first_name,
        last_name
      `);
    
    if (profilesError) {
      console.error('Error getting profiles:', profilesError);
      return [];
    }
    
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (rolesError) {
      console.error('Error getting roles:', rolesError);
      return [];
    }
    
    // Map profiles to users with their roles
    return profilesData.map(profile => {
      const userRoles = rolesData
        .filter(roleData => roleData.user_id === profile.id)
        .map(roleData => roleData.role as UserRole);
      
      return {
        id: profile.id,
        email: profile.email || 'No email',
        roles: userRoles
      };
    });
  } catch (error) {
    console.error('Error getting users with roles:', error);
    return [];
  }
};

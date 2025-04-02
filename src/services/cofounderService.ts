
import { supabase } from "@/integrations/supabase/client";
import { CofounderProfile, ProfileType } from "@/types/cofounders";

export const getCofounderProfile = async (id: string): Promise<CofounderProfile> => {
  const { data, error } = await supabase
    .from('cofounder_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return mapDbProfileToCofounderProfile(data);
};

export const createCofounderProfile = async (profileData: Partial<CofounderProfile>): Promise<CofounderProfile> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    throw userError;
  }
  
  if (!userData.user) {
    throw new Error("L'utilisateur n'est pas connecté");
  }
  
  // Map CofounderProfile to database structure
  const dbProfile = {
    name: profileData.name,
    profile_type: profileData.profileType,
    role: profileData.role,
    seeking_roles: profileData.seekingRoles || [],
    pitch: profileData.pitch,
    sector: profileData.sector,
    objective: profileData.objective,
    ai_tools: profileData.aiTools || [],
    availability: profileData.availability,
    vision: profileData.vision,
    region: profileData.region,
    photo_url: profileData.photoUrl || "",
    portfolio_url: profileData.portfolioUrl || "",
    linkedin_url: profileData.linkedinUrl || "",
    website_url: profileData.websiteUrl || "",
    project_name: profileData.projectName || "",
    project_stage: profileData.projectStage || "",
    has_ai_badge: profileData.hasAIBadge || false,
    user_id: userData.user.id,
    matches: [],
    date_created: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('cofounder_profiles')
    .insert(dbProfile)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return mapDbProfileToCofounderProfile(data);
};

export const updateCofounderProfile = async (profileData: Partial<CofounderProfile>): Promise<CofounderProfile> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    throw userError;
  }
  
  if (!userData.user) {
    throw new Error("L'utilisateur n'est pas connecté");
  }
  
  // First check if the profile belongs to the user
  const { data: existingProfile, error: fetchError } = await supabase
    .from('cofounder_profiles')
    .select('*')
    .eq('id', profileData.id)
    .single();
  
  if (fetchError) {
    throw fetchError;
  }
  
  if (existingProfile.user_id !== userData.user.id) {
    throw new Error("Vous n'êtes pas autorisé à modifier ce profil");
  }
  
  // Map CofounderProfile to database structure
  const dbProfile = {
    name: profileData.name,
    profile_type: profileData.profileType,
    role: profileData.role,
    seeking_roles: profileData.seekingRoles || [],
    pitch: profileData.pitch,
    sector: profileData.sector,
    objective: profileData.objective,
    ai_tools: profileData.aiTools || [],
    availability: profileData.availability,
    vision: profileData.vision,
    region: profileData.region,
    photo_url: profileData.photoUrl || "",
    portfolio_url: profileData.portfolioUrl || "",
    linkedin_url: profileData.linkedinUrl || "",
    website_url: profileData.websiteUrl || "",
    project_name: profileData.projectName || "",
    project_stage: profileData.projectStage || "",
    has_ai_badge: profileData.hasAIBadge || false,
  };
  
  const { data, error } = await supabase
    .from('cofounder_profiles')
    .update(dbProfile)
    .eq('id', profileData.id)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return mapDbProfileToCofounderProfile(data);
};

export const deleteCofounderProfile = async (id: string): Promise<void> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    throw userError;
  }
  
  if (!userData.user) {
    throw new Error("L'utilisateur n'est pas connecté");
  }
  
  // First check if the profile belongs to the user
  const { data: existingProfile, error: fetchError } = await supabase
    .from('cofounder_profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (fetchError) {
    throw fetchError;
  }
  
  if (existingProfile.user_id !== userData.user.id) {
    throw new Error("Vous n'êtes pas autorisé à supprimer ce profil");
  }
  
  const { error } = await supabase
    .from('cofounder_profiles')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw error;
  }
};

export const getMyCofounderProfiles = async (): Promise<CofounderProfile[]> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    throw userError;
  }
  
  if (!userData.user) {
    throw new Error("L'utilisateur n'est pas connecté");
  }
  
  const { data, error } = await supabase
    .from('cofounder_profiles')
    .select('*')
    .eq('user_id', userData.user.id);
    
  if (error) {
    throw error;
  }
  
  return data.map(mapDbProfileToCofounderProfile);
};

// Helper function to map database object to CofounderProfile type
const mapDbProfileToCofounderProfile = (dbProfile: any): CofounderProfile => {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    profileType: dbProfile.profile_type as ProfileType,
    role: dbProfile.role,
    seekingRoles: dbProfile.seeking_roles || [],
    pitch: dbProfile.pitch,
    sector: dbProfile.sector,
    objective: dbProfile.objective,
    aiTools: dbProfile.ai_tools || [],
    availability: dbProfile.availability,
    vision: dbProfile.vision,
    region: dbProfile.region,
    photoUrl: dbProfile.photo_url || "",
    portfolioUrl: dbProfile.portfolio_url || "",
    linkedinUrl: dbProfile.linkedin_url || "",
    websiteUrl: dbProfile.website_url || "",
    projectName: dbProfile.project_name || "",
    projectStage: dbProfile.project_stage || "",
    dateCreated: dbProfile.date_created,
    hasAIBadge: dbProfile.has_ai_badge || false,
    matches: dbProfile.matches || []
  };
};

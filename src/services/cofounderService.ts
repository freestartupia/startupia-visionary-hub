import { supabase } from "@/integrations/supabase/client";
import { CofounderProfile, ProfileType, convertDbProfileToApp, convertAppProfileToDb } from "@/types/cofounders";
import { v4 as uuidv4 } from 'uuid';

export const getCofounderProfiles = async (): Promise<CofounderProfile[]> => {
  // Fetch user data first to get the current user ID
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  // Fetch cofounder profiles
  const { data, error } = await supabase
    .from('cofounder_profiles')
    .select('*');
    
  if (error) {
    console.error("Error fetching cofounder profiles:", error);
    throw error;
  }
  
  // Map the results to the application format
  const profiles = data.map(profile => {
    const appProfile = convertDbProfileToApp(profile);
    
    // Mark if this profile belongs to the current user
    if (userId && profile.user_id === userId) {
      console.log("Found current user's profile:", profile.id);
      appProfile.isCurrentUserProfile = true;
    }
    
    return appProfile;
  });
  
  return profiles;
};

export const getCofounderProfile = async (id: string): Promise<CofounderProfile> => {
  const { data, error } = await supabase
    .from('cofounder_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching cofounder profile:", error);
    throw error;
  }

  return convertDbProfileToApp(data);
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
    console.error("Error creating cofounder profile:", error);
    throw error;
  }
  
  return convertDbProfileToApp(data);
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
    console.error("Error fetching existing profile:", fetchError);
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
    user_id: userData.user.id, // Ensure user_id is set correctly
  };
  
  const { data, error } = await supabase
    .from('cofounder_profiles')
    .update(dbProfile)
    .eq('id', profileData.id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating cofounder profile:", error);
    throw error;
  }
  
  return convertDbProfileToApp(data);
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
    console.error("Error fetching existing profile:", fetchError);
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
    console.error("Error deleting cofounder profile:", error);
    throw error;
  }
};

export const getMyCofounderProfiles = async (): Promise<CofounderProfile[]> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error getting user:", userError);
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
    console.error("Error fetching user's cofounder profiles:", error);
    throw error;
  }
  
  return data.map(profile => convertDbProfileToApp(profile));
};

export const sendMatchRequest = async (recipientProfileId: string, message?: string): Promise<void> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    throw userError;
  }
  
  if (!userData.user) {
    throw new Error("L'utilisateur n'est pas connecté");
  }
  
  // Get the sender's profile to get the name
  const { data: senderProfiles, error: senderError } = await supabase
    .from('cofounder_profiles')
    .select('*')
    .eq('user_id', userData.user.id);
    
  if (senderError) {
    throw senderError;
  }
  
  if (!senderProfiles || senderProfiles.length === 0) {
    throw new Error("Vous devez créer un profil avant de pouvoir envoyer une demande");
  }
  
  const senderProfile = senderProfiles[0];
  
  // Get the recipient profile
  const { data: recipientProfile, error: recipientError } = await supabase
    .from('cofounder_profiles')
    .select('*')
    .eq('id', recipientProfileId)
    .single();
    
  if (recipientError) {
    throw recipientError;
  }
  
  // Create the match notification
  const { error } = await supabase
    .from('match_notifications')
    .insert({
      sender_id: senderProfile.id,
      sender_name: senderProfile.name,
      recipient_id: recipientProfileId,
      message: message || `${senderProfile.name} souhaite entrer en contact avec vous.`,
      status: 'pending'
    });
    
  if (error) {
    throw error;
  }
};

export const getMatchRequests = async (): Promise<any[]> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    throw userError;
  }
  
  if (!userData.user) {
    throw new Error("L'utilisateur n'est pas connecté");
  }
  
  // Get user's profiles
  const { data: userProfiles, error: profilesError } = await supabase
    .from('cofounder_profiles')
    .select('id')
    .eq('user_id', userData.user.id);
    
  if (profilesError) {
    throw profilesError;
  }
  
  if (!userProfiles || userProfiles.length === 0) {
    return [];
  }
  
  const profileIds = userProfiles.map(profile => profile.id);
  
  // Get match notifications for user's profiles
  const { data, error } = await supabase
    .from('match_notifications')
    .select('*')
    .in('recipient_id', profileIds);
    
  if (error) {
    throw error;
  }
  
  return data || [];
};

export const respondToMatchRequest = async (notificationId: string, accept: boolean): Promise<void> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    throw userError;
  }
  
  if (!userData.user) {
    throw new Error("L'utilisateur n'est pas connecté");
  }
  
  // Update the notification status
  const { error } = await supabase
    .from('match_notifications')
    .update({
      status: accept ? 'accepted' : 'rejected'
    })
    .eq('id', notificationId);
    
  if (error) {
    throw error;
  }
  
  if (accept) {
    // Get the notification to get sender and recipient IDs
    const { data: notification, error: notifError } = await supabase
      .from('match_notifications')
      .select('*')
      .eq('id', notificationId)
      .single();
      
    if (notifError) {
      throw notifError;
    }
    
    // Update both profiles to add each other to matches array
    // Sender profile
    const { data: senderProfile, error: senderError } = await supabase
      .from('cofounder_profiles')
      .select('*')
      .eq('id', notification.sender_id)
      .single();
      
    if (senderError) {
      throw senderError;
    }
    
    const senderMatches = [...(senderProfile.matches || []), notification.recipient_id];
    
    await supabase
      .from('cofounder_profiles')
      .update({ matches: senderMatches })
      .eq('id', notification.sender_id);
    
    // Recipient profile
    const { data: recipientProfile, error: recipientError } = await supabase
      .from('cofounder_profiles')
      .select('*')
      .eq('id', notification.recipient_id)
      .single();
      
    if (recipientError) {
      throw recipientError;
    }
    
    const recipientMatches = [...(recipientProfile.matches || []), notification.sender_id];
    
    await supabase
      .from('cofounder_profiles')
      .update({ matches: recipientMatches })
      .eq('id', notification.recipient_id);
  }
};

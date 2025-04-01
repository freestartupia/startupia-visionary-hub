
import { supabase } from '@/integrations/supabase/client';
import { CofounderProfile } from '@/types/cofounders';

interface CofounderProfileDB {
  id: string;
  name: string;
  profile_type: string;
  role: string;
  seeking_roles: string[];
  pitch: string;
  sector: string;
  objective: string;
  ai_tools: string[];
  availability: string;
  vision: string;
  region: string;
  photo_url: string;
  portfolio_url: string;
  linkedin_url: string;
  website_url: string;
  project_name?: string;
  project_stage?: string;
  has_ai_badge: boolean;
  date_created: string;
  matches: string[];
}

// Fonction pour convertir un profil DB en profil client
const convertFromDB = (profile: CofounderProfileDB): CofounderProfile => {
  return {
    id: profile.id,
    name: profile.name,
    profileType: profile.profile_type as any,
    role: profile.role as any,
    seekingRoles: profile.seeking_roles as any[],
    pitch: profile.pitch,
    sector: profile.sector as any,
    objective: profile.objective as any,
    aiTools: profile.ai_tools as any[],
    availability: profile.availability as any,
    vision: profile.vision,
    region: profile.region as any,
    photoUrl: profile.photo_url,
    portfolioUrl: profile.portfolio_url,
    linkedinUrl: profile.linkedin_url,
    websiteUrl: profile.website_url,
    projectName: profile.project_name,
    projectStage: profile.project_stage as any,
    hasAIBadge: profile.has_ai_badge,
    matches: profile.matches
  };
};

// Fonction pour convertir un profil client en profil DB
const convertToDB = (profile: CofounderProfile): Partial<CofounderProfileDB> => {
  return {
    name: profile.name,
    profile_type: profile.profileType,
    role: profile.role,
    seeking_roles: profile.seekingRoles,
    pitch: profile.pitch,
    sector: profile.sector,
    objective: profile.objective,
    ai_tools: profile.aiTools,
    availability: profile.availability,
    vision: profile.vision,
    region: profile.region,
    photo_url: profile.photoUrl,
    portfolio_url: profile.portfolioUrl,
    linkedin_url: profile.linkedinUrl,
    website_url: profile.websiteUrl,
    project_name: profile.projectName,
    project_stage: profile.projectStage,
    has_ai_badge: profile.hasAIBadge
  };
};

export const getMyCofounderProfiles = async (): Promise<CofounderProfile[]> => {
  const { user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('cofounder_profiles')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;

  return data?.map(convertFromDB) || [];
};

export const getCofounderProfile = async (id: string): Promise<CofounderProfile | null> => {
  const { data, error } = await supabase
    .from('cofounder_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return null;

  return convertFromDB(data as CofounderProfileDB);
};

export const createCofounderProfile = async (profile: Partial<CofounderProfile>): Promise<CofounderProfile> => {
  const { user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const newProfileData = {
    ...convertToDB(profile as CofounderProfile),
    user_id: user.id
  };

  const { data, error } = await supabase
    .from('cofounder_profiles')
    .insert(newProfileData)
    .select()
    .single();

  if (error) throw error;

  return convertFromDB(data as CofounderProfileDB);
};

export const updateCofounderProfile = async (profile: CofounderProfile): Promise<CofounderProfile> => {
  const { data, error } = await supabase
    .from('cofounder_profiles')
    .update(convertToDB(profile))
    .eq('id', profile.id)
    .select()
    .single();

  if (error) throw error;

  return convertFromDB(data as CofounderProfileDB);
};

export const deleteCofounderProfile = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('cofounder_profiles')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export interface MatchNotification {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  message: string;
  status: string;
  dateCreated: string;
}

export const getMyNotifications = async (): Promise<MatchNotification[]> => {
  const { user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('match_notifications')
    .select('*')
    .eq('recipient_id', user.id)
    .order('date_created', { ascending: false });

  if (error) throw error;

  return data.map((notification: any) => ({
    id: notification.id,
    senderId: notification.sender_id,
    senderName: notification.sender_name,
    recipientId: notification.recipient_id,
    message: notification.message,
    status: notification.status,
    dateCreated: notification.date_created,
  })) as MatchNotification[];
};

export const updateNotificationStatus = async (notificationId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('match_notifications')
    .update({ status })
    .eq('id', notificationId);

  if (error) throw error;
};

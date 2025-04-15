
export type ProfileType = 'collaborator' | 'project-owner';

export type Role = 
  | 'Founder' 
  | 'CTO' 
  | 'Developer' 
  | 'ML Engineer' 
  | 'Data Scientist' 
  | 'Designer' 
  | 'Prompt Engineer' 
  | 'Business Developer' 
  | 'Marketing' 
  | 'Product Manager' 
  | 'Other';

export type Sector = 
  | 'Santé' 
  | 'RH' 
  | 'Retail' 
  | 'Finance' 
  | 'Education' 
  | 'Marketing' 
  | 'Légal' 
  | 'Transport' 
  | 'Immobilier' 
  | 'Agriculture' 
  | 'Energie' 
  | 'Autre';

export type Objective = 
  | 'Créer une startup' 
  | 'Rejoindre un projet' 
  | 'Réseauter' 
  | 'Explorer des idées' 
  | 'Trouver un associé' 
  | 'Autre';

export type Availability = 
  | 'Temps plein' 
  | 'Mi-temps' 
  | 'Soirs et weekends' 
  | 'Quelques heures par semaine' 
  | 'À définir';

export type Region = 
  | 'Paris' 
  | 'Lyon' 
  | 'Marseille' 
  | 'Bordeaux' 
  | 'Lille' 
  | 'Toulouse' 
  | 'Nantes' 
  | 'Strasbourg' 
  | 'Remote' 
  | 'Autre';

export type AITool = 
  | 'Python' 
  | 'TensorFlow' 
  | 'PyTorch' 
  | 'ChatGPT' 
  | 'Claude' 
  | 'Midjourney' 
  | 'LangChain' 
  | 'Stable Diffusion' 
  | 'Hugging Face' 
  | 'No-code tools' 
  | 'Autre';

export type ProjectStage = 
  | 'Idée' 
  | 'MVP' 
  | 'Beta' 
  | 'Lancé';

export type ContactMethodType = 
  | 'email' 
  | 'linkedin' 
  | 'phone' 
  | 'other';

export interface CofounderProfile {
  id: string;
  name: string;
  role: Role;
  profileType: ProfileType;
  pitch: string;
  sector: Sector;
  objective: Objective;
  availability: Availability;
  region: Region;
  aiTools: AITool[];
  vision: string;
  photoUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  projectName?: string;
  projectStage?: ProjectStage;
  seekingRoles?: Role[];
  hasAIBadge?: boolean;
  user_id?: string;
  date_created?: string;
  matches?: string[];
  contactMethod?: string;
  contactMethodType?: ContactMethodType;
  isCurrentUserProfile?: boolean;
}

// Database structure to application structure conversion
export const convertDbProfileToApp = (dbProfile: any): CofounderProfile => {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    profileType: dbProfile.profile_type as ProfileType,
    role: dbProfile.role as Role,
    seekingRoles: dbProfile.seeking_roles as Role[] || [],
    pitch: dbProfile.pitch,
    sector: dbProfile.sector as Sector,
    objective: dbProfile.objective as Objective,
    aiTools: dbProfile.ai_tools as AITool[] || [],
    availability: dbProfile.availability as Availability,
    vision: dbProfile.vision,
    region: dbProfile.region as Region,
    photoUrl: dbProfile.photo_url,
    portfolioUrl: dbProfile.portfolio_url,
    linkedinUrl: dbProfile.linkedin_url,
    websiteUrl: dbProfile.website_url,
    projectName: dbProfile.project_name,
    projectStage: dbProfile.project_stage as ProjectStage,
    hasAIBadge: dbProfile.has_ai_badge || false,
    user_id: dbProfile.user_id,
    date_created: dbProfile.date_created,
    matches: dbProfile.matches || [],
    contactMethod: dbProfile.contact_method,
    contactMethodType: dbProfile.contact_method_type as ContactMethodType,
  };
};

// Application structure to database structure conversion
export const convertAppProfileToDb = (appProfile: Partial<CofounderProfile>): any => {
  return {
    name: appProfile.name,
    profile_type: appProfile.profileType,
    role: appProfile.role,
    seeking_roles: appProfile.seekingRoles || [],
    pitch: appProfile.pitch,
    sector: appProfile.sector,
    objective: appProfile.objective,
    ai_tools: appProfile.aiTools || [],
    availability: appProfile.availability,
    vision: appProfile.vision,
    region: appProfile.region,
    photo_url: appProfile.photoUrl || "",
    portfolio_url: appProfile.portfolioUrl || "",
    linkedin_url: appProfile.linkedinUrl || "",
    website_url: appProfile.websiteUrl || "",
    project_name: appProfile.projectName || "",
    project_stage: appProfile.projectStage || "",
    has_ai_badge: appProfile.hasAIBadge || false,
    contact_method: appProfile.contactMethod || "",
    contact_method_type: appProfile.contactMethodType || "email",
  };
};

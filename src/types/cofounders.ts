
export type ProfileType = 'project-owner' | 'collaborator';
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
  | "Santé"
  | "RH"
  | "Retail"
  | "Finance"
  | "Education"
  | "Marketing"
  | "Légal"
  | "Transport"
  | "Immobilier"
  | "Agriculture"
  | "Energie"
  | "Autre";

export type AITool = 
  | "Python"
  | "TensorFlow"
  | "PyTorch"
  | "ChatGPT"
  | "Claude"
  | "Midjourney"
  | "LangChain"
  | "Stable Diffusion"
  | "Hugging Face"
  | "No-code tools"
  | "Autre";

export type Objective = 
  | "Créer une startup"
  | "Rejoindre un projet"
  | "Réseauter"
  | "Explorer des idées"
  | "Trouver un associé"
  | "Autre";

export type Availability = 
  | "Temps plein"
  | "Mi-temps"
  | "Soirs et weekends"
  | "Quelques heures par semaine"
  | "À définir";

export type Region = 
  | "Paris"
  | "Lyon"
  | "Marseille"
  | "Bordeaux"
  | "Lille"
  | "Toulouse"
  | "Nantes"
  | "Strasbourg"
  | "Remote"
  | "Autre";

export type CofounderProfile = {
  id: string;
  name: string;
  profileType: ProfileType;
  role: Role;
  seekingRoles: Role[];
  pitch: string;
  sector: Sector;
  objective: Objective;
  aiTools: AITool[];
  availability: Availability;
  vision: string;
  region: Region;
  linkedinUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  photoUrl?: string;
  dateCreated: string;
  hasAIBadge: boolean;
  projectName?: string;
  projectStage?: 'Idée' | 'MVP' | 'Beta' | 'Lancé';
  matches: string[]; // IDs of profiles that matched with this one
};

export type MatchNotification = {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  message?: string;
  dateCreated: string;
  status: 'pending' | 'accepted' | 'rejected';
};

// Types pour le mapping des données de la base de données
export interface CofounderProfileDB {
  id: string;
  name: string;
  profile_type: ProfileType;
  role: Role;
  seeking_roles?: Role[];
  pitch: string;
  sector: Sector;
  objective: Objective;
  ai_tools?: AITool[];
  availability: Availability;
  vision: string;
  region: Region;
  linkedin_url?: string;
  portfolio_url?: string;
  website_url?: string;
  photo_url?: string;
  date_created?: string;
  has_ai_badge?: boolean;
  project_name?: string;
  project_stage?: 'Idée' | 'MVP' | 'Beta' | 'Lancé';
  matches?: string[];
}

// Fonctions helpers pour convertir entre le format DB et le format d'application
export const convertDbProfileToApp = (profile: CofounderProfileDB): CofounderProfile => ({
  id: profile.id,
  name: profile.name,
  profileType: profile.profile_type,
  role: profile.role,
  seekingRoles: profile.seeking_roles || [],
  pitch: profile.pitch,
  sector: profile.sector,
  objective: profile.objective,
  aiTools: profile.ai_tools || [],
  availability: profile.availability,
  vision: profile.vision,
  region: profile.region,
  linkedinUrl: profile.linkedin_url,
  portfolioUrl: profile.portfolio_url,
  websiteUrl: profile.website_url,
  photoUrl: profile.photo_url,
  dateCreated: profile.date_created || new Date().toISOString(),
  hasAIBadge: profile.has_ai_badge || false,
  projectName: profile.project_name,
  projectStage: profile.project_stage,
  matches: profile.matches || []
});

export const convertAppProfileToDb = (profile: CofounderProfile): CofounderProfileDB => ({
  id: profile.id,
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
  linkedin_url: profile.linkedinUrl,
  portfolio_url: profile.portfolioUrl,
  website_url: profile.websiteUrl,
  photo_url: profile.photoUrl,
  date_created: profile.dateCreated,
  has_ai_badge: profile.hasAIBadge,
  project_name: profile.projectName,
  project_stage: profile.projectStage,
  matches: profile.matches
});


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
}

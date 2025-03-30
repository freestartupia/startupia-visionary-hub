
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

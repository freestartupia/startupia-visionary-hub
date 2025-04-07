
export type ForumCategory = 
  | 'Général'
  | 'Tech & Dev IA'
  | 'Prompt Engineering'
  | 'No-code & IA'
  | 'Startups IA'
  | 'Trouver un projet / recruter'
  | 'Formations & conseils';

export type ServiceCategory =
  | 'Prompt Engineering'
  | 'Développement'
  | 'Design IA'
  | 'Automatisation'
  | 'Stratégie IA'
  | 'Formation'
  | 'Conseil'
  | 'Autre';

export type ResourceFormat =
  | 'Vidéo'
  | 'Article'
  | 'E-book'
  | 'Webinaire'
  | 'Bootcamp'
  | 'Cours'
  | 'Podcast'
  | 'Autre';

export type ProjectStatus =
  | 'Idée'
  | 'En cours'
  | 'Recherche de collaborateurs'
  | 'MVP'
  | 'Lancé';

export type UserBadge =
  | 'Membre actif'
  | 'Formateur'
  | 'Freelance IA'
  | 'Prompt Expert'
  | 'Startuper IA'
  | 'Développeur IA'
  | 'Designer IA'
  | 'Contributeur';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies: ForumReply[];
  views: number;
  isPinned?: boolean;
  isLiked?: boolean;
}

export interface ForumReply {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  parentId?: string;
  replyParentId?: string;
  isLiked?: boolean;
  nestedReplies?: ForumReply[];
}

export interface ServiceListing {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  expertise: string[];
  price?: string; // Can be a range or "Sur devis"
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  contactLink?: string; // Calendly or other booking link
  linkedinUrl?: string;
  createdAt: string;
}

export interface ResourceListing {
  id: string;
  title: string;
  description: string;
  format: ResourceFormat;
  targetAudience: string;
  accessLink: string;
  isPaid: boolean;
  price?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  communityValidated: boolean;
  votes: number;
}

export interface CollaborativeProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  skills: string[];
  // Updated field names to match the snake_case format from Supabase/mock data
  initiator_id?: string;
  initiator_name: string;
  initiator_avatar?: string;
  created_at: string;
  likes: number;
  applications: number;
  category: string;
}

export interface CommunityActivity {
  id: string;
  type: 'post' | 'service' | 'resource' | 'project' | 'comment';
  title: string;
  summary: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  targetId: string; // ID of the related content
  targetType: 'forum' | 'service' | 'resource' | 'project';
}


export interface Contributor {
  id: string;
  name: string;
  avatar?: string;
  contributions: number;
  role?: string;
  skills?: string[];
}

export type ForumCategory = 
  | "Général" 
  | "Tech & Dev IA" 
  | "Prompt Engineering" 
  | "No-code & IA" 
  | "Startups IA" 
  | "Trouver un projet / recruter" 
  | "Formations & conseils"
  | "general"
  | "announcements"
  | "questions"
  | "ideas"
  | "feedback"
  | "events"
  | "other";

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  category: ForumCategory;
  likes: number;
  views: number;
  replies: ForumReply[];
  isPinned?: boolean;
  isLocked?: boolean;
  tags?: string[];
  likedBy?: string[];
  isLiked?: boolean;
  upvotesCount?: number;
  isUpvoted?: boolean;
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
  parentId: string;
  replyParentId?: string;
  isLiked?: boolean;
  nestedReplies?: ForumReply[];
}

export interface LikeResponse {
  success: boolean;
  error?: string;
  likes: number;
  isLiked: boolean;
}

export interface UpvoteResponse {
  success: boolean;
  error?: string;
  upvotes: number;
  isUpvoted?: boolean;
}

export type ServiceCategory = 
  | "Prompt Engineering"
  | "Développement"
  | "Design IA"
  | "Automatisation"
  | "Stratégie IA"
  | "Formation"
  | "Conseil"
  | "Autre"
  | "development"
  | "design"
  | "marketing"
  | "strategy"
  | "consulting"
  | "legal"
  | "other";

export interface ServiceListing {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  contactLink?: string;
  price?: string;
  location?: string;
  isRemote?: boolean;
  createdAt: string;
  expertise?: string[];
  linkedinUrl?: string;
  contactEmail?: string;
  tags?: string[];
}

export type ResourceFormat = 
  | "Vidéo"
  | "Article"
  | "E-book"
  | "Webinaire"
  | "Bootcamp"
  | "Cours"
  | "Podcast"
  | "Autre"
  | "article"
  | "video"
  | "podcast"
  | "course"
  | "ebook"
  | "tool"
  | "library"
  | "other";

export interface ResourceListing {
  id: string;
  title: string;
  description: string;
  format: ResourceFormat;
  access_link?: string;
  url?: string;
  authorId: string;
  author_id?: string;
  authorName: string;
  author_name?: string;
  authorAvatar?: string;
  author_avatar?: string;
  createdAt: string;
  created_at?: string;
  tags?: string[];
  upvotes: number;
  votes?: number;
  views: number;
  is_paid?: boolean;
  price?: string;
  target_audience?: string;
  community_validated?: boolean;
}

export type ProjectStatus = 
  | "Idée"
  | "En cours"
  | "Recherche de collaborateurs"
  | "MVP"
  | "Lancé"
  | "planning"
  | "in-progress"
  | "completed"
  | "on-hold"
  | "abandoned";

export interface CollaborativeProject {
  id: string;
  title: string;
  description: string;
  goals?: string;
  status: ProjectStatus;
  creatorId?: string;
  creatorName?: string;
  creatorAvatar?: string;
  createdAt?: string;
  initiator_id?: string;
  initiator_name?: string;
  initiator_avatar?: string;
  created_at?: string;
  collaborators?: Contributor[];
  skills?: string[];
  timeline?: string;
  tags?: string[];
  githubUrl?: string;
  websiteUrl?: string;
  likes?: number;
  applications?: number;
  category?: string;
}

export interface CommunityActivity {
  id: string;
  type: 'post' | 'reply' | 'project' | 'service' | 'resource' | 'comment';
  title: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  content?: string;
  itemId?: string;
  targetId?: string;
  targetType?: 'forum' | 'service' | 'resource' | 'project';
  summary?: string;
}

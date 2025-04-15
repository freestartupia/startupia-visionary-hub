export interface Contributor {
  id: string;
  name: string;
  avatar?: string;
  contributions: number;
  role?: string;
  skills?: string[];
}

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

export enum ForumCategory {
  General = "general",
  Announcements = "announcements",
  Questions = "questions",
  Ideas = "ideas",
  Feedback = "feedback",
  Events = "events",
  Other = "other"
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

export interface ServiceListing {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  contactEmail: string;
  price?: string;
  location?: string;
  isRemote?: boolean;
  createdAt: string;
  tags?: string[];
}

export enum ServiceCategory {
  Development = "development",
  Design = "design",
  Marketing = "marketing",
  Strategy = "strategy",
  Consulting = "consulting",
  Legal = "legal",
  Other = "other"
}

export interface ResourceListing {
  id: string;
  title: string;
  description: string;
  format: ResourceFormat;
  url: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  tags?: string[];
  upvotes: number;
  views: number;
}

export enum ResourceFormat {
  Article = "article",
  Video = "video",
  Podcast = "podcast",
  Course = "course",
  Ebook = "ebook",
  Tool = "tool",
  Library = "library",
  Other = "other"
}

export interface CollaborativeProject {
  id: string;
  title: string;
  description: string;
  goals: string;
  status: ProjectStatus;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  createdAt: string;
  collaborators?: Contributor[];
  skills?: string[];
  timeline?: string;
  tags?: string[];
  githubUrl?: string;
  websiteUrl?: string;
}

export enum ProjectStatus {
  Planning = "planning",
  InProgress = "in-progress",
  Completed = "completed",
  OnHold = "on-hold",
  Abandoned = "abandoned"
}

export interface CommunityActivity {
  id: string;
  type: 'post' | 'reply' | 'project' | 'service' | 'resource';
  title: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  content: string;
  itemId: string;
}

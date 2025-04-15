
export interface Startup {
  id: string;
  name: string;
  shortDescription: string;
  websiteUrl: string;
  logoUrl?: string;
  category: string;
  aiTechnology?: string;
  launchDate?: string;
  createdAt: string;
  createdBy: string;
  upvotes: number;
}

export interface StartupComment {
  id: string;
  startupId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

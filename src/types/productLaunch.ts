
export type ProductLaunchStatus = 
  | "upcoming"
  | "launching_today"
  | "launched";

export type ProductLaunch = {
  id: string;
  name: string;
  logoUrl: string;
  tagline: string;
  description: string;
  launchDate: string; // ISO date string
  createdBy: string;
  creatorAvatarUrl?: string;
  websiteUrl: string;
  demoUrl?: string;
  category: string[];
  upvotes: number;
  comments: ProductComment[];
  status: ProductLaunchStatus;
  startupId?: string; // Optional reference to a startup
  mediaUrls: string[]; // URLs for screenshots or demo videos
  betaSignupUrl?: string; // URL for beta signup
  featuredOrder?: number; // If featured, what order to show it in
};

export type ProductComment = {
  id: string;
  userId: string;
  userAvatar?: string;
  userName: string;
  content: string;
  createdAt: string; // ISO date string
  replies?: ProductComment[];
  likes: number;
};

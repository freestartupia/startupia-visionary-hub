
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

export interface StartupVote {
  id: string;
  userId: string;
  startupId: string;
  createdAt: string;
}

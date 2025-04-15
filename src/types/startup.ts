export interface Startup {
  id: string;
  name: string;
  shortDescription: string;
  websiteUrl: string;
  logoUrl?: string;
  category: string;
  aiTechnology?: string;
  businessModel?: string;
  launchDate?: string;
  createdAt: string;
  createdBy: string;
  upvotes: number;
  commentCount?: number;
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

// Additional types needed for SubmitStartupModal
export type AITool = "ChatGPT" | "Claude" | "LLama" | "Stable Diffusion" | 
  "Midjourney" | "API interne" | "Hugging Face" | "Vertex AI" | "AWS Bedrock" | "Autre";

export type Sector = "Santé" | "RH" | "Retail" | "Finance" | "Education" | 
  "Marketing" | "Légal" | "Transport" | "Immobilier" | "Agriculture" | "Energie" | "Autre";

export type BusinessModel = "SaaS" | "Service" | "Marketplace" | "API" | "Freemium" |
  "B2B" | "B2C" | "B2B2C" | "Hardware" | "Autre";

export type MaturityLevel = "Idée" | "MVP" | "Seed" | "Série A" | "Série B" | 
  "Série C+" | "Profitable";

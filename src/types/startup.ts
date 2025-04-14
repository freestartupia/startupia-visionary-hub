export type FounderType = {
  name: string;
  linkedinUrl: string;
};

export type MaturityLevel = 
  | "Idée"
  | "MVP"
  | "Seed"
  | "Série A"
  | "Série B"
  | "Série C+"
  | "Profitable";

export type BusinessModel =
  | "SaaS"
  | "Service"
  | "Marketplace"
  | "API"
  | "Freemium"
  | "B2B"
  | "B2C"
  | "B2B2C"
  | "Hardware"
  | "Autre";

export type AITool =
  | "ChatGPT"
  | "Claude"
  | "LLama"
  | "Stable Diffusion"
  | "Midjourney"
  | "API interne"
  | "Hugging Face"
  | "Vertex AI"
  | "AWS Bedrock"
  | "Autre";

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

export type Startup = {
  id: string;
  name: string;
  logoUrl: string;
  shortDescription: string;
  longTermVision: string;
  founders: FounderType[];
  aiUseCases: string;
  aiTools: AITool[];
  sector: Sector;
  businessModel: BusinessModel;
  maturityLevel: MaturityLevel;
  aiImpactScore: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  websiteUrl: string;
  pitchDeckUrl?: string;
  crunchbaseUrl?: string;
  notionUrl?: string;
  dateAdded?: string; // ISO date string
  viewCount?: number;
  isFeatured?: boolean;
  fundingRounds?: FundingRound[];
  upvoteCount?: number; // Ajout du champ facultatif
};

export type FundingRound = {
  id: string;
  amount: number; // Amount in euros
  date: string; // ISO date string
  mainInvestor: string;
  round: "Pré-seed" | "Seed" | "Série A" | "Série B" | "Série C" | "Série D+" | "Growth";
  sourceUrl?: string;
};

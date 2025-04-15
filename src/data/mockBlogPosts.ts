
import { BlogPost, BlogCategory } from "@/types/blog";

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Comment Claude 3 change l'écosystème IA en France",
    slug: "claude-3-ia-france",
    excerpt: "Claude 3 d'Anthropic bouleverse l'écosystème de l'IA en France avec des capacités multimodales avancées et une meilleure compréhension du contexte.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod.",
    category: "Actualités",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    authorId: "1",
    authorName: "Marie Dupont",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    createdAt: "2024-04-10T14:48:00.000Z",
    tags: ["IA générative", "Claude 3", "LLM"],
    featured: true,
    readingTime: "4 min"
  },
  {
    id: "2",
    title: "Mistral AI lève 600 millions d'euros et devient une licorne française",
    slug: "mistral-ai-licorne-francaise",
    excerpt: "La startup française spécialisée dans l'IA générative a bouclé un tour de financement historique et rejoint le club des licornes tech.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod.",
    category: "Levées de fonds",
    coverImage: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72",
    authorId: "2",
    authorName: "Thomas Bernard",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    createdAt: "2024-04-08T09:15:00.000Z",
    tags: ["Financement", "IA française", "Licorne"],
    featured: true,
    readingTime: "5 min"
  },
  {
    id: "3",
    title: "5 outils d'IA pour automatiser votre marketing digital",
    slug: "outils-ia-marketing-digital",
    excerpt: "Découvrez comment ces 5 outils d'IA peuvent révolutionner votre stratégie marketing et gagner en productivité.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod.",
    category: "Outils",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    authorId: "3",
    authorName: "Sophie Martin",
    authorAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    createdAt: "2024-04-05T11:30:00.000Z",
    tags: ["Marketing", "Automatisation", "Outils IA"],
    readingTime: "7 min"
  },
  {
    id: "4",
    title: "Interview: Arthur Mensch, CEO de Mistral AI",
    slug: "interview-arthur-mensch-mistral-ai",
    excerpt: "Rencontre exclusive avec le fondateur et CEO de Mistral AI qui nous dévoile sa vision de l'IA en France et ses ambitions pour l'avenir.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod.",
    category: "Interviews",
    coverImage: "https://images.unsplash.com/photo-1560439514-4e9645039924",
    authorId: "2",
    authorName: "Thomas Bernard",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    createdAt: "2024-04-02T15:45:00.000Z",
    tags: ["Mistral AI", "Interview", "CEO"],
    readingTime: "8 min"
  },
  {
    id: "5",
    title: "Startup du mois : LumIA transforme l'analyse d'images médicales",
    slug: "startup-du-mois-lumia",
    excerpt: "LumIA utilise l'IA pour révolutionner le diagnostic médical par imagerie et vient de signer un partenariat avec plusieurs CHU français.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod.",
    category: "Startup du mois",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
    authorId: "1",
    authorName: "Marie Dupont",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    createdAt: "2024-03-28T10:00:00.000Z",
    tags: ["Santé", "Imagerie médicale", "IA médicale"],
    featured: true,
    readingTime: "6 min"
  },
  {
    id: "6",
    title: "Comment implémenter des LLMs dans vos applications: guide technique",
    slug: "implementer-llms-applications-guide",
    excerpt: "Guide pratique pour les développeurs souhaitant intégrer des grands modèles de langage dans leurs applications web et mobiles.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod.",
    category: "Technique",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    authorId: "4",
    authorName: "Lucas Petit",
    authorAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    createdAt: "2024-03-25T14:20:00.000Z",
    tags: ["Développement", "LLM", "Intégration"],
    readingTime: "10 min"
  },
  {
    id: "7",
    title: "3 stratégies growth pour lancer un produit IA en France",
    slug: "strategies-growth-produit-ia-france",
    excerpt: "Comment se différencier sur le marché français de l'IA de plus en plus saturé? Nos conseils pour un lancement réussi.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod, nisi vel consectetur euismod.",
    category: "Growth",
    coverImage: "https://images.unsplash.com/photo-1533750349088-cd871a92f312",
    authorId: "3",
    authorName: "Sophie Martin",
    authorAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
    createdAt: "2024-03-20T09:45:00.000Z",
    tags: ["Growth", "Marketing", "Lancement"],
    readingTime: "7 min"
  }
];

export const getAllBlogCategories = (): BlogCategory[] => {
  return ["Actualités", "Growth", "Technique", "Interviews", "Outils", "Levées de fonds", "Startup du mois"];
};

export const getRecentPosts = (count: number = 5): BlogPost[] => {
  return [...mockBlogPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return mockBlogPosts.filter(post => post.featured);
};

export const getPostsByCategory = (category: BlogCategory): BlogPost[] => {
  return mockBlogPosts.filter(post => post.category === category);
};

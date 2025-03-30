
import { 
  ForumPost, 
  ServiceListing, 
  ResourceListing, 
  CollaborativeProject,
  CommunityActivity 
} from '@/types/community';
import { v4 as uuidv4 } from 'uuid';

// Mock forum posts
export const mockForumPosts: ForumPost[] = [
  {
    id: uuidv4(),
    title: "Comment optimiser les prompts pour la génération d'images ?",
    content: "J'essaie d'améliorer mes résultats avec Midjourney et DALL-E, quelles sont vos astuces pour créer des prompts efficaces ?",
    category: 'Prompt Engineering',
    authorId: uuidv4(),
    authorName: 'Sophie Martin',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    tags: ['midjourney', 'dall-e', 'prompt', 'génération d\'images'],
    createdAt: '2023-10-15T14:22:00Z',
    likes: 24,
    replies: [
      {
        id: uuidv4(),
        content: "Pour Midjourney, essaie d'inclure des références artistiques précises, par exemple 'dans le style de Monet'. Ça donne de bons résultats !",
        authorId: uuidv4(),
        authorName: 'Thomas Legrand',
        authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        createdAt: '2023-10-15T15:10:00Z',
        likes: 12
      }
    ],
    views: 156,
    isPinned: true
  },
  {
    id: uuidv4(),
    title: "Recherche développeur pour intégration API OpenAI",
    content: "Je cherche un développeur expérimenté pour intégrer l'API OpenAI dans mon application React. Budget disponible.",
    category: 'Trouver un projet / recruter',
    authorId: uuidv4(),
    authorName: 'Alexandre Dubois',
    authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    tags: ['openai', 'api', 'react', 'développement'],
    createdAt: '2023-10-10T09:14:00Z',
    likes: 8,
    replies: [],
    views: 89
  },
  {
    id: uuidv4(),
    title: "Quelle est la meilleure architecture pour un agent IA conversationnel ?",
    content: "Je développe un assistant pour le service client et j'hésite entre différentes architectures. Quelles sont vos recommandations ?",
    category: 'Tech & Dev IA',
    authorId: uuidv4(),
    authorName: 'Marie Lefevre',
    authorAvatar: 'https://randomuser.me/api/portraits/women/18.jpg',
    tags: ['agent ia', 'llm', 'architecture', 'chatbot'],
    createdAt: '2023-10-08T11:45:00Z',
    likes: 17,
    replies: [
      {
        id: uuidv4(),
        content: "J'ai eu de bons résultats avec LangChain + VectorDB pour gérer la mémoire des conversations.",
        authorId: uuidv4(),
        authorName: 'Lucas Bernard',
        createdAt: '2023-10-08T12:30:00Z',
        likes: 6
      },
      {
        id: uuidv4(),
        content: "As-tu pensé à utiliser RAG (Retrieval Augmented Generation) ? C'est très efficace pour intégrer des données spécifiques à ton entreprise.",
        authorId: uuidv4(),
        authorName: 'Emma Rivière',
        authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        createdAt: '2023-10-08T14:05:00Z',
        likes: 9
      }
    ],
    views: 202
  },
  {
    id: uuidv4(),
    title: "Retour d'expérience : lancement d'une startup IA en 3 mois",
    content: "Je viens de lancer ma startup IA dans le domaine de la santé et je souhaite partager mon expérience avec la communauté.",
    category: 'Startups IA',
    authorId: uuidv4(),
    authorName: 'Julien Moreau',
    authorAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    tags: ['startup', 'retour d\'expérience', 'santé', 'lancement'],
    createdAt: '2023-10-05T16:34:00Z',
    likes: 42,
    replies: [
      {
        id: uuidv4(),
        content: "Super retour d'expérience ! Comment as-tu géré les aspects réglementaires dans le domaine de la santé ?",
        authorId: uuidv4(),
        authorName: 'Claire Dumas',
        authorAvatar: 'https://randomuser.me/api/portraits/women/52.jpg',
        createdAt: '2023-10-05T17:20:00Z',
        likes: 3
      }
    ],
    views: 310,
    isPinned: true
  }
];

// Mock service listings
export const mockServiceListings: ServiceListing[] = [
  {
    id: uuidv4(),
    title: "Prompt Engineering pour votre entreprise",
    description: "J'optimise vos prompts pour maximiser les résultats de vos outils IA (ChatGPT, Midjourney, DALL-E, etc.)",
    category: 'Prompt Engineering',
    expertise: ['ChatGPT', 'Midjourney', 'DALL-E', 'Stable Diffusion'],
    price: "À partir de 500€ / jour",
    providerId: uuidv4(),
    providerName: "Nicolas Lambert",
    providerAvatar: "https://randomuser.me/api/portraits/men/43.jpg",
    contactLink: "https://calendly.com/nicolas-prompt",
    linkedinUrl: "https://linkedin.com/in/nicolaslambert",
    createdAt: '2023-10-12T08:00:00Z'
  },
  {
    id: uuidv4(),
    title: "Développement d'agents IA personnalisés",
    description: "Création d'assistants IA sur mesure pour votre entreprise. Intégration avec vos outils existants.",
    category: 'Développement',
    expertise: ['LangChain', 'OpenAI', 'Python', 'API', 'Agents IA'],
    price: "Sur devis",
    providerId: uuidv4(),
    providerName: "Sarah Cohen",
    providerAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    contactLink: "https://calendly.com/sarah-ia-dev",
    linkedinUrl: "https://linkedin.com/in/sarahcohen",
    createdAt: '2023-10-08T10:15:00Z'
  },
  {
    id: uuidv4(),
    title: "Automatisation de workflows avec l'IA",
    description: "J'automatise vos processus métiers grâce à l'IA. Gain de temps et d'efficacité garantis.",
    category: 'Automatisation',
    expertise: ['Zapier', 'Make', 'n8n', 'OpenAI', 'Microsoft Power Automate'],
    price: "À partir de 1200€",
    providerId: uuidv4(),
    providerName: "Antoine Morel",
    providerAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
    contactLink: "https://calendly.com/antoine-automation",
    linkedinUrl: "https://linkedin.com/in/antoinemorel",
    createdAt: '2023-09-28T14:30:00Z'
  }
];

// Mock resources
export const mockResources: ResourceListing[] = [
  {
    id: uuidv4(),
    title: "Masterclass Prompt Engineering Avancé",
    description: "Formation complète sur les techniques avancées de prompt engineering pour GPT-4 et Claude.",
    format: 'Vidéo',
    targetAudience: "Professionnels, marketers, développeurs",
    accessLink: "https://academy.startupia.fr/prompt-advanced",
    isPaid: true,
    price: "199€",
    authorId: uuidv4(),
    authorName: "Laura Mendez",
    authorAvatar: "https://randomuser.me/api/portraits/women/63.jpg",
    createdAt: '2023-10-10T09:00:00Z',
    communityValidated: true,
    votes: 48
  },
  {
    id: uuidv4(),
    title: "Guide PDF : Créer son premier agent IA avec Langchain",
    description: "Guide pas à pas pour créer un agent IA fonctionnel avec Python et Langchain.",
    format: 'E-book',
    targetAudience: "Développeurs, débutants en IA",
    accessLink: "https://resources.startupia.fr/langchain-guide",
    isPaid: false,
    authorId: uuidv4(),
    authorName: "Maxime Dupont",
    authorAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    createdAt: '2023-09-22T15:40:00Z',
    communityValidated: true,
    votes: 127
  },
  {
    id: uuidv4(),
    title: "Webinaire : Monétiser ses compétences en IA",
    description: "Comment transformer votre expertise IA en business rentable.",
    format: 'Webinaire',
    targetAudience: "Freelances, consultants, entrepreneurs",
    accessLink: "https://events.startupia.fr/monetisation-ia",
    isPaid: false,
    authorId: uuidv4(),
    authorName: "Charlotte Girard",
    authorAvatar: "https://randomuser.me/api/portraits/women/72.jpg",
    createdAt: '2023-10-05T11:20:00Z',
    communityValidated: false,
    votes: 18
  }
];

// Mock collaborative projects
export const mockProjects: CollaborativeProject[] = [
  {
    id: uuidv4(),
    title: "Assistant IA pour médecins généralistes",
    description: "Je développe un assistant IA pour aider les médecins dans leur diagnostic. Recherche développeur Python et expert médical.",
    status: 'Recherche de collaborateurs',
    skills: ['Python', 'ML', 'Médecine', 'LLM'],
    initiatorId: uuidv4(),
    initiatorName: "Dr. Philippe Martin",
    initiatorAvatar: "https://randomuser.me/api/portraits/men/29.jpg",
    createdAt: '2023-10-08T14:00:00Z',
    likes: 32,
    applications: 5,
    category: 'Santé'
  },
  {
    id: uuidv4(),
    title: "Plateforme no-code de création d'agents IA",
    description: "Projet open-source pour permettre aux non-développeurs de créer leurs propres agents IA. Recherche contributeurs.",
    status: 'En cours',
    skills: ['React', 'Node.js', 'UX/UI', 'LangChain'],
    initiatorId: uuidv4(),
    initiatorName: "Léa Fischer",
    initiatorAvatar: "https://randomuser.me/api/portraits/women/12.jpg",
    createdAt: '2023-09-30T10:15:00Z',
    likes: 47,
    applications: 12,
    category: 'No-code'
  },
  {
    id: uuidv4(),
    title: "IA de génération de business plans personnalisés",
    description: "Idée de startup : IA qui génère des business plans détaillés adaptés au secteur et au marché cible.",
    status: 'Idée',
    skills: ['Business', 'ML', 'GPT', 'Finance'],
    initiatorId: uuidv4(),
    initiatorName: "Hugo Lemaitre",
    initiatorAvatar: "https://randomuser.me/api/portraits/men/36.jpg",
    createdAt: '2023-10-12T16:45:00Z',
    likes: 21,
    applications: 3,
    category: 'Business'
  }
];

// Mock community activity feed
export const mockActivityFeed: CommunityActivity[] = [
  {
    id: uuidv4(),
    type: 'post',
    title: "Nouveau sujet : Intelligence artificielle et éthique",
    summary: "Discussion sur les implications éthiques des systèmes IA avancés",
    userId: uuidv4(),
    userName: "Paul Leclerc",
    userAvatar: "https://randomuser.me/api/portraits/men/41.jpg",
    createdAt: '2023-10-15T14:50:00Z',
    targetId: uuidv4(),
    targetType: 'forum'
  },
  {
    id: uuidv4(),
    type: 'service',
    title: "Nouveau service : Formation GPT-4 pour entreprises",
    summary: "Formation personnalisée pour exploiter GPT-4 dans votre secteur",
    userId: uuidv4(),
    userName: "Émilie Rousseau",
    userAvatar: "https://randomuser.me/api/portraits/women/24.jpg",
    createdAt: '2023-10-14T09:30:00Z',
    targetId: uuidv4(),
    targetType: 'service'
  },
  {
    id: uuidv4(),
    type: 'resource',
    title: "Nouvelle ressource : Guide PDF sur l'IA générative",
    summary: "Tout ce que vous devez savoir sur l'IA générative et ses applications",
    userId: uuidv4(),
    userName: "Marc Dubois",
    userAvatar: "https://randomuser.me/api/portraits/men/62.jpg",
    createdAt: '2023-10-13T16:20:00Z',
    targetId: uuidv4(),
    targetType: 'resource'
  },
  {
    id: uuidv4(),
    type: 'project',
    title: "Nouveau projet : IA pour l'optimisation énergétique",
    summary: "Projet de création d'algorithme IA pour réduire la consommation d'énergie",
    userId: uuidv4(),
    userName: "Sophie Renard",
    userAvatar: "https://randomuser.me/api/portraits/women/35.jpg",
    createdAt: '2023-10-12T11:05:00Z',
    targetId: uuidv4(),
    targetType: 'project'
  },
  {
    id: uuidv4(),
    type: 'comment',
    title: "Réponse à 'Comment démarrer avec RAG?'",
    summary: "Recommandation d'outils et de tutoriels pour débuter avec RAG",
    userId: uuidv4(),
    userName: "Thomas Garcia",
    userAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
    createdAt: '2023-10-11T14:35:00Z',
    targetId: uuidv4(),
    targetType: 'forum'
  }
];

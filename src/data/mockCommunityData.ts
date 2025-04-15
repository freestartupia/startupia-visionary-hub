
import { 
  ForumPost, 
  ServiceListing, 
  ResourceListing, 
  CollaborativeProject,
  CommunityActivity,
  ForumCategory,
  ServiceCategory,
  ResourceFormat,
  ProjectStatus
} from '@/types/community';
import { v4 as uuidv4 } from 'uuid';

// Mock forum posts
export const mockForumPosts: ForumPost[] = [
  {
    id: uuidv4(),
    title: "Comment optimiser les prompts pour la génération d'images ?",
    content: "J'essaie d'améliorer mes résultats avec Midjourney et DALL-E, quelles sont vos astuces pour créer des prompts efficaces ?",
    category: "Prompt Engineering",
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
        likes: 12,
        parentId: ''
      }
    ],
    views: 156,
    isPinned: true
  },
  {
    id: uuidv4(),
    title: "Recherche développeur pour intégration API OpenAI",
    content: "Je cherche un développeur expérimenté pour intégrer l'API OpenAI dans mon application React. Budget disponible.",
    category: "Trouver un projet / recruter",
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
    category: "Tech & Dev IA",
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
        likes: 6,
        parentId: ''
      },
      {
        id: uuidv4(),
        content: "As-tu pensé à utiliser RAG (Retrieval Augmented Generation) ? C'est très efficace pour intégrer des données spécifiques à ton entreprise.",
        authorId: uuidv4(),
        authorName: 'Emma Rivière',
        authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        createdAt: '2023-10-08T14:05:00Z',
        likes: 9,
        parentId: ''
      }
    ],
    views: 202
  },
  {
    id: uuidv4(),
    title: "Retour d'expérience : lancement d'une startup IA en 3 mois",
    content: "Je viens de lancer ma startup IA dans le domaine de la santé et je souhaite partager mon expérience avec la communauté.",
    category: "Startups IA",
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
        likes: 3,
        parentId: ''
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
    title: "Développement d'agents IA personnalisés",
    description: "Je crée des assistants IA sur mesure pour votre entreprise en utilisant les dernières avancées en LLMs. Intégration avec vos outils existants, fine-tuning sur vos données internes et déploiement cloud sécurisé.",
    category: "Développement",
    expertise: ['LangChain', 'OpenAI GPT-4', 'Claude 3', 'RAG', 'Llama 3', 'Agents autonomes'],
    price: "À partir de 2500€ / projet",
    providerId: uuidv4(),
    providerName: "Thomas Lefort",
    providerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    contactLink: "https://calendly.com/thomas-lefort/30min",
    linkedinUrl: "https://linkedin.com/in/thomaslefort",
    createdAt: '2023-10-08T10:15:00Z'
  },
  {
    id: uuidv4(),
    title: "Prompt Engineering Expert - Optimisation de prompts et workflows IA",
    description: "Maximisez le potentiel des LLMs pour votre business. Je vous aide à concevoir des prompts et workflows optimaux pour ChatGPT, Claude et Midjourney. Augmentez l'efficacité de vos équipes avec des agents IA bien conçus.",
    category: "Prompt Engineering",
    expertise: ['ChatGPT', 'Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Claude', 'Agents IA'],
    price: "850€ / jour ou 3500€ / formation complète",
    providerId: uuidv4(),
    providerName: "Sophie Martin",
    providerAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    contactLink: "https://calendly.com/sophiemartin-prompt/intro",
    linkedinUrl: "https://linkedin.com/in/sophiemartin",
    createdAt: '2023-10-12T08:00:00Z'
  },
  {
    id: uuidv4(),
    title: "Consultation stratégique IA pour startups",
    description: "En tant qu'ancien directeur de l'innovation chez [Grande Entreprise Tech], j'accompagne les startups dans leur stratégie d'intégration de l'IA. Définition de votre proposition de valeur, choix technologiques, scalabilité et levée de fonds.",
    category: "Stratégie IA",
    expertise: ['Proposition de valeur', 'Go-to-market', 'Architecture IA', 'Levée de fonds', 'Scale-up'],
    price: "Sur devis (généralement 1500-2500€ / jour)",
    providerId: uuidv4(),
    providerName: "Alexandre Dubois",
    providerAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    contactLink: "https://alexandredubois.com/contact",
    linkedinUrl: "https://linkedin.com/in/alexandredubois",
    createdAt: '2023-09-28T14:30:00Z'
  }
];

// Mock resources
export const mockResources: ResourceListing[] = [
  {
    id: uuidv4(),
    title: "Formation complète : Maîtriser GPT-4 et Claude 3 pour les professionnels",
    description: "Formation en 8 modules pour maîtriser les LLMs de pointe. Apprenez à créer des prompts avancés, implémenter une stratégie IA dans votre entreprise et développer vos premiers agents autonomes.",
    format: "Cours",
    target_audience: "Professionnels, entrepreneurs, marketers",
    access_link: "https://academy.startupia.fr/gpt4-claude3-mastery",
    url: "https://academy.startupia.fr/gpt4-claude3-mastery",
    is_paid: true,
    price: "499€",
    authorId: uuidv4(),
    author_id: uuidv4(),
    authorName: "Laura Mendez",
    author_name: "Laura Mendez",
    authorAvatar: "https://randomuser.me/api/portraits/women/63.jpg",
    author_avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    createdAt: '2023-10-10T09:00:00Z',
    created_at: '2023-10-10T09:00:00Z',
    community_validated: true,
    upvotes: 142,
    votes: 142,
    views: 0
  },
  {
    id: uuidv4(),
    title: "Webinaire gratuit : Comment lancer sa startup IA en 2025",
    description: "Dans ce webinaire de 90 minutes, nous couvrons les étapes essentielles pour lancer votre startup IA : validation d'idée, choix technologiques, premiers clients, levée de fonds et stratégie de croissance.",
    format: "Webinaire",
    target_audience: "Entrepreneurs, étudiants, porteurs de projet",
    access_link: "https://events.startupia.fr/lancer-startup-ia-2025",
    url: "https://events.startupia.fr/lancer-startup-ia-2025",
    is_paid: false,
    price: null,
    authorId: uuidv4(),
    author_id: uuidv4(),
    authorName: "Marc Dubois",
    author_name: "Marc Dubois",
    authorAvatar: "https://randomuser.me/api/portraits/men/41.jpg",
    author_avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    createdAt: '2023-09-22T15:40:00Z',
    created_at: '2023-09-22T15:40:00Z',
    community_validated: true,
    upvotes: 378,
    votes: 378,
    views: 0
  },
  {
    id: uuidv4(),
    title: "Guide PDF: RAG (Retrieval Augmented Generation) pour startups",
    description: "Guide pratique de 47 pages pour implémenter RAG dans vos produits. Inclut code source, architecture, benchmarks et études de cas. Améliorez vos LLMs avec vos propres données d'entreprise.",
    format: "E-book",
    target_audience: "Développeurs, CTO, fondateurs techniques",
    access_link: "https://resources.startupia.fr/rag-guide",
    url: "https://resources.startupia.fr/rag-guide",
    is_paid: true,
    price: "39€",
    authorId: uuidv4(),
    author_id: uuidv4(),
    authorName: "Julien Moreau",
    author_name: "Julien Moreau",
    authorAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    author_avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    createdAt: '2023-10-05T11:20:00Z',
    created_at: '2023-10-05T11:20:00Z',
    community_validated: true,
    upvotes: 215,
    votes: 215,
    views: 0
  }
];

// Mock collaborative projects - updated to use snake_case consistent with Supabase structure
export const mockProjects: CollaborativeProject[] = [
  {
    id: uuidv4(),
    title: "Assistant IA pour médecins généralistes",
    description: "Je développe un assistant IA pour aider les médecins dans leur diagnostic. Recherche développeur Python et expert médical.",
    status: "Recherche de collaborateurs",
    skills: ['Python', 'ML', 'Médecine', 'LLM'],
    initiator_id: uuidv4(),
    initiator_name: "Dr. Philippe Martin",
    initiator_avatar: "https://randomuser.me/api/portraits/men/29.jpg",
    created_at: '2023-10-08T14:00:00Z',
    likes: 32,
    applications: 5,
    category: 'Santé'
  },
  {
    id: uuidv4(),
    title: "Plateforme no-code de création d'agents IA",
    description: "Projet open-source pour permettre aux non-développeurs de créer leurs propres agents IA. Recherche contributeurs.",
    status: "En cours",
    skills: ['React', 'Node.js', 'UX/UI', 'LangChain'],
    initiator_id: uuidv4(),
    initiator_name: "Léa Fischer",
    initiator_avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    created_at: '2023-09-30T10:15:00Z',
    likes: 47,
    applications: 12,
    category: 'No-code'
  },
  {
    id: uuidv4(),
    title: "IA de génération de business plans personnalisés",
    description: "Idée de startup : IA qui génère des business plans détaillés adaptés au secteur et au marché cible.",
    status: "Idée",
    skills: ['Business', 'ML', 'GPT', 'Finance'],
    initiator_id: uuidv4(),
    initiator_name: "Hugo Lemaitre",
    initiator_avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    created_at: '2023-10-12T16:45:00Z',
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

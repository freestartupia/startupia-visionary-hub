
import { ProductLaunch } from "@/types/productLaunch";

export const mockProductLaunches: ProductLaunch[] = [
  {
    id: "genius-copilot",
    name: "Genius Copilot",
    logoUrl: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=GC&font=montserrat",
    tagline: "Assistant IA multimodal pour les équipes marketing",
    description: "Genius Copilot est un assistant IA qui aide les équipes marketing à créer du contenu, analyser des campagnes et générer des insights en temps réel. Il intègre la vision et le traitement du langage pour comprendre et optimiser tous vos assets marketing.",
    launchDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    createdBy: "Marie Dupont",
    creatorAvatarUrl: "https://i.pravatar.cc/150?img=32",
    websiteUrl: "https://example.com/genius-copilot",
    demoUrl: "https://example.com/genius-copilot/demo",
    category: ["Marketing", "Productivité", "IA Générative"],
    upvotes: 58,
    comments: [
      {
        id: "comment-1",
        userId: "user-1",
        userName: "Thomas Laurent",
        userAvatar: "https://i.pravatar.cc/150?img=65",
        content: "J'ai testé la version bêta, l'intégration avec Notion est incroyable !",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        likes: 7
      }
    ],
    status: "upcoming",
    mediaUrls: [
      "https://placehold.co/800x450/2E2E2E/2EDBA0?text=Screenshot+1&font=montserrat",
      "https://placehold.co/800x450/2E2E2E/2EDBA0?text=Screenshot+2&font=montserrat"
    ],
    betaSignupUrl: "https://example.com/genius-copilot/beta"
  },
  {
    id: "neuron-labs",
    name: "Neuron Labs",
    logoUrl: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=NL&font=montserrat",
    tagline: "Plateforme no-code de création d'agents IA personnalisés",
    description: "Créez des agents IA spécialisés pour votre entreprise sans écrire une seule ligne de code. Neuron Labs vous permet de combiner des modèles de fondation avec vos données propriétaires pour obtenir des résultats inégalés.",
    launchDate: new Date().toISOString(), // Today
    createdBy: "Alexandre Martin",
    creatorAvatarUrl: "https://i.pravatar.cc/150?img=53",
    websiteUrl: "https://example.com/neuron-labs",
    category: ["No-Code", "Développement", "Agents IA"],
    upvotes: 127,
    comments: [
      {
        id: "comment-2",
        userId: "user-2",
        userName: "Sophie Mercier",
        userAvatar: "https://i.pravatar.cc/150?img=23",
        content: "Enfin une solution qui ne nécessite pas de connaissances en programmation !",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        likes: 18
      }
    ],
    status: "launching_today",
    startupId: "labelai",
    mediaUrls: [
      "https://placehold.co/800x450/2E2E2E/2EDBA0?text=Demo+Video&font=montserrat",
      "https://placehold.co/800x450/2E2E2E/2EDBA0?text=Interface&font=montserrat"
    ]
  },
  {
    id: "sentient",
    name: "Sentient",
    logoUrl: "https://placehold.co/400x400/2E2E2E/F4C770?text=S&font=montserrat",
    tagline: "Analyse émotionnelle en temps réel pour service client",
    description: "Sentient utilise l'IA pour analyser le ton, les émotions et l'intention des clients en temps réel. Une solution révolutionnaire pour améliorer la satisfaction client et optimiser les performances des équipes de support.",
    launchDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    createdBy: "Lucie Bernard",
    creatorAvatarUrl: "https://i.pravatar.cc/150?img=7",
    websiteUrl: "https://example.com/sentient",
    demoUrl: "https://example.com/sentient/demo",
    category: ["Service Client", "Analyse émotionnelle", "Temps réel"],
    upvotes: 215,
    comments: [
      {
        id: "comment-3",
        userId: "user-3",
        userName: "Marc Dubois",
        userAvatar: "https://i.pravatar.cc/150?img=12",
        content: "On utilise Sentient depuis deux semaines et nos KPIs de satisfaction client ont augmenté de 23% !",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        likes: 31
      }
    ],
    status: "launched",
    startupId: "cherry",
    mediaUrls: [
      "https://placehold.co/800x450/2E2E2E/F4C770?text=Dashboard&font=montserrat",
      "https://placehold.co/800x450/2E2E2E/F4C770?text=Analytics&font=montserrat"
    ],
    featuredOrder: 1
  },
  {
    id: "aidar",
    name: "AIdar",
    logoUrl: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=AD&font=montserrat",
    tagline: "Détection proactive des anomalies industrielles par IA",
    description: "AIdar utilise des algorithmes de pointe pour détecter les anomalies dans les systèmes industriels avant qu'elles ne causent des pannes. Réduisez vos coûts de maintenance et maximisez votre temps de fonctionnement.",
    launchDate: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    createdBy: "Jean Lefebvre",
    creatorAvatarUrl: "https://i.pravatar.cc/150?img=42",
    websiteUrl: "https://example.com/aidar",
    category: ["Industrie", "Maintenance prédictive", "IoT"],
    upvotes: 89,
    comments: [],
    status: "launched",
    startupId: "hub3e",
    mediaUrls: [
      "https://placehold.co/800x450/2E2E2E/2EDBA0?text=Interface&font=montserrat"
    ]
  }
];

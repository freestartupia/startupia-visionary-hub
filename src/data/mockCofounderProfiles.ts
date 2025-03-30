
import { CofounderProfile } from "@/types/cofounders";
import { v4 as uuidv4 } from 'uuid';

export const mockCofounderProfiles: CofounderProfile[] = [
  {
    id: uuidv4(),
    name: "Marie Durand",
    profileType: "project-owner",
    role: "Founder",
    seekingRoles: ["Developer", "ML Engineer", "CTO"],
    pitch: "Développe une plateforme IA pour aider les médecins à diagnostiquer plus rapidement les maladies rares à partir d'images médicales.",
    sector: "Santé",
    objective: "Créer une startup",
    aiTools: ["TensorFlow", "PyTorch", "ChatGPT"],
    availability: "Temps plein",
    vision: "Révolutionner le diagnostic médical avec l'IA pour réduire le temps de diagnostic des maladies rares de 5 ans à 5 jours.",
    region: "Paris",
    linkedinUrl: "https://linkedin.com/in/mariedurand",
    photoUrl: "https://randomuser.me/api/portraits/women/23.jpg",
    dateCreated: new Date().toISOString(),
    hasAIBadge: true,
    projectName: "MedVision AI",
    projectStage: "MVP",
    matches: []
  },
  {
    id: uuidv4(),
    name: "Thomas Lefèvre",
    profileType: "collaborator",
    role: "ML Engineer",
    seekingRoles: [],
    pitch: "3 ans d'expérience en deep learning appliqué à la vision par ordinateur. Passionné par l'application de l'IA au secteur médical.",
    sector: "Santé",
    objective: "Rejoindre un projet",
    aiTools: ["TensorFlow", "PyTorch", "Hugging Face"],
    availability: "Temps plein",
    vision: "Mettre mes compétences au service de projets à fort impact social grâce à l'IA.",
    region: "Lyon",
    linkedinUrl: "https://linkedin.com/in/thomaslefevre",
    portfolioUrl: "https://github.com/thomasdev",
    photoUrl: "https://randomuser.me/api/portraits/men/42.jpg",
    dateCreated: new Date().toISOString(),
    hasAIBadge: true,
    matches: []
  },
  {
    id: uuidv4(),
    name: "Sophia Lambert",
    profileType: "project-owner",
    role: "Founder",
    seekingRoles: ["Developer", "Designer", "Business Developer"],
    pitch: "Créatrice d'un assistant IA de marketeur qui génère et optimise les campagnes publicitaires multicanales.",
    sector: "Marketing",
    objective: "Créer une startup",
    aiTools: ["ChatGPT", "Claude", "LangChain"],
    availability: "Temps plein",
    vision: "Automatiser les tâches répétitives du marketing digital pour libérer la créativité des marketeurs.",
    region: "Remote",
    linkedinUrl: "https://linkedin.com/in/sophialambert",
    photoUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    dateCreated: new Date().toISOString(),
    hasAIBadge: false,
    projectName: "MarketingGPT",
    projectStage: "MVP",
    matches: []
  },
  {
    id: uuidv4(),
    name: "Nicolas Martin",
    profileType: "collaborator",
    role: "Designer",
    seekingRoles: [],
    pitch: "UX/UI designer spécialisé en interfaces IA et No-code. Expert Midjourney et Figma pour créer des interfaces utilisateur intuitives.",
    sector: "Marketing",
    objective: "Rejoindre un projet",
    aiTools: ["Midjourney", "Stable Diffusion", "No-code tools"],
    availability: "Mi-temps",
    vision: "Créer des interfaces utilisateur qui rendent l'IA accessible à tous.",
    region: "Bordeaux",
    linkedinUrl: "https://linkedin.com/in/nicolasmartin",
    portfolioUrl: "https://dribbble.com/nicolasdesign",
    photoUrl: "https://randomuser.me/api/portraits/men/55.jpg",
    dateCreated: new Date().toISOString(),
    hasAIBadge: false,
    matches: []
  },
  {
    id: uuidv4(),
    name: "Amina Benali",
    profileType: "project-owner",
    role: "CTO",
    seekingRoles: ["Business Developer", "Marketing"],
    pitch: "Je construis une plateforme d'IA générative pour automatiser la création et la gestion de contenu pour les sites e-commerce.",
    sector: "Retail",
    objective: "Trouver un associé",
    aiTools: ["Python", "LangChain", "Claude"],
    availability: "Temps plein",
    vision: "Automatiser la personnalisation des fiches produit et du contenu marketing des e-commerces avec l'IA.",
    region: "Paris",
    linkedinUrl: "https://linkedin.com/in/aminabenali",
    photoUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    dateCreated: new Date().toISOString(),
    hasAIBadge: true,
    projectName: "ContentGenAI",
    projectStage: "Beta",
    matches: []
  },
  {
    id: uuidv4(),
    name: "Lucas Petit",
    profileType: "collaborator",
    role: "Business Developer",
    seekingRoles: [],
    pitch: "5 ans d'expérience en business development pour des startups SaaS. Spécialisé dans la croissance et l'acquisition de clients B2B.",
    sector: "Autre",
    objective: "Rejoindre un projet",
    aiTools: ["ChatGPT", "Autre"],
    availability: "Temps plein",
    vision: "Aider les startups IA à trouver leur Product Market Fit et à accélérer leur croissance.",
    region: "Nantes",
    linkedinUrl: "https://linkedin.com/in/lucaspetit",
    websiteUrl: "https://lucaspetit.com",
    photoUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    dateCreated: new Date().toISOString(),
    hasAIBadge: false,
    matches: []
  },
  {
    id: uuidv4(),
    name: "Emma Roux",
    profileType: "project-owner",
    role: "Founder",
    seekingRoles: ["Developer", "Data Scientist", "Marketing"],
    pitch: "Je développe une application qui utilise l'IA pour conseiller les agriculteurs sur l'optimisation de leurs cultures selon les conditions météo et le sol.",
    sector: "Agriculture",
    objective: "Créer une startup",
    aiTools: ["Python", "ChatGPT", "TensorFlow"],
    availability: "Temps plein",
    vision: "Aider les agriculteurs à maximiser leurs rendements tout en respectant l'environnement grâce à l'IA.",
    region: "Toulouse",
    linkedinUrl: "https://linkedin.com/in/emmaroux",
    photoUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    dateCreated: new Date().toISOString(),
    hasAIBadge: true,
    projectName: "AgriSmart",
    projectStage: "Idée",
    matches: []
  },
  {
    id: uuidv4(),
    name: "Antoine Bernard",
    profileType: "collaborator",
    role: "Data Scientist",
    seekingRoles: [],
    pitch: "Data Scientist avec expertise en agronomie et modèles prédictifs. 4 ans d'expérience en modélisation de croissance des cultures.",
    sector: "Agriculture",
    objective: "Rejoindre un projet",
    aiTools: ["Python", "TensorFlow", "Hugging Face"],
    availability: "Soirs et weekends",
    vision: "Combiner l'IA et l'agronomie pour une agriculture plus productive et durable.",
    region: "Toulouse",
    linkedinUrl: "https://linkedin.com/in/antoinebernard",
    photoUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    dateCreated: new Date().toISOString(),
    hasAIBadge: true,
    matches: []
  },
  {
    id: uuidv4(),
    name: "Julie Moreau",
    profileType: "project-owner",
    role: "Founder",
    seekingRoles: ["CTO", "ML Engineer", "Developer"],
    pitch: "Je crée une IA de détection précoce des tendances de consommation basée sur l'analyse des médias sociaux et des données clients.",
    sector: "Retail",
    objective: "Créer une startup",
    aiTools: ["ChatGPT", "Python", "LangChain"],
    availability: "Temps plein",
    vision: "Aider les marques à anticiper les tendances de consommation avant leurs concurrents.",
    region: "Paris",
    linkedinUrl: "https://linkedin.com/in/juliemoreau",
    photoUrl: "https://randomuser.me/api/portraits/women/88.jpg",
    dateCreated: new Date().toISOString(),
    hasAIBadge: false,
    projectName: "TrendPulse",
    projectStage: "MVP",
    matches: []
  },
  {
    id: uuidv4(),
    name: "Mehdi Dubois",
    profileType: "collaborator",
    role: "CTO",
    seekingRoles: [],
    pitch: "CTO expérimenté avec 10 ans dans le développement de produits SaaS. Expert en architecture cloud et systèmes d'IA.",
    sector: "Autre",
    objective: "Rejoindre un projet",
    aiTools: ["Python", "TensorFlow", "Hugging Face"],
    availability: "Temps plein",
    vision: "Construire des architectures tech robustes pour les startups IA à fort potentiel.",
    region: "Remote",
    linkedinUrl: "https://linkedin.com/in/mehdidubois",
    websiteUrl: "https://mehdidubois.dev",
    photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    dateCreated: new Date().toISOString(),
    hasAIBadge: true,
    matches: []
  }
];

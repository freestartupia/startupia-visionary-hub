import { Startup } from "@/types/startup";

export const mockStartups: Startup[] = [
  {
    id: "mistral-ai",
    name: "Mistral AI",
    logoUrl: "https://mistral.ai/images/logo-line-dark.svg",
    shortDescription: "Modèles de langage ouverts et efficaces pour les entreprises",
    longTermVision: "Démocratiser l'accès à l'intelligence artificielle générative avec des modèles ouverts et performants pour tous les cas d'usage professionnels.",
    founders: [
      {
        name: "Arthur Mensch",
        linkedinUrl: "https://www.linkedin.com/in/arthur-mensch/",
      },
      {
        name: "Guillaume Lample",
        linkedinUrl: "https://www.linkedin.com/in/guillaume-lample/",
      },
      {
        name: "Timothée Lacroix",
        linkedinUrl: "https://www.linkedin.com/in/timothee-lacroix/",
      },
    ],
    aiUseCases: "Création et déploiement de grands modèles de langage (LLM) avec une approche ouverte et accessible. Propose une API pour intégration dans des applications métier.",
    aiTools: ["API interne", "LLama"],
    sector: "Autre",
    businessModel: "API",
    maturityLevel: "Série A",
    aiImpactScore: 5,
    tags: ["LLM", "Open-source", "API-first", "DeepTech", "French Tech"],
    websiteUrl: "https://mistral.ai",
    pitchDeckUrl: "https://example.com/mistral-pitch",
    crunchbaseUrl: "https://www.crunchbase.com/organization/mistral-ai",
    upvotes_count: 0
  },
  {
    id: "doctrine",
    name: "Doctrine",
    logoUrl: "https://assets-global.website-files.com/6410ebf8e483b5bb2c86eb27/6410ebf8e483b5758786f292_logo-doctrine.svg",
    shortDescription: "Plateforme de recherche juridique optimisée par IA",
    longTermVision: "Rendre le droit plus accessible et compréhensible grâce à l'intelligence artificielle",
    founders: [
      {
        name: "Nicolas Bustamante",
        linkedinUrl: "https://www.linkedin.com/in/nicolasbustamante/",
      },
      {
        name: "Antoine Dusséaux",
        linkedinUrl: "https://www.linkedin.com/in/antoinedusseaux/",
      },
    ],
    aiUseCases: "Analyse sémantique de documents juridiques, extraction d'information pertinente, recherche avancée dans la jurisprudence, recommandations personnalisées",
    aiTools: ["API interne", "ChatGPT"],
    sector: "Légal",
    businessModel: "SaaS",
    maturityLevel: "Série B",
    aiImpactScore: 4,
    tags: ["LegalTech", "NLP", "B2B", "Search"],
    websiteUrl: "https://www.doctrine.fr",
    crunchbaseUrl: "https://www.crunchbase.com/organization/doctrine",
    upvotes_count: 0
  },
  {
    id: "preligens",
    name: "Preligens",
    logoUrl: "",
    shortDescription: "IA de défense pour l'analyse d'images satellite",
    longTermVision: "Devenir le leader mondial de l'analyse d'imagerie satellite par IA pour la défense et le renseignement",
    founders: [
      {
        name: "Arnaud Guérin",
        linkedinUrl: "https://www.linkedin.com/in/arnaud-guerin-earthcube/",
      },
      {
        name: "Renaud Allioux",
        linkedinUrl: "https://www.linkedin.com/in/renaud-allioux/",
      },
    ],
    aiUseCases: "Détection automatique d'objets stratégiques sur images satellite, analyse de changements géospatiaux, cartographie augmentée",
    aiTools: ["API interne", "Hugging Face"],
    sector: "Autre",
    businessModel: "SaaS",
    maturityLevel: "Série B",
    aiImpactScore: 5,
    tags: ["DeepTech", "Computer Vision", "Défense", "Spatial"],
    websiteUrl: "https://preligens.com",
    crunchbaseUrl: "https://www.crunchbase.com/organization/earthcube",
    upvotes_count: 0
  },
  {
    id: "cherry",
    name: "Cherry",
    logoUrl: "https://www.cherry.tech/_next/image?url=%2Fassets%2Fimage%2Flogos%2Fcherry-icon.png&w=384&q=75",
    shortDescription: "Assistant IA pour comptables et experts-comptables",
    longTermVision: "Automatiser 80% des tâches répétitives en cabinet comptable et transformer le métier de comptable",
    founders: [
      {
        name: "David Tran",
        linkedinUrl: "https://www.linkedin.com/in/david-tran-09a14b172/",
      },
      {
        name: "Hugo Simon",
        linkedinUrl: "https://www.linkedin.com/in/hugo-simon-3101a610a/",
      },
    ],
    aiUseCases: "Extraction automatique d'information comptable, OCR avancé, rapprochement bancaire, automatisation de la saisie, classification des pièces",
    aiTools: ["ChatGPT", "API interne"],
    sector: "Finance",
    businessModel: "SaaS",
    maturityLevel: "Série A",
    aiImpactScore: 4,
    tags: ["FinTech", "Comptabilité", "OCR", "Automatisation"],
    websiteUrl: "https://www.cherry.tech",
    crunchbaseUrl: "https://www.crunchbase.com/organization/cherry-tech",
    upvotes_count: 0
  },
  {
    id: "meero",
    name: "Meero",
    logoUrl: "https://about.meero.com/hubfs/raw_assets/public/about-meero-2019/Images/Logo-Meero-Round.svg",
    shortDescription: "Plateforme de production et d'édition photo optimisée par IA",
    longTermVision: "Simplifier la production visuelle à grande échelle pour toutes les entreprises du monde",
    founders: [
      {
        name: "Thomas Rebaud",
        linkedinUrl: "https://www.linkedin.com/in/thomasrebaud/",
      },
    ],
    aiUseCases: "Retouche photo automatisée, tri, curation et sélection d'images par IA, optimisation du workflow photographique",
    aiTools: ["API interne", "Stable Diffusion"],
    sector: "Marketing",
    businessModel: "Marketplace",
    maturityLevel: "Série C+",
    aiImpactScore: 3,
    tags: ["MarTech", "Photographie", "Computer Vision", "Marketplace"],
    websiteUrl: "https://www.meero.com",
    crunchbaseUrl: "https://www.crunchbase.com/organization/meero",
    upvotes_count: 0
  },
  {
    id: "hub3e",
    name: "Hub3E",
    logoUrl: "",
    shortDescription: "IA prédictive pour la maintenance des bâtiments industriels",
    longTermVision: "Réduire de 30% la consommation énergétique des bâtiments industriels grâce à l'IA",
    founders: [
      {
        name: "Elise Devaux",
        linkedinUrl: "https://www.linkedin.com/in/elise-devaux/",
      },
    ],
    aiUseCases: "Prédiction des pannes, optimisation énergétique en temps réel, maintenance prédictive, analyse des données de capteurs",
    aiTools: ["API interne", "AWS Bedrock"],
    sector: "Energie",
    businessModel: "SaaS",
    maturityLevel: "Seed",
    aiImpactScore: 4,
    tags: ["GreenTech", "IoT", "women founder", "Industrie 4.0"],
    websiteUrl: "https://www.hub3e.com",
    upvotes_count: 0
  },
  {
    id: "it-labs",
    name: "IT Labs",
    logoUrl: "https://itlabs.ai/wp-content/uploads/2022/07/it-labs-logo.png",
    shortDescription: "Automation des tests et quality assurance par IA",
    longTermVision: "Rendre le développement logiciel 10x plus rapide grâce à l'automatisation des tests par IA",
    founders: [
      {
        name: "Jérôme Renard",
        linkedinUrl: "https://www.linkedin.com/in/jerome-renard-itlabs/",
      },
    ],
    aiUseCases: "Génération automatique de tests, détection de bugs, prédiction de points de défaillance, correction automatique de code",
    aiTools: ["ChatGPT", "Claude"],
    sector: "Autre",
    businessModel: "SaaS",
    maturityLevel: "Seed",
    aiImpactScore: 3,
    tags: ["DevTools", "Testing", "Automation", "bootstrapped"],
    websiteUrl: "https://itlabs.ai",
    upvotes_count: 0
  },
  {
    id: "labelai",
    name: "Label AI",
    logoUrl: "",
    shortDescription: "Plateforme d'étiquetage automatique de données pour IA",
    longTermVision: "Démocratiser l'accès aux données étiquetées pour accélérer le développement de l'IA",
    founders: [
      {
        name: "Sophia Martin",
        linkedinUrl: "https://www.linkedin.com/in/sophia-martin-labelai/",
      },
      {
        name: "Lucas Dubois",
        linkedinUrl: "https://www.linkedin.com/in/lucas-dubois-labelai/",
      },
    ],
    aiUseCases: "Étiquetage automatique d'images, textes et sons, préparation de datasets, validation active, amélioration continue",
    aiTools: ["API interne", "Hugging Face"],
    sector: "Autre",
    businessModel: "SaaS",
    maturityLevel: "MVP",
    aiImpactScore: 4,
    tags: ["MLOps", "Data", "women founder", "API-first"],
    websiteUrl: "https://labelai.fr",
    upvotes_count: 0
  }
];

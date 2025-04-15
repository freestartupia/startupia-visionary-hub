
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type UseChatbotReturn = {
  messages: Message[];
  sendMessage: (content: string) => void;
  suggestedQuestions: string[];
  hasInitialMessage: boolean;
};

// Réponses prédéfinies pour les questions fréquentes
const FAQ_RESPONSES: Record<string, string> = {
  // Questions sur la plateforme
  "qu'est-ce que startupia?": "Startupia est le hub des startups et outils IA en France. Notre plateforme permet de découvrir les startups IA françaises, d'explorer les outils d'intelligence artificielle et de rejoindre une communauté active d'innovateurs.",
  "comment fonctionne startupia?": "Startupia recense les startups IA françaises et leurs outils. Vous pouvez explorer l'écosystème IA, consulter des fiches détaillées des startups, rejoindre des discussions dans notre forum et collaborer avec d'autres membres de la communauté.",
  "qui peut rejoindre startupia?": "Startupia est ouvert à tous - entrepreneurs en IA, développeurs, investisseurs, utilisateurs d'outils IA ou simplement curieux des innovations en intelligence artificielle.",
  "but de startupia": "Le but de Startupia est de devenir la référence française pour l'écosystème des startups IA, en facilitant la visibilité des projets innovants, en favorisant la collaboration entre acteurs du secteur, et en permettant aux utilisateurs de découvrir les dernières innovations en matière d'IA.",
  "team startupia": "L'équipe Startupia est composée d'entrepreneurs et d'experts passionnés par l'intelligence artificielle et l'écosystème startup français. Nous travaillons avec un réseau de mentors et de partenaires pour offrir le meilleur support à notre communauté.",
  
  // Questions sur les fonctionnalités
  "comment créer un compte?": "Cliquez sur 'Se connecter' en haut à droite de la page, puis sur 'Créer un compte'. Remplissez le formulaire avec vos informations et validez votre email pour finaliser l'inscription.",
  "comment publier ma startup?": "Après vous être connecté, rendez-vous dans votre profil et cliquez sur 'Ajouter une startup'. Remplissez le formulaire avec les détails de votre startup IA et soumettez-le pour validation.",
  "comment participer au forum?": "Pour participer au forum, connectez-vous et accédez à la section 'Communauté'. Vous pourrez consulter les discussions existantes, créer de nouveaux sujets ou répondre aux messages d'autres utilisateurs.",
  "comment modifier mon profil?": "Connectez-vous à votre compte, puis cliquez sur votre avatar en haut à droite de l'écran. Sélectionnez 'Profil' dans le menu déroulant. Sur votre page de profil, vous trouverez un bouton 'Modifier' qui vous permettra de mettre à jour vos informations personnelles.",
  "comment voter pour une startup?": "Sur la page de détail d'une startup, vous trouverez un bouton de vote (pouce en l'air). Cliquez dessus pour soutenir cette startup. Votre vote aide à mettre en avant les projets les plus prometteurs dans notre écosystème.",
  "comment filtrer les startups?": "Sur la page principale des startups, vous trouverez un panneau de filtres sur le côté gauche. Vous pouvez filtrer par catégories, technologies utilisées, stade de développement et bien d'autres critères pour trouver exactement ce que vous cherchez.",
  
  // Questions sur la communauté
  "quels sont les avantages de rejoindre la communauté?": "En rejoignant la communauté Startupia, vous pourrez échanger avec d'autres professionnels de l'IA, obtenir des conseils d'experts, promouvoir vos projets, découvrir des opportunités de collaboration et rester informé des dernières tendances en IA.",
  "comment trouver un cofondateur?": "Consultez notre section 'Cofondateur' où vous pouvez créer un profil détaillant vos compétences et ce que vous recherchez. Vous pourrez explorer les profils d'autres entrepreneurs et entrer en contact avec des partenaires potentiels.",
  "comment collaborer sur un projet?": "Dans la section 'Communauté', explorez l'onglet 'Projets' pour découvrir des initiatives collaboratives ou proposer votre propre projet. Vous pouvez postuler pour rejoindre des projets existants ou recruter des collaborateurs pour vos idées.",
  "événements startupia": "Startupia organise régulièrement des webinaires, ateliers et rencontres networking dédiés à l'IA et aux startups. Consultez la section Événements sur notre site ou abonnez-vous à notre newsletter pour être informé des prochains rendez-vous.",
  "comment devenir mentor?": "Si vous êtes un expert dans le domaine de l'IA ou de l'entrepreneuriat et souhaitez partager votre expérience, contactez-nous à startupia@gowithia.fr pour discuter des opportunités de mentorat au sein de notre communauté.",
  
  // Questions techniques
  "comment fonctionne l'intelligence artificielle?": "L'IA est un domaine informatique qui vise à créer des systèmes capables d'accomplir des tâches nécessitant normalement l'intelligence humaine. Cela inclut l'apprentissage, le raisonnement, la perception et la compréhension du langage naturel.",
  "quelles sont les technologies ia populaires?": "Parmi les technologies IA populaires, on trouve l'apprentissage automatique (Machine Learning), l'apprentissage profond (Deep Learning), le traitement du langage naturel (NLP), la vision par ordinateur, et les grands modèles de langage (LLM) comme GPT et BERT.",
  "différence entre ia et machine learning": "L'intelligence artificielle est un concept large qui englobe toute technologie permettant à une machine de simuler l'intelligence humaine. Le Machine Learning est une sous-catégorie de l'IA qui permet aux systèmes d'apprendre et de s'améliorer à partir de données sans être explicitement programmés pour chaque tâche.",
  "qu'est-ce que le deep learning?": "Le Deep Learning (apprentissage profond) est une branche du Machine Learning utilisant des réseaux de neurones artificiels à plusieurs couches pour analyser divers aspects des données. Cette approche est particulièrement efficace pour la reconnaissance d'images, le traitement du langage naturel et d'autres tâches complexes.",
  "comment se former à l'ia?": "Pour vous former à l'IA, explorez notre section 'Formations' dans l'onglet 'Communauté'. Vous y trouverez des ressources gratuites et payantes adaptées à tous les niveaux. Les plateformes comme Coursera, Udacity et OpenClassrooms proposent également d'excellents cours sur l'IA et le Machine Learning.",
  
  // Questions business
  "comment valoriser ma startup ia?": "La valorisation d'une startup IA dépend de plusieurs facteurs : technologie propriétaire, équipe, traction du marché, modèle économique, propriété intellectuelle et potentiel de croissance. Consultez notre forum pour des conseils spécifiques à votre situation.",
  "où trouver des investisseurs pour l'ia?": "Vous pouvez rencontrer des investisseurs spécialisés en IA lors d'événements du secteur, via notre communauté, ou en participant à des programmes d'accélération comme France Digitale, BPI France, Station F ou 50 Partners.",
  "comment protéger ma propriété intellectuelle?": "Pour protéger votre propriété intellectuelle en IA, envisagez le dépôt de brevets pour vos algorithmes innovants, les droits d'auteur pour votre code, ou le secret commercial. Consultez un avocat spécialisé en propriété intellectuelle pour une stratégie adaptée à votre projet.",
  "modèles économiques ia": "Les modèles économiques courants pour les startups IA incluent: SaaS (Software as a Service), licences d'API, modèles freemium, tarification basée sur l'usage, vente de données anonymisées et analysées, et services de conseil ou d'implémentation sur mesure.",
  "levée de fonds startup ia": "Pour réussir une levée de fonds en IA, préparez un pitch deck solide mettant en avant votre innovation technologique, votre équipe, votre traction et votre vision. Participez à des concours de startups et des programmes d'accélération pour gagner en visibilité auprès des investisseurs.",
  
  // Tendances et avenir de l'IA
  "avenir de l'ia": "L'avenir de l'IA s'oriente vers des systèmes plus autonomes, éthiques et transparents. Les tendances incluent l'IA générative, l'IA explicable, l'IA frugale (économe en ressources), les interfaces cerveau-machine et l'IA multi-agents. La régulation et l'éthique deviendront des aspects cruciaux du développement de l'IA.",
  "impacts de l'ia sur l'emploi": "L'IA transformera le marché du travail en automatisant certaines tâches répétitives, mais créera également de nouvelles professions. L'accent sera mis sur les compétences humaines difficiles à automatiser: créativité, empathie, pensée critique et capacité d'adaptation. La formation continue deviendra essentielle pour s'adapter à ces changements.",
  "éthique de l'ia": "L'éthique de l'IA concerne la transparence des algorithmes, l'équité, la protection de la vie privée, la responsabilité et l'impact sociétal. Des cadres éthiques sont en développement au niveau mondial pour guider une IA responsable qui bénéficie à l'humanité sans perpétuer de biais ou créer de nouveaux risques."
};

// Questions suggérées affichées au début de la conversation
const SUGGESTED_QUESTIONS = [
  "Qu'est-ce que Startupia?",
  "Comment publier ma startup?",
  "Comment trouver un cofondateur?",
  "Quelles sont les technologies IA populaires?",
  "Comment valoriser ma startup IA?"
];

const WELCOME_MESSAGE: Message = {
  id: uuidv4(),
  content: "Bonjour ! Je suis l'assistant Startupia. Comment puis-je vous aider aujourd'hui ?",
  sender: 'bot',
  timestamp: new Date(),
};

export const useChatbot = (): UseChatbotReturn => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [hasInitialMessage, setHasInitialMessage] = useState(false);

  useEffect(() => {
    // Afficher un message d'accueil après un court délai
    const timer = setTimeout(() => {
      setHasInitialMessage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getResponse = (question: string): string => {
    // Convertir la question en minuscules pour la recherche
    const normalizedQuestion = question.toLowerCase();
    
    // Rechercher des mots-clés dans la question
    for (const [key, value] of Object.entries(FAQ_RESPONSES)) {
      // Vérifier si la question contient des mots-clés de la FAQ
      if (normalizedQuestion.includes(key) || key.includes(normalizedQuestion)) {
        return value;
      }
    }
    
    // Rechercher des correspondances partielles
    const matchingKeys = Object.keys(FAQ_RESPONSES).filter(key => 
      key.split(' ').some(word => normalizedQuestion.includes(word)) ||
      normalizedQuestion.split(' ').some(word => key.includes(word))
    );
    
    if (matchingKeys.length > 0) {
      // Retourner la réponse du premier mot-clé correspondant
      return FAQ_RESPONSES[matchingKeys[0]];
    }
    
    // Réponse par défaut si aucune correspondance n'est trouvée
    return "Je n'ai pas d'information spécifique sur ce sujet. Pour une assistance personnalisée, veuillez contacter notre équipe à startupia@gowithia.fr. Nous nous engageons à vous répondre dans les 24 heures. Vous pouvez également explorer notre forum communautaire pour trouver des réponses à vos questions.";
  };

  const sendMessage = (content: string) => {
    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simuler un court délai de réponse
    setTimeout(() => {
      const botResponse: Message = {
        id: uuidv4(),
        content: getResponse(content),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  return {
    messages,
    sendMessage,
    suggestedQuestions: SUGGESTED_QUESTIONS,
    hasInitialMessage,
  };
};

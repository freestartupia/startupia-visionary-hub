
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
  
  // Questions sur les fonctionnalités
  "comment créer un compte?": "Cliquez sur 'Se connecter' en haut à droite de la page, puis sur 'Créer un compte'. Remplissez le formulaire avec vos informations et validez votre email pour finaliser l'inscription.",
  "comment publier ma startup?": "Après vous être connecté, rendez-vous dans votre profil et cliquez sur 'Ajouter une startup'. Remplissez le formulaire avec les détails de votre startup IA et soumettez-le pour validation.",
  "comment participer au forum?": "Pour participer au forum, connectez-vous et accédez à la section 'Communauté'. Vous pourrez consulter les discussions existantes, créer de nouveaux sujets ou répondre aux messages d'autres utilisateurs.",
  
  // Questions sur la communauté
  "quels sont les avantages de rejoindre la communauté?": "En rejoignant la communauté Startupia, vous pourrez échanger avec d'autres professionnels de l'IA, obtenir des conseils d'experts, promouvoir vos projets, découvrir des opportunités de collaboration et rester informé des dernières tendances en IA.",
  "comment trouver un cofondateur?": "Consultez notre section 'Cofondateur' où vous pouvez créer un profil détaillant vos compétences et ce que vous recherchez. Vous pourrez explorer les profils d'autres entrepreneurs et entrer en contact avec des partenaires potentiels.",
  
  // Questions techniques
  "comment fonctionne l'intelligence artificielle?": "L'IA est un domaine informatique qui vise à créer des systèmes capables d'accomplir des tâches nécessitant normalement l'intelligence humaine. Cela inclut l'apprentissage, le raisonnement, la perception et la compréhension du langage naturel.",
  "quelles sont les technologies ia populaires?": "Parmi les technologies IA populaires, on trouve l'apprentissage automatique (Machine Learning), l'apprentissage profond (Deep Learning), le traitement du langage naturel (NLP), la vision par ordinateur, et les grands modèles de langage (LLM) comme GPT et BERT.",
  
  // Questions business
  "comment valoriser ma startup ia?": "La valorisation d'une startup IA dépend de plusieurs facteurs : technologie propriétaire, équipe, traction du marché, modèle économique, propriété intellectuelle et potentiel de croissance. Consultez notre forum pour des conseils spécifiques à votre situation.",
  "où trouver des investisseurs pour l'ia?": "Vous pouvez rencontrer des investisseurs spécialisés en IA lors d'événements du secteur, via notre communauté, ou en participant à des programmes d'accélération comme France Digitale, BPI France, Station F ou 50 Partners.",
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
    return "Je n'ai pas d'information spécifique sur ce sujet. N'hésitez pas à poser une autre question ou à explorer notre forum communautaire pour trouver des réponses à vos questions.";
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

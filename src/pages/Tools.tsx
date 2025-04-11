
import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';

// Définition du type pour les outils
interface Tool {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  link: string;
}

const Tools = () => {
  // Données des outils recommandés
  const tools: Tool[] = [
    {
      id: 'claude',
      name: 'Claude',
      description: 'Assistant IA conversationnel développé par Anthropic, connu pour ses capacités de raisonnement avancées.',
      imageUrl: 'https://static.wikia.nocookie.net/anthropic-claude/images/c/c8/Anthropic-logo.png',
      category: 'Assistant IA',
      rating: 4.8,
      link: 'https://claude.ai'
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      description: 'Assistant IA conversationnel d\'OpenAI avec une grande polyvalence pour la génération de texte et l\'aide à diverses tâches.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png',
      category: 'Assistant IA',
      rating: 4.7,
      link: 'https://chat.openai.com'
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      description: 'Générateur d\'images par IA capable de créer des visuels artistiques de haute qualité à partir de descriptions textuelles.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
      category: 'Génération d\'images',
      rating: 4.9,
      link: 'https://www.midjourney.com'
    },
    {
      id: 'notion-ai',
      name: 'Notion AI',
      description: 'Extension IA intégrée à Notion pour la rédaction, le résumé et l\'organisation des informations.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
      category: 'Productivité',
      rating: 4.5,
      link: 'https://www.notion.so/product/ai'
    },
    {
      id: 'jasper',
      name: 'Jasper',
      description: 'Plateforme d\'écriture IA pour le marketing, optimisée pour créer du contenu de qualité rapidement.',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP-1lFGGgpHi5Ql-QJ1_TCHmvvBWw8_ZcfejvW2Hk&s',
      category: 'Rédaction',
      rating: 4.6,
      link: 'https://www.jasper.ai'
    },
    {
      id: 'synthesia',
      name: 'Synthesia',
      description: 'Outil de création de vidéos avec des avatars IA parlants, idéal pour les formations et présentations.',
      imageUrl: 'https://play-lh.googleusercontent.com/kcTwutt7y4hROROJkBK71CmzodD9n9IZvmYWsJUHGRsVWbHJm0qBBpYdFLhcRFNYg70',
      category: 'Vidéo',
      rating: 4.5,
      link: 'https://www.synthesia.io'
    },
    {
      id: 'copy-ai',
      name: 'Copy.ai',
      description: 'Assistant de rédaction IA pour créer rapidement des textes marketing et du contenu pour les réseaux sociaux.',
      imageUrl: 'https://assets-global.website-files.com/628288c5cd3e8411b90a36a4/62828d93a3b62a3a8ef74297_Copy_ai_Logo_Color.svg',
      category: 'Rédaction',
      rating: 4.4,
      link: 'https://www.copy.ai'
    },
    {
      id: 'descript',
      name: 'Descript',
      description: 'Éditeur vidéo et audio utilisant l\'IA pour simplifier le montage et créer des doublages de voix.',
      imageUrl: 'https://cdn.sanity.io/images/599r6htc/localized/159509a8b0f05672da493271449e0367d0173af1-1024x1024.png',
      category: 'Audio/Vidéo',
      rating: 4.7,
      link: 'https://www.descript.com'
    },
    {
      id: 'dall-e',
      name: 'DALL-E',
      description: 'Générateur d\'images d\'OpenAI permettant de créer des visuels réalistes et artistiques à partir de descriptions textuelles.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/DALL-E_logo.svg',
      category: 'Génération d\'images',
      rating: 4.8,
      link: 'https://openai.com/dall-e-3'
    },
  ];

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      <SEO 
        title="Outils IA Recommandés | StartupIA"
        description="Découvrez notre sélection d'outils d'intelligence artificielle pour booster votre productivité et votre créativité."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Outils IA Recommandés</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Notre sélection des meilleurs outils d'intelligence artificielle pour améliorer votre productivité et stimuler votre créativité.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="bg-black/30 border-startupia-turquoise/20 hover:border-startupia-turquoise/40 transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video w-full bg-black/50 flex items-center justify-center p-6">
                  <img 
                    src={tool.imageUrl} 
                    alt={tool.name} 
                    className="max-h-24 max-w-full object-contain" 
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{tool.name}</h3>
                    <div className="flex items-center text-yellow-400">
                      <Star size={16} className="fill-yellow-400" />
                      <span className="ml-1 text-sm">{tool.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-startupia-turquoise/20 text-startupia-turquoise text-xs px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                  
                  <p className="text-white/80 mb-4 text-sm line-clamp-3">
                    {tool.description}
                  </p>
                  
                  <a 
                    href={tool.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-startupia-turquoise hover:text-startupia-turquoise/80 text-sm font-medium"
                  >
                    Visiter le site <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tools;

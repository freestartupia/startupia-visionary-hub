
import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Star, 
  Globe, 
  Briefcase, 
  Target, 
  Cpu, 
  Hash, 
  BarChart3,
  Building,
  Users,
  ExternalLink,
  FileText,
  Linkedin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockStartups } from "@/data/mockStartups";
import { Startup } from "@/types/startup";

const StartupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const startup = mockStartups.find(s => s.id === id);

  if (!startup) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">Startup introuvable</h2>
        <Button asChild>
          <Link to="/startups">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  // Generate stars for AI Impact Score
  const renderStars = (score: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={20}
          className={`${
            i < score ? "text-startupia-turquoise fill-startupia-turquoise" : "text-gray-600"
          }`}
        />
      ));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-10">
        {/* Back button */}
        <div className="mb-10">
          <Button 
            variant="outline" 
            asChild
            className="border-startupia-turquoise/50 hover:bg-startupia-turquoise/10"
          >
            <Link to="/startups">
              <ArrowLeft className="mr-2" size={18} />
              Retour à la liste
            </Link>
          </Button>
        </div>

        {/* Startup header */}
        <div className="glass-card p-8 mb-8 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-startupia-turquoise/10 flex items-center justify-center">
              {startup.logoUrl ? (
                <img 
                  src={startup.logoUrl} 
                  alt={`${startup.name} logo`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-startupia-turquoise">
                  {startup.name.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {startup.name}
              </h1>
              <p className="text-lg text-white/70 mb-4">
                {startup.shortDescription}
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full bg-startupia-turquoise/10 text-startupia-turquoise flex items-center">
                  <Building size={16} className="mr-1" /> {startup.sector}
                </span>
                <span className="px-3 py-1 rounded-full bg-startupia-turquoise/10 text-startupia-turquoise flex items-center">
                  <Briefcase size={16} className="mr-1" /> {startup.businessModel}
                </span>
                <span className="px-3 py-1 rounded-full bg-startupia-turquoise/10 text-startupia-turquoise flex items-center">
                  <BarChart3 size={16} className="mr-1" /> {startup.maturityLevel}
                </span>
                <span className="px-3 py-1 rounded-full bg-startupia-turquoise/10 text-white flex items-center">
                  <span className="mr-2">Score IA</span> 
                  <span className="flex">
                    {renderStars(startup.aiImpactScore)}
                  </span>
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button asChild className="bg-startupia-turquoise hover:bg-startupia-turquoise/90">
                <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Globe size={18} className="mr-2" />
                  Visiter le site
                </a>
              </Button>
              
              {startup.pitchDeckUrl && (
                <Button asChild variant="outline" className="border-startupia-turquoise/50 hover:bg-startupia-turquoise/10">
                  <a href={startup.pitchDeckUrl} target="_blank" rel="noopener noreferrer">
                    <FileText size={18} className="mr-2" />
                    Pitch deck
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Startup details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-8">
            {/* Vision */}
            <div className="glass-card p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Target className="mr-2 text-startupia-turquoise" /> Vision long terme
              </h2>
              <p className="text-white/80">{startup.longTermVision}</p>
            </div>
            
            {/* Founders */}
            <div className="glass-card p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Users className="mr-2 text-startupia-turquoise" /> Fondateur{startup.founders.length > 1 ? 's' : ''}
              </h2>
              <div className="space-y-4">
                {startup.founders.map((founder, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-white/80">{founder.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      asChild
                      className="text-startupia-turquoise hover:bg-startupia-turquoise/10"
                    >
                      <a href={founder.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin size={16} className="mr-1" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* External links */}
            <div className="glass-card p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <ExternalLink className="mr-2 text-startupia-turquoise" /> Liens externes
              </h2>
              <div className="space-y-2">
                {startup.crunchbaseUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Crunchbase</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      asChild
                      className="text-startupia-turquoise hover:bg-startupia-turquoise/10"
                    >
                      <a href={startup.crunchbaseUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} className="ml-2" />
                      </a>
                    </Button>
                  </div>
                )}
                
                {startup.notionUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Notion</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      asChild
                      className="text-startupia-turquoise hover:bg-startupia-turquoise/10"
                    >
                      <a href={startup.notionUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} className="ml-2" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-8">
            {/* AI Use Cases */}
            <div className="glass-card p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Cpu className="mr-2 text-startupia-turquoise" /> Cas d'usage de l'IA
              </h2>
              <p className="text-white/80">{startup.aiUseCases}</p>
            </div>
            
            {/* AI Tools */}
            <div className="glass-card p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Cpu className="mr-2 text-startupia-turquoise" /> Outils IA utilisés
              </h2>
              <div className="flex flex-wrap gap-2">
                {startup.aiTools.map((tool, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-full bg-startupia-turquoise/10 text-startupia-turquoise"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div className="glass-card p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Hash className="mr-2 text-startupia-turquoise" /> Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {startup.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-full bg-startupia-turquoise/10 text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;

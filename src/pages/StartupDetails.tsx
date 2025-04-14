
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Linkedin,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Startup } from "@/types/startup";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const StartupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStartupDetails = async () => {
      if (!id) {
        setError(true);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('startups')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Erreur lors de la récupération de la startup:", error);
          setError(true);
          toast.error("Impossible de trouver cette startup");
        } else if (data) {
          let parsedFounders = [];
          try {
            if (data.founders) {
              if (typeof data.founders === 'string') {
                parsedFounders = JSON.parse(data.founders);
              } else if (Array.isArray(data.founders)) {
                parsedFounders = data.founders;
              } else if (typeof data.founders === 'object') {
                parsedFounders = [data.founders];
              }
            }
          } catch (e) {
            console.error('Error parsing founders:', e);
            parsedFounders = [];
          }

          const transformedData: Startup = {
            id: data.id,
            name: data.name,
            logoUrl: data.logo_url || '',
            shortDescription: data.short_description,
            longTermVision: data.long_term_vision || '',
            founders: parsedFounders,
            aiUseCases: data.ai_use_cases || '',
            aiTools: data.ai_tools || [],
            sector: data.sector,
            businessModel: data.business_model,
            maturityLevel: data.maturity_level,
            aiImpactScore: data.ai_impact_score,
            tags: data.tags || [],
            websiteUrl: data.website_url,
            pitchDeckUrl: data.pitch_deck_url,
            crunchbaseUrl: data.crunchbase_url,
            notionUrl: data.notion_url,
            dateAdded: data.date_added,
            viewCount: data.view_count,
            isFeatured: data.is_featured,
            upvoteCount: data.upvotes_count || 0,
          };

          setStartup(transformedData);

          // Incrémenter le compteur de vues
          const { error: updateError } = await supabase
            .from('startups')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', id);

          if (updateError) {
            console.error("Erreur lors de la mise à jour du compteur de vues:", updateError);
          }
        }
      } catch (error) {
        console.error("Erreur:", error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartupDetails();
  }, [id]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-startupia-turquoise mb-4" />
          <p className="text-white/70 text-lg">Chargement des détails de la startup...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <h2 className="text-2xl mb-4">Startup introuvable</h2>
          <p className="text-white/70 mb-6">Nous n'avons pas pu trouver la startup que vous recherchez.</p>
          <Button asChild>
            <Link to="/ecosystem">Retour à l'écosystème</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        {/* Back button */}
        <div className="mb-10">
          <Button 
            variant="outline" 
            asChild
            className="border-startupia-turquoise/50 hover:bg-startupia-turquoise/10"
          >
            <Link to="/ecosystem">
              <ArrowLeft className="mr-2" size={18} />
              Retour à l'écosystème
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
              {startup.websiteUrl && (
                <Button asChild className="bg-startupia-turquoise hover:bg-startupia-turquoise/90">
                  <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <Globe size={18} className="mr-2" />
                    Visiter le site
                  </a>
                </Button>
              )}
              
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
              <p className="text-white/80">{startup.longTermVision || "Non renseignée"}</p>
            </div>
            
            {/* Founders */}
            <div className="glass-card p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Users className="mr-2 text-startupia-turquoise" /> Fondateur{startup.founders && startup.founders.length > 1 ? 's' : ''}
              </h2>
              <div className="space-y-4">
                {startup.founders && startup.founders.length > 0 ? (
                  startup.founders.map((founder, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-white/80">{founder.name}</span>
                      {founder.linkedinUrl && (
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
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">Aucun fondateur renseigné</p>
                )}
              </div>
            </div>
            
            {/* External links */}
            <div className="glass-card p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <ExternalLink className="mr-2 text-startupia-turquoise" /> Liens externes
              </h2>
              <div className="space-y-2">
                {startup.crunchbaseUrl ? (
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
                ) : null}
                
                {startup.notionUrl ? (
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
                ) : null}

                {!startup.crunchbaseUrl && !startup.notionUrl && (
                  <p className="text-white/60">Aucun lien externe renseigné</p>
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
              <p className="text-white/80">{startup.aiUseCases || "Non renseigné"}</p>
            </div>
            
            {/* AI Tools */}
            <div className="glass-card p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Cpu className="mr-2 text-startupia-turquoise" /> Outils IA utilisés
              </h2>
              {startup.aiTools && startup.aiTools.length > 0 ? (
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
              ) : (
                <p className="text-white/60">Aucun outil IA renseigné</p>
              )}
            </div>
            
            {/* Tags */}
            <div className="glass-card p-6">
              <h2 className="flex items-center text-xl font-semibold mb-4">
                <Hash className="mr-2 text-startupia-turquoise" /> Tags
              </h2>
              {startup.tags && startup.tags.length > 0 ? (
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
              ) : (
                <p className="text-white/60">Aucun tag renseigné</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StartupDetails;

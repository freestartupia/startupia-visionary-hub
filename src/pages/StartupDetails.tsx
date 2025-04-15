import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getStartupById } from "@/services/startupService";
import { Startup } from "@/types/startup";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, ThumbsUp } from "lucide-react";
import StartupLogo from "@/components/startup/StartupLogo";
import TagList from "@/components/startup/TagList";
import SEO from "@/components/SEO";
import { upvoteStartup, downvoteStartup } from "@/services/startupService";
import { toast } from "sonner";

const StartupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStartup = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await getStartupById(id);
          if (data) {
            // Make sure to include upvotes when setting the startup
            setStartup({
              ...data,
              upvotes: data.upvotes || 0
            });
            setUpvotes(data.upvotes || 0);
            setIsUpvoted(data.isUpvoted || false);
          }
        }
      } catch (error) {
        console.error("Error fetching startup:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [id]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!startup) return;
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      if (isUpvoted) {
        const success = await downvoteStartup(startup.id);
        if (success) {
          setUpvotes(prev => Math.max(0, prev - 1));
          setIsUpvoted(false);
        }
      } else {
        const success = await upvoteStartup(startup.id);
        if (success) {
          setUpvotes(prev => prev + 1);
          setIsUpvoted(true);
          toast.success("Vote enregistré !");
        }
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
      toast.error("Erreur lors du vote");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Chargement des détails de la startup...
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Startup non trouvée.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title={`${startup.name} – Détails et informations`}
        description={startup.shortDescription}
      />

      <Navbar />

      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        {/* Background elements */}
        <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <Link to="/ecosystem" className="inline-flex items-center mb-4 hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Retour à l'écosystème
        </Link>

        <Card className="glass-card overflow-hidden mb-8 border border-startupia-turquoise/20 bg-black/30">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <StartupLogo logoUrl={startup.logoUrl} name={startup.name} />
                <div className="ml-4">
                  <h1 className="text-3xl font-bold text-white">{startup.name}</h1>
                  <p className="text-sm text-white/60">{startup.sector}</p>
                </div>
              </div>
              <button 
                onClick={handleUpvote}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                  isUpvoted 
                    ? 'bg-startupia-turquoise/20 text-startupia-turquoise' 
                    : 'bg-black/20 text-white/70 hover:bg-startupia-turquoise/10 hover:text-white'
                }`}
                aria-label={isUpvoted ? "Retirer le vote" : "Voter"}
              >
                <ThumbsUp size={16} className={isUpvoted ? 'fill-startupia-turquoise' : ''} />
                <span>{upvotes}</span>
              </button>
            </div>

            <div className="mb-6">
              <TagList tags={startup.tags} />
            </div>

            <p className="text-white/80 mb-4">{startup.shortDescription}</p>

            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-2">Vision à long terme</h4>
              <p className="text-white/80">{startup.longTermVision}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-2">Fondateurs</h4>
              <ul>
                {startup.founders.map((founder, index) => (
                  <li key={index} className="text-white/80 flex items-center gap-2">
                    <ExternalLink size={16} className="inline-block mr-1" />
                    <a href={founder.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {founder.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-2">Cas d'utilisation de l'IA</h4>
              <p className="text-white/80">{startup.aiUseCases}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-2">Outils d'IA utilisés</h4>
              <div className="flex flex-wrap gap-2">
                {startup.aiTools.map((tool, index) => (
                  <Badge key={index} variant="secondary">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-2">Secteur</h4>
              <p className="text-white/80">{startup.sector}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-2">Modèle économique</h4>
              <p className="text-white/80">{startup.businessModel}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold text-white mb-2">Niveau de maturité</h4>
              <p className="text-white/80">{startup.maturityLevel}</p>
            </div>

             {startup.websiteUrl && (
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-2">Site web</h4>
                <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:underline flex items-center gap-2">
                  <ExternalLink size={16} className="inline-block" />
                  {startup.websiteUrl}
                </a>
              </div>
            )}

            {startup.pitchDeckUrl && (
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-2">Pitch Deck</h4>
                <a href={startup.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:underline flex items-center gap-2">
                  <ExternalLink size={16} className="inline-block" />
                  {startup.pitchDeckUrl}
                </a>
              </div>
            )}

            {startup.crunchbaseUrl && (
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-2">Crunchbase</h4>
                <a href={startup.crunchbaseUrl} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:underline flex items-center gap-2">
                  <ExternalLink size={16} className="inline-block" />
                  {startup.crunchbaseUrl}
                </a>
              </div>
            )}

            {startup.notionUrl && (
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-2">Notion</h4>
                <a href={startup.notionUrl} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:underline flex items-center gap-2">
                  <ExternalLink size={16} className="inline-block" />
                  {startup.notionUrl}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default StartupDetails;

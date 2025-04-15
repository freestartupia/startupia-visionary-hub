import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Startup, Sector, BusinessModel, MaturityLevel, AITool } from '@/types/startup';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Link as LinkIcon, ExternalLink, Globe, FileText, Building, Info, Star } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import CommentsSection from '@/components/startup/CommentsSection';

const StartupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchStartupDetails = async () => {
      if (!id) {
        setIsError(true);
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
          console.error('Error fetching startup:', error);
          setIsError(true);
          toast.error('Erreur lors du chargement de la startup');
        } else if (data) {
          await supabase
            .from('startups')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', id);

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

          const typedAiTools = data.ai_tools ? data.ai_tools.map(tool => tool as AITool) : [];
          const typedSector = data.sector as Sector;
          const typedBusinessModel = data.business_model as BusinessModel;
          const typedMaturityLevel = data.maturity_level as MaturityLevel;

          setStartup({
            id: data.id,
            name: data.name,
            logoUrl: data.logo_url || '',
            shortDescription: data.short_description,
            longTermVision: data.long_term_vision || '',
            founders: parsedFounders,
            aiUseCases: data.ai_use_cases || '',
            aiTools: typedAiTools,
            sector: typedSector,
            businessModel: typedBusinessModel,
            maturityLevel: typedMaturityLevel,
            aiImpactScore: data.ai_impact_score as number,
            tags: data.tags || [],
            websiteUrl: data.website_url,
            pitchDeckUrl: data.pitch_deck_url,
            crunchbaseUrl: data.crunchbase_url,
            notionUrl: data.notion_url,
            dateAdded: data.date_added,
            viewCount: data.view_count || 0,
            isFeatured: data.is_featured,
          });
        } else {
          setIsError(true);
          toast.error('Startup introuvable');
        }
      } catch (error) {
        console.error('Error:', error);
        setIsError(true);
        toast.error('Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartupDetails();
  }, [id]);

  const renderStars = (score: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < score ? "text-startupia-turquoise fill-startupia-turquoise" : "text-gray-600"
          }`}
        />
      ));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto pt-28 pb-16 px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-white/70"
              onClick={() => navigate('/ecosystem')}
            >
              <ArrowLeft size={16} />
              Retour à la liste
            </Button>
          </div>
          <Card className="bg-black/30 border border-startupia-turquoise/20 p-6">
            <div className="flex items-center gap-6 mb-8">
              <Skeleton className="h-20 w-20 rounded-xl" />
              <div className="flex-grow">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
            </div>
            <Skeleton className="h-6 w-36 mb-6" />
            <Skeleton className="h-32 w-full mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !startup) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto pt-28 pb-16 px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-white/70"
              onClick={() => navigate('/ecosystem')}
            >
              <ArrowLeft size={16} />
              Retour à la liste
            </Button>
          </div>
          <Card className="bg-black/30 border border-startupia-turquoise/20 p-6 text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Startup introuvable</h2>
            <p className="text-white/70 mb-8">
              La startup que vous recherchez n'existe pas ou a été supprimée.
            </p>
            <Button 
              onClick={() => navigate('/ecosystem')}
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black"
            >
              Retour à l'écosystème
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title={`${startup.name} - StartupIA.fr`}
        description={startup.shortDescription}
      />
      <Navbar />
      <div className="container mx-auto pt-28 pb-16 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => navigate('/ecosystem')}
          >
            <ArrowLeft size={16} />
            Retour à la liste
          </Button>
        </div>

        <Card className="bg-black/30 border border-startupia-turquoise/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-startupia-turquoise/10 flex items-center justify-center">
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
            <div className="flex-grow">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-3xl font-bold">{startup.name}</h1>
                {startup.isFeatured && (
                  <Badge className="bg-startupia-turquoise text-black">Featured</Badge>
                )}
              </div>
              <p className="text-white/80 text-lg mb-4">{startup.shortDescription}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {startup.tags && startup.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-startupia-turquoise/10 text-white"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-white/60 text-sm">
                <div className="flex items-center gap-1">
                  <Globe size={16} />
                  <span>{startup.sector}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building size={16} />
                  <span>{startup.businessModel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Info size={16} />
                  <span>{startup.maturityLevel}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              {startup.websiteUrl && (
                <a
                  href={startup.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Button className="w-full bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black">
                    <Globe className="mr-2" size={16} />
                    Site web
                  </Button>
                </a>
              )}
              {startup.pitchDeckUrl && (
                <a
                  href={startup.pitchDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2" size={16} />
                    Pitch Deck
                  </Button>
                </a>
              )}
              {startup.crunchbaseUrl && (
                <a
                  href={startup.crunchbaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Button variant="outline" className="w-full">
                    <LinkIcon className="mr-2" size={16} />
                    Crunchbase
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-startupia-turquoise">Impact IA</h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">{renderStars(startup.aiImpactScore)}</div>
              <span className="text-white/70">Score: {startup.aiImpactScore}/5</span>
            </div>
            <p className="text-white/80">{startup.aiUseCases}</p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Technologies IA utilisées:</h3>
              <div className="flex flex-wrap gap-2">
                {startup.aiTools && startup.aiTools.map((tool, index) => (
                  <Badge key={index} className="bg-startupia-turquoise/10">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {startup.longTermVision && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-startupia-turquoise">Vision à long terme</h2>
              <p className="text-white/80 whitespace-pre-line">{startup.longTermVision}</p>
            </div>
          )}

          {startup.founders && startup.founders.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-startupia-turquoise">Fondateurs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {startup.founders.map((founder, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-startupia-turquoise/20 flex items-center justify-center text-white">
                      {founder.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{founder.name}</p>
                      {founder.linkedinUrl && (
                        <a
                          href={founder.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-startupia-turquoise hover:underline flex items-center"
                        >
                          <ExternalLink size={12} className="mr-1" />
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="text-white/60 text-sm">
          Ajouté le {formatDate(startup.dateAdded)} • Vu {startup.viewCount} fois
        </div>

        {startup && <CommentsSection startupId={startup.id} />}
      </div>
      <Footer />
    </div>
  );
};

export default StartupDetails;

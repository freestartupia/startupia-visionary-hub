import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import { mockStartups } from '@/data/mockStartups';
import { Startup } from '@/types/startup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, MapPin, Users, Calendar, BarChart3, Award, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';

const StartupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  
  useEffect(() => {
    // Fetch startup details based on ID
    const foundStartup = mockStartups.find((s) => s.id === id);
    setStartup(foundStartup || null);
  }, [id]);

  const handleApply = () => {
    if (!user) {
      toast("Connexion requise", { 
        description: "Vous devez être connecté pour postuler",
        action: {
          label: "Se connecter",
          onClick: () => navigate('/auth')
        }
      });
      return;
    }
    
    // In a real app, this would trigger a backend call to apply
    console.log(`Application sent to startup ${id}`);
    toast.success("Votre candidature a été envoyée !");
  };
  
  const handleBack = () => {
    navigate('/startups');
  };
  
  // Early return if no startup found
  if (!startup) {
    return (
      <div className="min-h-screen bg-hero-pattern flex items-center justify-center text-white">
        <p>Startup non trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-pattern text-white pb-8">
      <SEO 
        title={`${startup.name} – Startup IA | StartupIA.fr`}
        description={startup.shortDescription}
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto pt-24 px-4 relative z-10">
        <Button variant="ghost" className="mb-6 p-0 text-white hover:bg-transparent" onClick={handleBack}>
          <ArrowLeft className="mr-2 size-4" />
          Retour à la liste
        </Button>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <Card className="bg-black/50 border-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">{startup.name}</CardTitle>
                  {startup.aiImpactScore === 5 && (
                    <Badge variant="outline" className="bg-startupia-turquoise/80 border-none px-3 py-1 flex items-center gap-1">
                      <Award size={14} />
                      <span>Impact 5/5</span>
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-white/70">{startup.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-white/80">{startup.longDescription}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {startup.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                
                <Separator className="bg-white/20 mb-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Globe className="size-4" />
                      Secteur:
                    </div>
                    <div className="text-lg">{startup.sector}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="size-4" />
                      Localisation:
                    </div>
                    <div className="text-lg">{startup.location}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Users className="size-4" />
                      Taille:
                    </div>
                    <div className="text-lg">{startup.teamSize}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="size-4" />
                      Fondée en:
                    </div>
                    <div className="text-lg">{startup.foundedYear}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-white/70">
                      <BarChart3 className="size-4" />
                      Niveau de maturité:
                    </div>
                    <div className="text-lg">{startup.maturityLevel}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleApply} className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black">
                  Postuler
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:w-1/3">
            <Card className="bg-black/50 border-none">
              <CardHeader>
                <CardTitle>L'équipe</CardTitle>
                <CardDescription className="text-white/70">Les fondateurs et principaux contributeurs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {startup.team.map((member) => (
                    <li key={member.id} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-white/60">{member.title}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-black/50 border-none mt-8">
              <CardHeader>
                <CardTitle>Liens utiles</CardTitle>
                <CardDescription className="text-white/70">Pour en savoir plus</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-startupia-turquoise transition-colors">
                      <ExternalLink className="size-4" />
                      Site web
                    </a>
                  </li>
                  <li>
                    <a href={startup.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-startupia-turquoise transition-colors">
                      <ExternalLink className="size-4" />
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default StartupDetails;


import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { signIn, signUp } from '@/services/authService';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (activeTab === 'register' && password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (activeTab === 'register' && !acceptTerms) {
      toast.error("Veuillez accepter les conditions d'utilisation.");
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'login') {
        const response = await signIn(email, password);
        if (response.error) {
          throw response.error;
        }
        toast.success("Connexion réussie !");
        // Redirect to the previous page or the home page
        const from = location.state?.from || "/";
        navigate(from, { replace: true });
      } else {
        const response = await signUp(email, password, firstName, lastName);
        if (response.error) {
          throw response.error;
        }
        toast.success("Inscription réussie !");
        setActiveTab('login'); // Automatically switch to login tab after successful registration
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Erreur d'authentification.");
    } finally {
      setLoading(false);
    }
  };

  const benefitsList = [
    "Accès à la plus grande communauté IA française",
    "Promotion gratuite de vos services et produits",
    "Mise en relation avec des co-fondateurs potentiels",
    "Ressources exclusives et inspirations",
    "100% gratuit, sans frais cachés"
  ];

  return (
    <div className="min-h-screen bg-black flex md:items-center justify-center p-4 md:p-8">
      <SEO 
        title="Connexion & Inscription – StartupIA.fr"
        description="Connectez-vous ou créez un compte sur StartupIA.fr pour rejoindre la communauté des innovateurs de l'IA en France et accéder à toutes les fonctionnalités du hub."
        noindex={true}
      />
      
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 relative">
        {/* Left side - Auth Form */}
        <Card className="bg-black/80 border border-startupia-turquoise/20 backdrop-blur-xl shadow-xl relative z-10 h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-startupia-turquoise/5 to-transparent rounded-lg pointer-events-none"></div>
          
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold text-white">
              Bienvenue sur StartupIA
            </CardTitle>
            <CardDescription className="text-gray-300">
              {activeTab === 'login' ? 
                'Connectez-vous pour accéder à votre compte' : 
                'Créez votre compte pour rejoindre la communauté'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login" className="text-base">Connexion</TabsTrigger>
                <TabsTrigger value="register" className="text-base">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-2 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-black/60 border-gray-700 text-white focus:border-startupia-turquoise"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password" className="text-white text-sm font-medium">
                        Mot de passe
                      </Label>
                      <a href="#" className="text-xs text-startupia-turquoise hover:underline">
                        Mot de passe oublié?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 bg-black/60 border-gray-700 text-white focus:border-startupia-turquoise"
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-startupia-turquoise text-black font-medium hover:bg-startupia-turquoise/90 focus:ring-2 focus:ring-startupia-turquoise focus:ring-offset-1 mt-6 h-12"
                    disabled={loading}
                  >
                    {loading ? "Connexion en cours..." : "Se connecter"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="mt-2 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white text-sm font-medium">
                        Prénom
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="pl-10 bg-black/60 border-gray-700 text-white focus:border-startupia-turquoise"
                          placeholder="Jean"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white text-sm font-medium">
                        Nom
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="pl-10 bg-black/60 border-gray-700 text-white focus:border-startupia-turquoise"
                          placeholder="Dupont"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-black/60 border-gray-700 text-white focus:border-startupia-turquoise"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white text-sm font-medium">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 bg-black/60 border-gray-700 text-white focus:border-startupia-turquoise"
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-10 bg-black/60 border-gray-700 text-white focus:border-startupia-turquoise"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox 
                      id="terms" 
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      className="border-gray-500 data-[state=checked]:bg-startupia-turquoise data-[state=checked]:border-startupia-turquoise"
                    />
                    <Label 
                      htmlFor="terms" 
                      className="text-gray-300 text-sm leading-tight"
                    >
                      J'accepte les <a href="#" className="text-startupia-turquoise hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-startupia-turquoise hover:underline">politique de confidentialité</a>
                    </Label>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-startupia-turquoise text-black font-medium hover:bg-startupia-turquoise/90 focus:ring-2 focus:ring-startupia-turquoise focus:ring-offset-1 mt-4 h-12"
                    disabled={loading}
                  >
                    {loading ? "Inscription en cours..." : "Créer mon compte"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-gray-400 pb-6 px-8">
            <p>En vous connectant, vous rejoignez la communauté StartupIA.</p>
            <p>Besoin d'aide ? <a href="#" className="text-startupia-turquoise hover:underline">Contactez-nous</a></p>
          </CardFooter>
        </Card>
        
        {/* Right side - Benefits */}
        <div className="hidden md:flex flex-col justify-center">
          <div className="text-white space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-3 text-startupia-turquoise">Rejoignez la communauté StartupIA</h2>
              <p className="text-gray-300 text-lg">
                La première plateforme dédiée à l'IA et aux startups innovantes en France.
              </p>
            </div>
            
            <ul className="space-y-4">
              {benefitsList.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3 text-lg">
                  <CheckCircle className="h-6 w-6 text-startupia-turquoise flex-shrink-0 mt-1" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-6 mt-8 border-t border-gray-800">
              <div className="py-4 px-6 bg-gradient-to-r from-startupia-turquoise/10 to-transparent rounded-lg backdrop-blur-sm border border-startupia-turquoise/20">
                <p className="text-white font-medium">
                  "StartupIA m'a permis de rencontrer mon co-fondateur technique et de développer mon projet d'IA en moins de 3 mois."
                </p>
                <p className="text-sm text-gray-400 mt-2">— Sophie Martin, CEO de NeoLearn AI</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile banner for benefits */}
        <div className="md:hidden w-full mt-4 py-4 px-5 bg-gradient-to-r from-startupia-turquoise/10 to-transparent rounded-lg backdrop-blur-sm border border-startupia-turquoise/20">
          <h3 className="text-lg font-semibold text-white mb-2">Pourquoi nous rejoindre?</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            {benefitsList.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-startupia-turquoise flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-startupia-turquoise/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-startupia-turquoise/10 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default Auth;

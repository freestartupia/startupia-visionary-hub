
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { signIn, signUp } from '@/services/authService';
import { Eye, EyeOff } from 'lucide-react';
import SEO from '@/components/SEO';
import { Label } from '@/components/ui/label';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
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
        const response = await signUp(email, password);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern p-4">
      <SEO 
        title="Connexion & Inscription – StartupIA.fr"
        description="Connectez-vous ou créez un compte sur StartupIA.fr pour rejoindre la communauté des innovateurs de l'IA en France et accéder à toutes les fonctionnalités du hub."
        noindex={true}
      />
      
      <div className="w-full max-w-md bg-black/70 rounded-lg shadow-md p-6 backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md shadow-sm bg-black/50 border-gray-600 text-white focus:border-startupia-turquoise focus:ring-startupia-turquoise"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-white">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md shadow-sm bg-black/50 border-gray-600 text-white focus:border-startupia-turquoise focus:ring-startupia-turquoise"
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
                className="w-full bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90 focus:ring-2 focus:ring-startupia-turquoise focus:ring-offset-1"
                disabled={loading}
              >
                {loading ? "Chargement..." : "Se connecter"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md shadow-sm bg-black/50 border-gray-600 text-white focus:border-startupia-turquoise focus:ring-startupia-turquoise"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-white">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md shadow-sm bg-black/50 border-gray-600 text-white focus:border-startupia-turquoise focus:ring-startupia-turquoise"
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
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md shadow-sm bg-black/50 border-gray-600 text-white focus:border-startupia-turquoise focus:ring-startupia-turquoise"
                  />
                  
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90 focus:ring-2 focus:ring-startupia-turquoise focus:ring-offset-1"
                disabled={loading}
              >
                {loading ? "Chargement..." : "S'inscrire"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;


import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, signUp } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, LogIn, UserPlus, CheckCircle } from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const registerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(defaultTab as 'login' | 'register');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { user, error } = await signIn(values.email, values.password);
      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: error.message || "Vérifiez vos identifiants et réessayez.",
        });
      } else if (user) {
        navigate('/');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const { user, error } = await signUp(
        values.email, 
        values.password,
        values.firstName,
        values.lastName
      );

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: error.message || "Vérifiez vos informations et réessayez.",
        });
      } else {
        setShowSuccessDialog(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate('/');
  };

  const benefits = [
    "Accès à notre communauté de +10,000 entrepreneurs",
    "Promotion gratuite de vos produits et services",
    "Mise en relation avec des cofondateurs potentiels",
    "Ressources exclusives sur l'écosystème startup",
    "Tableau de bord personnalisé pour suivre vos projets"
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Left side: Value proposition */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Rejoignez <span className="text-startupia-turquoise">Startupia</span>
              </h1>
              <p className="text-xl text-white/80">
                La plateforme qui connecte les entrepreneurs, développeurs et investisseurs 
                de l'écosystème startup.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold flex items-center">
                <span className="text-startupia-turquoise mr-2">100% Gratuit</span> - Inscrivez-vous maintenant
              </h3>
              
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-startupia-turquoise mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-2">
                <p className="text-white/70 text-sm">
                  Rejoignez plus de 10,000 entrepreneurs qui utilisent déjà Startupia 
                  pour développer leur réseau et faire grandir leur projet.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side: Auth forms */}
          <div className="w-full md:w-1/2">
            <div className="bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Bienvenue sur <span className="text-startupia-turquoise">Startupia</span>
              </h2>
              
              <Tabs value={mode} onValueChange={(value) => setMode(value as 'login' | 'register')} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 w-full">
                  <TabsTrigger value="login" className="text-base">Connexion</TabsTrigger>
                  <TabsTrigger value="register" className="text-base">Inscription</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-6 animate-in fade-in-50">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="email@exemple.com" 
                                type="email" 
                                className="bg-white/5 border-white/20 text-white focus:border-startupia-turquoise"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="••••••••" 
                                  type={showPassword ? "text" : "password"} 
                                  className="bg-white/5 border-white/20 text-white focus:border-startupia-turquoise"
                                  {...field} 
                                />
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-0 top-0 h-full text-white/70 hover:text-white"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black font-medium py-6 button-glow" 
                          disabled={isLoading}
                          size="lg"
                        >
                          {isLoading ? (
                            <span className="flex items-center">Connexion en cours...</span>
                          ) : (
                            <span className="flex items-center">
                              <LogIn size={18} className="mr-2" />
                              Se connecter
                            </span>
                          )}
                        </Button>
                      </div>

                      <p className="text-sm text-center text-white/60 pt-2">
                        Pas encore de compte ? 
                        <button 
                          type="button"
                          className="text-startupia-turquoise hover:underline ml-1"
                          onClick={() => setMode('register')}
                        >
                          Inscrivez-vous gratuitement
                        </button>
                      </p>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-6 animate-in fade-in-50">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Prénom</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Jean" 
                                  className="bg-white/5 border-white/20 text-white focus:border-startupia-turquoise"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Nom</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Dupont" 
                                  className="bg-white/5 border-white/20 text-white focus:border-startupia-turquoise"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="email@exemple.com" 
                                type="email" 
                                className="bg-white/5 border-white/20 text-white focus:border-startupia-turquoise"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="••••••••" 
                                  type={showPassword ? "text" : "password"} 
                                  className="bg-white/5 border-white/20 text-white focus:border-startupia-turquoise"
                                  {...field} 
                                />
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-0 top-0 h-full text-white/70 hover:text-white"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  placeholder="••••••••" 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  className="bg-white/5 border-white/20 text-white focus:border-startupia-turquoise"
                                  {...field} 
                                />
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-0 top-0 h-full text-white/70 hover:text-white"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black font-medium py-6 button-glow" 
                          disabled={isLoading}
                          size="lg"
                        >
                          {isLoading ? (
                            <span className="flex items-center">Inscription en cours...</span>
                          ) : (
                            <span className="flex items-center">
                              <UserPlus size={18} className="mr-2" />
                              S'inscrire gratuitement
                            </span>
                          )}
                        </Button>
                      </div>

                      <p className="text-sm text-center text-white/60 pt-2">
                        En vous inscrivant, vous acceptez nos 
                        <Link to="/terms" className="text-startupia-turquoise hover:underline mx-1">
                          conditions d'utilisation
                        </Link>
                        et notre
                        <Link to="/privacy" className="text-startupia-turquoise hover:underline ml-1">
                          politique de confidentialité
                        </Link>
                      </p>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-black/90 border border-startupia-turquoise/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <CheckCircle className="text-startupia-turquoise mr-2" />
              Inscription réussie !
            </DialogTitle>
            <DialogDescription className="text-white/80 pt-2">
              Bienvenue sur Startupia ! Votre compte a été créé avec succès. 
              Vous pouvez maintenant explorer toutes les fonctionnalités de la plateforme.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button 
              onClick={closeSuccessDialog} 
              className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90"
            >
              Commencer l'aventure
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Auth;

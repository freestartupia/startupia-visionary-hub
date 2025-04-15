
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  
  // Check if there's a reset token in the URL
  const hasResetToken = !!searchParams.get('token');
  
  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      toast.error('Veuillez saisir votre adresse email.');
      return;
    }
    
    setIsResetting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(newPassword, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Un email de réinitialisation a été envoyé à votre adresse email.');
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la demande de réinitialisation');
    } finally {
      setIsResetting(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    
    setIsResetting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Votre mot de passe a été réinitialisé avec succès.');
      
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Startupia - Réinitialisation de mot de passe</title>
        <meta name="description" content="Réinitialisez votre mot de passe pour accéder à votre compte Startupia." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white/5 rounded-xl p-8 my-12 border border-white/10">
          <h1 className="text-2xl font-bold mb-6">
            {hasResetToken ? 'Définir un nouveau mot de passe' : 'Réinitialiser votre mot de passe'}
          </h1>
          
          {hasResetToken ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium mb-1">
                  Nouveau mot de passe
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/20"
                  placeholder="Entrez votre nouveau mot de passe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                  Confirmez le mot de passe
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/20"
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-startupia-turquoise hover:bg-startupia-turquoise/80"
                disabled={isResetting}
              >
                {isResetting ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Adresse email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/20"
                  placeholder="Entrez votre adresse email"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-startupia-turquoise hover:bg-startupia-turquoise/80"
                disabled={isResetting}
              >
                {isResetting ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </Button>
              
              <p className="text-sm text-white/60 text-center mt-4">
                Vous recevrez un email contenant un lien pour réinitialiser votre mot de passe.
              </p>
            </form>
          )}
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default ResetPassword;

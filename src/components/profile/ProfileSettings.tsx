
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface ProfileSettingsProps {
  userData: any;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userData }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    email_notifications: userData?.email_notifications || false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, email_notifications: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email_notifications: formData.email_notifications,
          updated_at: new Date()
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Consultez votre boîte mail pour réinitialiser votre mot de passe.",
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    setLoading(true);
    try {
      // First delete profile data
      const { error: profileDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user?.id);

      if (profileDeleteError) throw profileDeleteError;

      // Then, sign out and delete auth user
      await signOut();
      
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer votre compte",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Paramètres du compte</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Prénom</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="bg-black/20 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Nom</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="bg-black/20 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={user?.email || ''}
            readOnly
            disabled
            className="bg-black/20 border-white/20 text-white/50"
          />
          <p className="text-xs text-white/50">L'adresse email ne peut pas être modifiée.</p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="email_notifications"
            name="email_notifications"
            checked={formData.email_notifications}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="email_notifications">Recevoir les notifications par email</Label>
        </div>

        <Button type="submit" className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </form>

      <Separator className="my-6 bg-white/10" />
      
      <h3 className="text-lg font-medium mb-4">Sécurité</h3>
      <Button variant="outline" onClick={handleChangePassword} className="mb-4 w-full sm:w-auto">
        Changer de mot de passe
      </Button>

      <Separator className="my-6 bg-white/10" />
      
      <h3 className="text-lg font-medium mb-4 text-rose-500">Zone de danger</h3>
      <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading} className="w-full sm:w-auto">
        Supprimer mon compte
      </Button>
    </div>
  );
};

export default ProfileSettings;


import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera, Mail, Bell, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileSettingsProps {
  userData: any;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userData }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    avatar_url: userData?.avatar_url || '',
    email_notifications: userData?.email_notifications || false
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(formData.avatar_url);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, email_notifications: checked }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user_content')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('user_content')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'avatar:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = formData.avatar_url;
      
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) avatarUrl = uploadedUrl;
      }
      
      const updatedData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar_url: avatarUrl,
        email_notifications: formData.email_notifications,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
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
      
      navigate('/');
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
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <User className="mr-2" />
        Paramètres du compte
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-2 border-startupia-turquoise">
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt="Avatar utilisateur" />
              ) : (
                <AvatarFallback className="bg-black text-white">
                  {formData.first_name && formData.last_name 
                    ? `${formData.first_name[0]}${formData.last_name[0]}` 
                    : <User size={36} />
                  }
                </AvatarFallback>
              )}
            </Avatar>
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-0 right-0 bg-startupia-turquoise text-black rounded-full p-2 cursor-pointer hover:bg-startupia-turquoise/80 transition-colors"
            >
              <Camera size={16} />
            </label>
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarChange} 
            />
          </div>
          <p className="text-sm text-white/70">Cliquez sur l'icône d'appareil photo pour changer votre avatar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="flex items-center">
              Prénom
            </Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="bg-black/20 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name" className="flex items-center">
              Nom
            </Label>
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
          <Label htmlFor="email" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" /> Email
          </Label>
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
          <Label htmlFor="email_notifications" className="flex items-center cursor-pointer">
            <Bell className="mr-2 h-4 w-4" /> Recevoir les notifications par email
          </Label>
        </div>

        <Button type="submit" className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </form>

      <Separator className="my-6 bg-white/10" />
      
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Shield className="mr-2" /> Sécurité
      </h3>
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


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteCofounderProfile } from '@/services/cofounderService';

interface DeleteProfileButtonProps {
  id: string;
  onSuccess: () => void;
}

const DeleteProfileButton: React.FC<DeleteProfileButtonProps> = ({ id, onSuccess }) => {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteProfile = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce profil? Cette action est irréversible.")) {
      return;
    }
    
    setDeleting(true);
    try {
      await deleteCofounderProfile(id);
      
      toast({
        title: "Profil supprimé",
        description: "Votre profil a été supprimé avec succès.",
      });
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la suppression du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le profil",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleDeleteProfile}
      disabled={deleting}
    >
      {deleting && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>}
      <Trash2 size={16} className="mr-2" />
      Supprimer ce profil
    </Button>
  );
};

export default DeleteProfileButton;

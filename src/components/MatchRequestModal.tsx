
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { CofounderProfile } from '@/types/cofounders';
import { toast } from 'sonner';
import { sendMatchRequest } from '@/services/cofounderService';

interface MatchRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile: CofounderProfile;
}

const MatchRequestModal = ({ isOpen, onClose, targetProfile }: MatchRequestModalProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const handleSendRequest = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour envoyer une demande');
      return;
    }

    setIsSending(true);
    try {
      await sendMatchRequest({
        recipientId: targetProfile.id,
        message,
      });
      
      toast.success('Demande de contact envoyée avec succès !');
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      toast.error('Une erreur est survenue lors de l\'envoi de la demande');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-b from-black to-gray-900 border-startupia-purple/20">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Contact avec {targetProfile.name}
          </DialogTitle>
          <DialogDescription>
            Envoyez un message personnalisé pour expliquer pourquoi vous souhaitez collaborer avec ce profil.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Votre message (optionnel)</label>
            <Textarea
              placeholder={`Bonjour ${targetProfile.name}, je serais intéressé(e) à discuter de collaboration potentielle...`}
              className="min-h-[120px] bg-black/50 border-gray-600"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-white/20"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSendRequest}
              disabled={isSending}
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black"
            >
              {isSending ? 'Envoi en cours...' : 'Envoyer la demande'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchRequestModal;

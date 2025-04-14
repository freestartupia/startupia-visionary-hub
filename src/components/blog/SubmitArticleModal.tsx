
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SubmitArticleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubmitArticleModal = ({ open, onOpenChange }: SubmitArticleModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black border border-startupia-turquoise/30">
        <DialogHeader>
          <DialogTitle className="text-white">Fonctionnalité désactivée</DialogTitle>
          <DialogDescription>
            La soumission d'articles est actuellement désactivée. Seul l'administrateur peut publier du contenu.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitArticleModal;

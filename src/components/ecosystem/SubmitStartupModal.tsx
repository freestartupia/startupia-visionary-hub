
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface SubmitStartupModalProps {
  open: boolean;
  onClose: () => void;
}

const SubmitStartupModal = ({ open, onClose }: SubmitStartupModalProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: "",
      website: "",
      description: "",
      contactEmail: user?.email || "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Submit logic would go here
      console.log("Submitted data:", data);
      
      toast.success("Proposition envoyée avec succès", {
        description: "Nous examinerons votre soumission dans les plus brefs délais."
      });
      
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting startup:", error);
      toast.error("Erreur lors de l'envoi", {
        description: "Veuillez réessayer ultérieurement."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-black/90 border-startupia-turquoise/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Proposer une startup IA</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la startup</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nom" 
                      required 
                      className="bg-black/50 border-white/20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com" 
                      type="url" 
                      className="bg-black/50 border-white/20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez brièvement cette startup et ses cas d'utilisation de l'IA" 
                      required 
                      className="bg-black/50 border-white/20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contact</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="votre@email.com" 
                      type="email" 
                      required 
                      className="bg-black/50 border-white/20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-white/20 text-white"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-startupia-gold text-black hover:bg-startupia-light-gold"
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitStartupModal;

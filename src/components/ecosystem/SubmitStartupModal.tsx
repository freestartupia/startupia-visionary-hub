
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Info, Plus, X } from "lucide-react";
import { Startup, AITool, Sector, BusinessModel, MaturityLevel } from "@/types/startup";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  shortDescription: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  longTermVision: z.string().optional(),
  websiteUrl: z.string().url("Veuillez entrer une URL valide"),
  logoUrl: z.string().optional(),
  aiUseCases: z.string().min(10, "Veuillez décrire les cas d'usage IA"),
  sector: z.string(),
  businessModel: z.string(),
  maturityLevel: z.string(),
  aiImpactScore: z.coerce.number().min(1).max(5),
  tags: z.string(),
  aiTools: z.array(z.string()).min(1, "Sélectionnez au moins un outil IA"),
  founderName: z.string().min(2, "Veuillez indiquer le nom du fondateur"),
  founderLinkedin: z.string().url("Veuillez entrer une URL LinkedIn valide"),
});

interface SubmitStartupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess?: () => void;
}

const SubmitStartupModal = ({ open, onOpenChange, onSubmitSuccess }: SubmitStartupModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTools, setSelectedTools] = useState<AITool[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      longTermVision: "",
      websiteUrl: "",
      logoUrl: "",
      aiUseCases: "",
      sector: "",
      businessModel: "",
      maturityLevel: "",
      aiImpactScore: 3,
      tags: "",
      aiTools: [],
      founderName: "",
      founderLinkedin: "",
    },
  });

  const handleAddTool = (tool: AITool) => {
    if (!selectedTools.includes(tool)) {
      const newTools = [...selectedTools, tool];
      setSelectedTools(newTools);
      form.setValue("aiTools", newTools);
    }
  };

  const handleRemoveTool = (tool: AITool) => {
    const newTools = selectedTools.filter(t => t !== tool);
    setSelectedTools(newTools);
    form.setValue("aiTools", newTools);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour soumettre un projet");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      // Process tags
      const tags = values.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
      
      // Prepare founders array
      const founders = [{
        name: values.founderName,
        linkedinUrl: values.founderLinkedin
      }];

      // Prepare startup data
      const startupData = {
        name: values.name,
        short_description: values.shortDescription,
        logo_url: values.logoUrl || null,
        long_term_vision: values.longTermVision || null,
        founders: JSON.stringify(founders),
        ai_use_cases: values.aiUseCases,
        ai_tools: values.aiTools,
        sector: values.sector,
        business_model: values.businessModel,
        maturity_level: values.maturityLevel,
        ai_impact_score: values.aiImpactScore,
        website_url: values.websiteUrl,
        tags: tags,
        date_added: new Date().toISOString(),
        upvotes_count: 0,
        is_featured: false,
        view_count: 0,
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from('startups')
        .insert(startupData)
        .select();

      if (error) {
        console.error('Error submitting startup:', error);
        toast.error("Erreur lors de la soumission du projet");
        return;
      }

      toast.success("Projet soumis avec succès");
      onOpenChange(false);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  // List of available tools and sectors
  const aiToolOptions: AITool[] = [
    "ChatGPT", "Claude", "LLama", "Stable Diffusion", 
    "Midjourney", "API interne", "Hugging Face", 
    "Vertex AI", "AWS Bedrock", "Autre"
  ];

  const sectorOptions: Sector[] = [
    "Santé", "RH", "Retail", "Finance", "Education", 
    "Marketing", "Légal", "Transport", "Immobilier", 
    "Agriculture", "Energie", "Autre"
  ];

  const businessModelOptions: BusinessModel[] = [
    "SaaS", "Service", "Marketplace", "API", "Freemium",
    "B2B", "B2C", "B2B2C", "Hardware", "Autre"
  ];

  const maturityLevelOptions: MaturityLevel[] = [
    "Idée", "MVP", "Seed", "Série A", "Série B", 
    "Série C+", "Profitable"
  ];

  const handleLogin = () => {
    navigate('/auth');
    onOpenChange(false);
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-black border border-startupia-turquoise/30">
          <DialogHeader>
            <DialogTitle className="text-white">Connectez-vous pour soumettre votre projet</DialogTitle>
            <DialogDescription className="text-white/70">
              Vous devez être connecté pour soumettre un projet au Hub IA Français.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button onClick={handleLogin} className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90">
              Se connecter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-black border border-startupia-turquoise/30">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Soumettre votre projet IA</DialogTitle>
          <DialogDescription className="text-white/70">
            Présentez votre startup IA à la communauté française.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Startup name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nom de la startup</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ex: StartupIA" 
                        {...field} 
                        className="bg-black/30 border-startupia-turquoise/30 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website URL */}
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Site web</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://votrestartup.fr" 
                        {...field} 
                        className="bg-black/30 border-startupia-turquoise/30 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Logo URL */}
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">URL du logo (optionnel)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="URL de votre logo" 
                        {...field} 
                        className="bg-black/30 border-startupia-turquoise/30 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sector */}
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Secteur</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/30 border-startupia-turquoise/30 text-white">
                          <SelectValue placeholder="Sélectionnez un secteur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border border-startupia-turquoise/30">
                        {sectorOptions.map((sector) => (
                          <SelectItem key={sector} value={sector} className="text-white hover:bg-startupia-turquoise/20">
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Model */}
              <FormField
                control={form.control}
                name="businessModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Modèle économique</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/30 border-startupia-turquoise/30 text-white">
                          <SelectValue placeholder="Sélectionnez un modèle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border border-startupia-turquoise/30">
                        {businessModelOptions.map((model) => (
                          <SelectItem key={model} value={model} className="text-white hover:bg-startupia-turquoise/20">
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Maturity Level */}
              <FormField
                control={form.control}
                name="maturityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Stade de maturité</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/30 border-startupia-turquoise/30 text-white">
                          <SelectValue placeholder="Sélectionnez un stade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border border-startupia-turquoise/30">
                        {maturityLevelOptions.map((level) => (
                          <SelectItem key={level} value={level} className="text-white hover:bg-startupia-turquoise/20">
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AI Impact Score */}
              <FormField
                control={form.control}
                name="aiImpactScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Score d'impact IA (1-5)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger className="bg-black/30 border-startupia-turquoise/30 text-white">
                          <SelectValue placeholder="Score d'impact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border border-startupia-turquoise/30">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <SelectItem key={score} value={score.toString()} className="text-white hover:bg-startupia-turquoise/20">
                            {score}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Short Description */}
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description courte</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Une brève description de votre startup (max 150 caractères)" 
                      {...field} 
                      className="bg-black/30 border-startupia-turquoise/30 text-white min-h-[80px]"
                      maxLength={150}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Long Term Vision */}
            <FormField
              control={form.control}
              name="longTermVision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Vision long terme (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez la vision long terme de votre startup" 
                      {...field} 
                      className="bg-black/30 border-startupia-turquoise/30 text-white min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AI Use Cases */}
            <FormField
              control={form.control}
              name="aiUseCases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Cas d'usage de l'IA</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez comment vous utilisez l'IA dans votre solution" 
                      {...field} 
                      className="bg-black/30 border-startupia-turquoise/30 text-white min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AI Tools */}
            <FormField
              control={form.control}
              name="aiTools"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Outils IA utilisés</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
                    {aiToolOptions.map((tool) => (
                      <Button
                        key={tool}
                        type="button"
                        variant={selectedTools.includes(tool) ? "default" : "outline"}
                        className={`
                          text-xs h-auto py-1 px-2
                          ${selectedTools.includes(tool) 
                            ? "bg-startupia-turquoise text-black" 
                            : "border-startupia-turquoise/30 text-white"}
                        `}
                        onClick={() => 
                          selectedTools.includes(tool) 
                            ? handleRemoveTool(tool) 
                            : handleAddTool(tool)
                        }
                      >
                        {tool}
                      </Button>
                    ))}
                  </div>
                  {selectedTools.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedTools.map((tool) => (
                        <div 
                          key={tool} 
                          className="bg-startupia-turquoise/10 text-startupia-turquoise px-2 py-1 rounded-full text-xs flex items-center"
                        >
                          {tool}
                          <X 
                            size={14} 
                            className="ml-1 cursor-pointer" 
                            onClick={() => handleRemoveTool(tool)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="text-white">Tags</FormLabel>
                    <Info size={16} className="ml-2 text-white/50" />
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="IA, français, innovation (séparés par des virgules)" 
                      {...field} 
                      className="bg-black/30 border-startupia-turquoise/30 text-white"
                    />
                  </FormControl>
                  <p className="text-xs text-white/50 mt-1">Séparez les tags par des virgules</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Founder Information */}
            <div className="bg-startupia-turquoise/10 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-3">Information sur le fondateur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="founderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nom du fondateur</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="bg-black/30 border-startupia-turquoise/30 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="founderLinkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">LinkedIn du fondateur</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://linkedin.com/in/johndoe" 
                          {...field} 
                          className="bg-black/30 border-startupia-turquoise/30 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Soumettre le projet"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitStartupModal;

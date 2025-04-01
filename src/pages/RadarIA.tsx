import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ChevronDown } from 'lucide-react';
import SearchBar from '@/components/ecosystem/SearchBar';
import TopStartups from '@/components/ecosystem/TopStartups';
import NewLaunches from '@/components/ecosystem/NewLaunches';
import DirectoryView from '@/components/ecosystem/DirectoryView';
import RadarView from '@/components/ecosystem/RadarView';
import SEO from '@/components/SEO';

const RadarIA = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      <SEO 
        title="Radar IA – Tendances, Mouvements et Prévisions de l'Intelligence Artificielle"
        description="Suivez les tendances émergentes et l'évolution du marché de l'IA en France : mouvements clés, levées de fonds, acquisitions et prédictions sur l'avenir de l'intelligence artificielle."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <Footer />
    </div>
  );
};

export default RadarIA;

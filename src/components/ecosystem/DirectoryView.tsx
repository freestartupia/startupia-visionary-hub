import React, { useState, useEffect } from 'react';
import { mockStartups } from '@/data/mockStartups';
import { Startup, Sector, MaturityLevel, BusinessModel, AITool } from '@/types/startup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import StartupCard from '@/components/StartupCard';

interface DirectoryViewProps {
  searchQuery: string;
}

interface FilterState {
  sector: Sector | 'Tous';
  maturity: MaturityLevel | 'Tous';
  businessModel: BusinessModel | 'Tous';
  aiTool: AITool | 'Tous';
}

const DirectoryView = ({ searchQuery }: DirectoryViewProps) => {
  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  const [showFilters, setShowFilters] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    sector: 'Tous',
    maturity: 'Tous',
    businessModel: 'Tous',
    aiTool: 'Tous',
  });
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    let filtered = [...mockStartups];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((startup) =>
        startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filterState.sector !== 'Tous') {
      filtered = filtered.filter(startup => startup.sector === filterState.sector);
    }
    if (filterState.maturity !== 'Tous') {
      filtered = filtered.filter(startup => startup.maturityLevel === filterState.maturity);
    }
    if (filterState.businessModel !== 'Tous') {
      filtered = filtered.filter(startup => startup.businessModel === filterState.businessModel);
    }
    if (filterState.aiTool !== 'Tous') {
       filtered = filtered.filter(startup => startup.aiTools.includes(filterState.aiTool));
    }

    // Apply sorting
    switch (sortOrder) {
      case 'impact':
        filtered.sort((a, b) => b.aiImpactScore - a.aiImpactScore);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'funding':
        // In a real app this would sort by funding amount
        filtered = filtered.filter(s => s.maturityLevel === 'Série A' || s.maturityLevel === 'Série B' || s.maturityLevel === 'Série C+');
        break;
      default: // newest
        filtered = filtered.reverse();
    }

    setStartups(filtered);
  }, [searchQuery, filterState, sortOrder]);

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilterState(prevState => ({
      ...prevState,
      [filterType]: value,
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Rechercher une startup..."
            value={searchQuery}
            className="w-full max-w-md"
          />
        </div>
        <Button variant="outline" onClick={toggleFilters} className="ml-4 border-startupia-turquoise text-startupia-turquoise">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {showFilters ? 'Masquer' : 'Filtrer'}
        </Button>
      </div>

      {showFilters && (
        <div className="bg-black/30 rounded-md p-4 mb-6 border border-startupia-turquoise/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sector Filter */}
            <div>
              <h4 className="text-sm font-bold mb-2">Secteur</h4>
              <Select onValueChange={(value) => handleFilterChange('sector', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les secteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous les secteurs</SelectItem>
                  <SelectItem value="Santé">Santé</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Légal">Légal</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Immobilier">Immobilier</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Energie">Energie</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Maturity Filter */}
            <div>
              <h4 className="text-sm font-bold mb-2">Niveau de maturité</h4>
              <Select onValueChange={(value) => handleFilterChange('maturity', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous les niveaux</SelectItem>
                  <SelectItem value="Idée">Idée</SelectItem>
                  <SelectItem value="MVP">MVP</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Série A">Série A</SelectItem>
                  <SelectItem value="Série B">Série B</SelectItem>
                  <SelectItem value="Série C+">Série C+</SelectItem>
                  <SelectItem value="Profitable">Profitable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business Model Filter */}
            <div>
              <h4 className="text-sm font-bold mb-2">Modèle économique</h4>
              <Select onValueChange={(value) => handleFilterChange('businessModel', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les modèles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous les modèles</SelectItem>
                  <SelectItem value="SaaS">SaaS</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Marketplace">Marketplace</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="Freemium">Freemium</SelectItem>
                  <SelectItem value="B2B">B2B</SelectItem>
                  <SelectItem value="B2C">B2C</SelectItem>
                  <SelectItem value="B2B2C">B2B2C</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* AI Tool Filter */}
            <div>
              <h4 className="text-sm font-bold mb-2">Outil IA utilisé</h4>
              <Select onValueChange={(value) => handleFilterChange('aiTool', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les outils" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tous">Tous les outils</SelectItem>
                  <SelectItem value="ChatGPT">ChatGPT</SelectItem>
                  <SelectItem value="Claude">Claude</SelectItem>
                  <SelectItem value="LLama">LLama</SelectItem>
                  <SelectItem value="Stable Diffusion">Stable Diffusion</SelectItem>
                  <SelectItem value="Midjourney">Midjourney</SelectItem>
                  <SelectItem value="API interne">API interne</SelectItem>
                  <SelectItem value="Hugging Face">Hugging Face</SelectItem>
                  <SelectItem value="Vertex AI">Vertex AI</SelectItem>
                  <SelectItem value="AWS Bedrock">AWS Bedrock</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator className="my-4 bg-white/20" />
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setFilterState({
              sector: 'Tous',
              maturity: 'Tous',
              businessModel: 'Tous',
              aiTool: 'Tous',
            })}>
              Réinitialiser
              <X className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Startups IA</h2>
        <Select onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tri: Plus récentes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récentes</SelectItem>
            <SelectItem value="impact">Impact IA</SelectItem>
            <SelectItem value="alphabetical">Alphabétique</SelectItem>
            <SelectItem value="funding">Levée de fonds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup) => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>
    </div>
  );
};

export default DirectoryView;

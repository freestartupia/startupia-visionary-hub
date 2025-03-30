
import React, { useState, useEffect } from "react";
import { Startup, Sector, MaturityLevel, BusinessModel, AITool } from "@/types/startup";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";

interface StartupFiltersProps {
  startups: Startup[];
  setFilteredStartups: React.Dispatch<React.SetStateAction<Startup[]>>;
}

const StartupFilters = ({ startups, setFilteredStartups }: StartupFiltersProps) => {
  // Filter states
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>([]);
  const [selectedMaturity, setSelectedMaturity] = useState<MaturityLevel[]>([]);
  const [selectedBusinessModels, setSelectedBusinessModels] = useState<BusinessModel[]>([]);
  const [selectedAITools, setSelectedAITools] = useState<AITool[]>([]);
  const [selectedAIScores, setSelectedAIScores] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique values for each filter
  const uniqueSectors = [...new Set(startups.map((s) => s.sector))];
  const uniqueMaturity = [...new Set(startups.map((s) => s.maturityLevel))];
  const uniqueBusinessModels = [...new Set(startups.map((s) => s.businessModel))];
  const uniqueAITools = [...new Set(startups.flatMap((s) => s.aiTools))];
  const uniqueTags = [...new Set(startups.flatMap((s) => s.tags))];

  // Apply filters
  useEffect(() => {
    let filtered = [...startups];

    if (selectedSectors.length > 0) {
      filtered = filtered.filter((s) => selectedSectors.includes(s.sector));
    }

    if (selectedMaturity.length > 0) {
      filtered = filtered.filter((s) => selectedMaturity.includes(s.maturityLevel));
    }

    if (selectedBusinessModels.length > 0) {
      filtered = filtered.filter((s) => selectedBusinessModels.includes(s.businessModel));
    }

    if (selectedAITools.length > 0) {
      filtered = filtered.filter((s) => 
        s.aiTools.some(tool => selectedAITools.includes(tool))
      );
    }

    if (selectedAIScores.length > 0) {
      filtered = filtered.filter((s) => selectedAIScores.includes(s.aiImpactScore));
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((s) =>
        s.tags.some(tag => selectedTags.includes(tag))
      );
    }

    setFilteredStartups(filtered);
  }, [
    startups,
    selectedSectors,
    selectedMaturity,
    selectedBusinessModels,
    selectedAITools,
    selectedAIScores,
    selectedTags,
    setFilteredStartups,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedSectors([]);
    setSelectedMaturity([]);
    setSelectedBusinessModels([]);
    setSelectedAITools([]);
    setSelectedAIScores([]);
    setSelectedTags([]);
  };

  // Toggle selection of filters
  const toggleSector = (sector: Sector) => {
    setSelectedSectors(prev =>
      prev.includes(sector)
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const toggleMaturity = (maturity: MaturityLevel) => {
    setSelectedMaturity(prev =>
      prev.includes(maturity)
        ? prev.filter(m => m !== maturity)
        : [...prev, maturity]
    );
  };

  const toggleBusinessModel = (model: BusinessModel) => {
    setSelectedBusinessModels(prev =>
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  };

  const toggleAITool = (tool: AITool) => {
    setSelectedAITools(prev =>
      prev.includes(tool)
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    );
  };

  const toggleAIScore = (score: number) => {
    setSelectedAIScores(prev =>
      prev.includes(score)
        ? prev.filter(s => s !== score)
        : [...prev, score]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Filtres</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
          className="border-startupia-turquoise text-startupia-turquoise hover:bg-startupia-turquoise/10"
        >
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Secteur */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left mb-2">
            <span className="font-medium">Secteur</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {uniqueSectors.map((sector) => (
              <div key={sector} className="flex items-center">
                <Checkbox
                  id={`sector-${sector}`}
                  checked={selectedSectors.includes(sector)}
                  onCheckedChange={() => toggleSector(sector)}
                  className="border-startupia-turquoise data-[state=checked]:bg-startupia-turquoise"
                />
                <label
                  htmlFor={`sector-${sector}`}
                  className="ml-2 text-sm cursor-pointer"
                >
                  {sector}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Maturité */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left mb-2">
            <span className="font-medium">Niveau de maturité</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {uniqueMaturity.map((maturity) => (
              <div key={maturity} className="flex items-center">
                <Checkbox
                  id={`maturity-${maturity}`}
                  checked={selectedMaturity.includes(maturity)}
                  onCheckedChange={() => toggleMaturity(maturity)}
                  className="border-startupia-turquoise data-[state=checked]:bg-startupia-turquoise"
                />
                <label
                  htmlFor={`maturity-${maturity}`}
                  className="ml-2 text-sm cursor-pointer"
                >
                  {maturity}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Business Model */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left mb-2">
            <span className="font-medium">Business Model</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {uniqueBusinessModels.map((model) => (
              <div key={model} className="flex items-center">
                <Checkbox
                  id={`model-${model}`}
                  checked={selectedBusinessModels.includes(model)}
                  onCheckedChange={() => toggleBusinessModel(model)}
                  className="border-startupia-turquoise data-[state=checked]:bg-startupia-turquoise"
                />
                <label
                  htmlFor={`model-${model}`}
                  className="ml-2 text-sm cursor-pointer"
                >
                  {model}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Outils IA */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left mb-2">
            <span className="font-medium">Outils IA utilisés</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {uniqueAITools.map((tool) => (
              <div key={tool} className="flex items-center">
                <Checkbox
                  id={`tool-${tool}`}
                  checked={selectedAITools.includes(tool)}
                  onCheckedChange={() => toggleAITool(tool)}
                  className="border-startupia-turquoise data-[state=checked]:bg-startupia-turquoise"
                />
                <label
                  htmlFor={`tool-${tool}`}
                  className="ml-2 text-sm cursor-pointer"
                >
                  {tool}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Score IA */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left mb-2">
            <span className="font-medium">Score d'impact IA</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ToggleGroup type="multiple" variant="outline" className="justify-start">
              {[1, 2, 3, 4, 5].map((score) => (
                <ToggleGroupItem
                  key={score}
                  value={String(score)}
                  aria-label={`Score ${score}`}
                  className={`data-[state=on]:bg-startupia-turquoise/20 data-[state=on]:text-startupia-turquoise border-startupia-turquoise/30 ${
                    selectedAIScores.includes(score) ? "bg-startupia-turquoise/20 text-startupia-turquoise" : ""
                  }`}
                  onClick={() => toggleAIScore(score)}
                >
                  {score}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Tags */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left mb-2">
            <span className="font-medium">Tags</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-2">
              {uniqueTags.slice(0, 15).map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className={`border-startupia-turquoise/30 rounded-full text-xs py-1 px-3 ${
                    selectedTags.includes(tag)
                      ? "bg-startupia-turquoise/20 text-startupia-turquoise"
                      : "text-white/70 hover:text-white hover:bg-startupia-turquoise/10"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default StartupFilters;

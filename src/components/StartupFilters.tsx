
import React, { useState, useEffect } from "react";
import { Startup } from "@/types/startup";
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAITechnologies, setSelectedAITechnologies] = useState<string[]>([]);
  const [selectedLaunchPeriods, setSelectedLaunchPeriods] = useState<string[]>([]);

  // Get unique values for each filter
  const uniqueCategories = [...new Set(startups.map((s) => s.category))];
  const uniqueAITechnologies = [...new Set(startups.map((s) => s.aiTechnology).filter(Boolean) as string[])];

  // Apply filters
  useEffect(() => {
    let filtered = [...startups];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((s) => selectedCategories.includes(s.category));
    }

    if (selectedAITechnologies.length > 0) {
      filtered = filtered.filter((s) => 
        s.aiTechnology && selectedAITechnologies.includes(s.aiTechnology)
      );
    }

    if (selectedLaunchPeriods.length > 0) {
      const now = new Date();
      filtered = filtered.filter((s) => {
        if (!s.launchDate) return false;
        
        const launchDate = new Date(s.launchDate);
        const monthsDiff = (now.getFullYear() - launchDate.getFullYear()) * 12 + 
                          now.getMonth() - launchDate.getMonth();
        
        if (selectedLaunchPeriods.includes('recent') && monthsDiff <= 3) return true;
        if (selectedLaunchPeriods.includes('thisyear') && monthsDiff <= 12) return true;
        if (selectedLaunchPeriods.includes('established') && monthsDiff > 12) return true;
        
        return false;
      });
    }

    setFilteredStartups(filtered);
  }, [
    startups,
    selectedCategories,
    selectedAITechnologies,
    selectedLaunchPeriods,
    setFilteredStartups,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedAITechnologies([]);
    setSelectedLaunchPeriods([]);
  };

  // Toggle selection of filters
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleAITechnology = (technology: string) => {
    setSelectedAITechnologies(prev =>
      prev.includes(technology)
        ? prev.filter(t => t !== technology)
        : [...prev, technology]
    );
  };

  const toggleLaunchPeriod = (period: string) => {
    setSelectedLaunchPeriods(prev =>
      prev.includes(period)
        ? prev.filter(p => p !== period)
        : [...prev, period]
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
        {/* Catégorie */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left mb-2">
            <span className="font-medium">Catégorie</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {uniqueCategories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                  className="border-startupia-turquoise data-[state=checked]:bg-startupia-turquoise"
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-2 text-sm cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Technologie IA */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left mb-2">
            <span className="font-medium">Technologie IA</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {uniqueAITechnologies.map((tech) => (
              <div key={tech} className="flex items-center">
                <Checkbox
                  id={`tech-${tech}`}
                  checked={selectedAITechnologies.includes(tech)}
                  onCheckedChange={() => toggleAITechnology(tech)}
                  className="border-startupia-turquoise data-[state=checked]:bg-startupia-turquoise"
                />
                <label
                  htmlFor={`tech-${tech}`}
                  className="ml-2 text-sm cursor-pointer"
                >
                  {tech}
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Période de lancement */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left mb-2">
            <span className="font-medium">Période de lancement</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ToggleGroup type="multiple" variant="outline" className="justify-start">
              <ToggleGroupItem
                value="recent"
                aria-label="Moins de 3 mois"
                className={`data-[state=on]:bg-startupia-turquoise/20 data-[state=on]:text-startupia-turquoise border-startupia-turquoise/30 ${
                  selectedLaunchPeriods.includes("recent") ? "bg-startupia-turquoise/20 text-startupia-turquoise" : ""
                }`}
                onClick={() => toggleLaunchPeriod("recent")}
              >
                &lt; 3 mois
              </ToggleGroupItem>
              <ToggleGroupItem
                value="thisyear"
                aria-label="Cette année"
                className={`data-[state=on]:bg-startupia-turquoise/20 data-[state=on]:text-startupia-turquoise border-startupia-turquoise/30 ${
                  selectedLaunchPeriods.includes("thisyear") ? "bg-startupia-turquoise/20 text-startupia-turquoise" : ""
                }`}
                onClick={() => toggleLaunchPeriod("thisyear")}
              >
                &lt; 1 an
              </ToggleGroupItem>
              <ToggleGroupItem
                value="established"
                aria-label="Plus d'un an"
                className={`data-[state=on]:bg-startupia-turquoise/20 data-[state=on]:text-startupia-turquoise border-startupia-turquoise/30 ${
                  selectedLaunchPeriods.includes("established") ? "bg-startupia-turquoise/20 text-startupia-turquoise" : ""
                }`}
                onClick={() => toggleLaunchPeriod("established")}
              >
                &gt; 1 an
              </ToggleGroupItem>
            </ToggleGroup>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default StartupFilters;

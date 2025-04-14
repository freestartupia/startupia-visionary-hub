import React, { useState, useEffect } from "react";
import { Search, Filter, Star, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StartupCard from "@/components/StartupCard";
import StartupFilters from "@/components/StartupFilters";
import { mockStartups } from "@/data/mockStartups";
import { Startup } from "@/types/startup";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const StartupIndex = () => {
  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>(mockStartups);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredStartups(startups);
      return;
    }

    const filtered = startups.filter((startup) =>
      startup.name.toLowerCase().includes(query.toLowerCase()) ||
      startup.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
      startup.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredStartups(filtered);
  };

  // Rediriger vers l'écosystème (le véritable hub IA)
  useEffect(() => {
    navigate('/ecosystem');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero section */}
      <section className="py-12 md:py-20 pt-28 relative">
        <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Redirection vers l'écosystème IA Français
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Vous allez être redirigé vers la page écosystème...
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default StartupIndex;

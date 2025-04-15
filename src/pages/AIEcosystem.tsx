
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStartups } from "@/services/startupService";
import DirectoryView from "@/components/ecosystem/DirectoryView";
import MapView from "@/components/ecosystem/MapView";
import RadarView from "@/components/ecosystem/RadarView";
import TopStartups from "@/components/ecosystem/TopStartups";
import NewLaunches from "@/components/ecosystem/NewLaunches";
import SubmitStartupModal from "@/components/ecosystem/SubmitStartupModal";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import SEO from "@/components/SEO";

const AIEcosystem = () => {
  const [activeTab, setActiveTab] = useState("directory");
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: startups = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["startups"],
    queryFn: getStartups,
  });

  // Sort startups by upvotes (descending)
  const sortedStartups = [...startups].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

  const handleUpvote = (startupId: string, newCount: number) => {
    // This is optional as the backend will handle the upvote count
    // But we can update the local state for immediate feedback
    console.log(`Startup ${startupId} upvotes updated to ${newCount}`);
    // Refetch to get the latest data
    refetch();
  };

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      <SEO
        title="Écosystème des Startups IA Françaises - Startupia"
        description="Découvrez les startups françaises spécialisées en IA, leurs cas d'usage, et trouvez des opportunités dans l'écosystème de l'intelligence artificielle."
      />

      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-purple/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              L'Écosystème des Startups IA Françaises
            </h1>
            <p className="text-white/70 max-w-2xl">
              Explorez les startups françaises qui innovent avec l'intelligence artificielle et transforment 
              les industries. Découvrez leurs cas d'usage, leurs technologies et plus encore.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full transition-colors ${
                activeTab === "directory"
                  ? "bg-startupia-purple text-white"
                  : "bg-black/20 text-white/70 hover:bg-black/30"
              }`}
              onClick={() => setActiveTab("directory")}
            >
              Annuaire
            </button>
            <button
              className={`px-3 py-1 rounded-full transition-colors ${
                activeTab === "map"
                  ? "bg-startupia-purple text-white"
                  : "bg-black/20 text-white/70 hover:bg-black/30"
              }`}
              onClick={() => setActiveTab("map")}
            >
              Carte
            </button>
            <button
              className={`px-3 py-1 rounded-full transition-colors ${
                activeTab === "radar"
                  ? "bg-startupia-purple text-white"
                  : "bg-black/20 text-white/70 hover:bg-black/30"
              }`}
              onClick={() => setActiveTab("radar")}
            >
              Radar IA
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="bg-startupia-gold text-black hover:bg-startupia-light-gold px-3 py-1 rounded-full transition-colors ml-2"
            >
              Ajouter une startup
            </button>
          </div>
        </div>

        <div className="mb-12">
          <TopStartups startups={sortedStartups.slice(0, 3)} onUpvote={handleUpvote} />
        </div>

        <div className="mb-12">
          <NewLaunches startupsFeatured={sortedStartups.filter(s => s.isFeatured).slice(0, 4)} />
        </div>

        {activeTab === "directory" && (
          <DirectoryView startups={sortedStartups} isLoading={isLoading} onUpvote={handleUpvote} />
        )}
        {activeTab === "map" && <MapView startupList={startups} />}
        {activeTab === "radar" && <RadarView startupList={startups} />}
      </main>

      <SubmitStartupModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default AIEcosystem;

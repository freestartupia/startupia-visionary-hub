
import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { mockStartups } from "@/data/mockStartups";
import { Startup } from "@/types/startup";
import { Info } from 'lucide-react';

interface MapViewProps {
  searchQuery: string;
}

// De fausses données géographiques pour notre démo
const STARTUP_LOCATIONS: Record<string, { lat: number, lng: number }> = {
  "mistral-ai": { lat: 48.8566, lng: 2.3522 },  // Paris
  "doctrine": { lat: 48.8744, lng: 2.3526 },   // Paris Nord
  "preligens": { lat: 43.2965, lng: 5.3698 },   // Marseille
  "cherry": { lat: 45.764, lng: 4.8357 },      // Lyon
  "meero": { lat: 47.2173, lng: -1.5534 },     // Nantes
  "hub3e": { lat: 44.8378, lng: -0.5792 },     // Bordeaux
  "it-labs": { lat: 43.6045, lng: 1.4442 },    // Toulouse
  "labelai": { lat: 50.6292, lng: 3.0573 },    // Lille
};

const MapView = ({ searchQuery }: MapViewProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  
  // Filter startups based on search query
  useEffect(() => {
    let filtered = mockStartups;
    
    if (searchQuery.trim()) {
      filtered = mockStartups.filter((startup) =>
        startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredStartups(filtered);
  }, [searchQuery]);
  
  // Initialiser la carte lors du montage du composant
  useEffect(() => {
    // Simuler le chargement d'une bibliothèque de cartographie
    const initializeMap = () => {
      if (!mapContainerRef.current) return;
      
      console.log("La carte serait initialisée ici avec une vraie bibliothèque de cartographie");
      setMapLoaded(true);
      
      // Simuler l'ajout des marqueurs sur la carte
      if (mapLoaded) {
        // Nettoyage des marqueurs existants
        markersRef.current.forEach(marker => {
          // Dans une vraie implémentation: marker.remove()
        });
        markersRef.current = [];
        
        // Ajout des nouveaux marqueurs
        filteredStartups.forEach(startup => {
          const location = STARTUP_LOCATIONS[startup.id];
          if (location) {
            // Dans une vraie implémentation: 
            // const marker = new maplibregl.Marker().setLngLat([location.lng, location.lat]).addTo(map);
            // marker.getElement().addEventListener('click', () => setSelectedStartup(startup));
            // markersRef.current.push(marker);
            console.log(`Ajout d'un marqueur pour ${startup.name} à ${location.lat}, ${location.lng}`);
          }
        });
      }
    };

    initializeMap();
    
    // Nettoyage lors du démontage
    return () => {
      if (mapRef.current) {
        // Dans une vraie implémentation: mapRef.current.remove();
      }
    };
  }, [filteredStartups, mapLoaded]);

  return (
    <div className="mb-16">
      <div className="relative">
        {/* Carte simulée */}
        <div ref={mapContainerRef} className="w-full h-[600px] rounded-lg overflow-hidden bg-gray-800 relative">
          {/* Fond de carte simulé */}
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
          
          {/* Message d'intégration future */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="p-6 bg-black/80 border border-startupia-turquoise/30 max-w-md text-center">
              <Info className="w-12 h-12 mx-auto mb-4 text-startupia-turquoise" />
              <h3 className="text-xl font-bold mb-2">Cartographie des startups IA</h3>
              <p className="text-white/70">
                Cette vue afficherait une carte interactive montrant la répartition géographique 
                des startups IA françaises. Chaque marqueur représenterait une entreprise, 
                avec des détails disponibles au clic.
              </p>
              <p className="mt-4 text-sm text-white/50">
                Pour implémenter cette fonctionnalité, intégrez une bibliothèque de cartographie comme 
                MapLibre GL JS, Leaflet, ou l'API Google Maps.
              </p>
            </Card>
          </div>
          
          {/* Points simulés sur la carte */}
          {filteredStartups.map(startup => {
            const location = STARTUP_LOCATIONS[startup.id];
            if (!location) return null;
            
            // Convertir les coordonnées en positions CSS approximatives
            const posLeft = (location.lng + 5) / 10 * 100;  // Ajustement grossier pour la démo
            const posTop = (50 - location.lat / 2);
            
            return (
              <div 
                key={startup.id}
                className="absolute w-3 h-3 bg-startupia-turquoise rounded-full cursor-pointer hover:w-4 hover:h-4 hover:bg-startupia-turquoise/80 transition-all"
                style={{ left: `${posLeft}%`, top: `${posTop}%` }}
                onClick={() => setSelectedStartup(startup)}
                title={startup.name}
              />
            );
          })}
        </div>
        
        {/* Détails de la startup sélectionnée */}
        {selectedStartup && (
          <Card className="absolute top-4 right-4 p-4 bg-black/80 border border-startupia-turquoise/30 max-w-xs">
            <button 
              onClick={() => setSelectedStartup(null)} 
              className="absolute top-2 right-2 text-white/50 hover:text-white"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-1">{selectedStartup.name}</h3>
            <p className="text-sm text-white/70 mb-2">{selectedStartup.shortDescription}</p>
            <div className="flex gap-2 flex-wrap">
              {selectedStartup.tags.map(tag => (
                <span key={tag} className="text-xs bg-startupia-turquoise/20 text-startupia-turquoise px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
      
      {/* Liste des startups au-dessous de la carte */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Startups par région</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(
            filteredStartups.reduce<Record<string, Startup[]>>((acc, startup) => {
              // Déterminer la région en fonction des coordonnées (pour la démo)
              const location = STARTUP_LOCATIONS[startup.id];
              let region = "Autre";
              
              if (location) {
                if (location.lat > 48 && location.lng > 1.8) region = "Île-de-France";
                else if (location.lat < 45 && location.lng > 5) region = "Sud-Est";
                else if (location.lat < 45 && location.lng < 0) region = "Sud-Ouest";
                else if (location.lat > 48 && location.lng < 0) region = "Nord-Ouest";
                else if (location.lat > 48 && location.lng < 4) region = "Nord-Est";
                else region = "Centre";
              }
              
              if (!acc[region]) acc[region] = [];
              acc[region].push(startup);
              return acc;
            }, {})
          ).map(([region, startups]) => (
            <Card key={region} className="p-4 bg-black/30 border border-startupia-turquoise/20">
              <h3 className="font-bold text-lg mb-2">{region} ({startups.length})</h3>
              <ul className="space-y-2">
                {startups.map(startup => (
                  <li key={startup.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-startupia-turquoise rounded-full"></div>
                    <span className="text-sm">{startup.name}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;

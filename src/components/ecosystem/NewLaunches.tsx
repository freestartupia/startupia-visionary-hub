
import React, { useState, useEffect } from 'react';
import { mockProductLaunches } from '@/data/mockProductLaunches';
import { ProductLaunch } from '@/types/productLaunch';
import ProductCard from '@/components/productLaunch/ProductCard';
import StartupiaLaunchBadge from '@/components/productLaunch/StartupiaLaunchBadge';
import { Badge } from '@/components/ui/badge';
import { Calendar, Rocket } from 'lucide-react';

interface NewLaunchesProps {
  searchQuery: string;
  showFilters: boolean;
  sortOrder: string;
  limit?: number;
}

const NewLaunches = ({ searchQuery, showFilters, sortOrder, limit = 4 }: NewLaunchesProps) => {
  const [launches, setLaunches] = useState<ProductLaunch[]>([]);
  
  useEffect(() => {
    // Filter and sort products based on params
    let filtered = [...mockProductLaunches];
    
    // Apply search filter if any
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Prioritize launching_today products
    const launchingToday = filtered.filter(p => p.status === 'launching_today');
    const upcoming = filtered.filter(p => p.status === 'upcoming');
    const launched = filtered.filter(p => p.status === 'launched');
    
    // Sort based on selected order and combine
    switch (sortOrder) {
      case 'impact':
        // Sort by upvotes as a proxy for impact
        launched.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'alphabetical':
        launchingToday.sort((a, b) => a.name.localeCompare(b.name));
        upcoming.sort((a, b) => a.name.localeCompare(b.name));
        launched.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Default sort by launch date (newest first)
        launchingToday.sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());
        upcoming.sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());
        launched.sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());
    }
    
    // Combine and limit results
    const combined = [...launchingToday, ...upcoming, ...launched].slice(0, limit);
    setLaunches(combined);
  }, [searchQuery, showFilters, sortOrder, limit]);

  if (launches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">Aucun lancement ne correspond à votre recherche</p>
      </div>
    );
  }

  // Format date
  const formatLaunchDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date);
  };

  // Check if a date is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {launches.map((product) => (
        <div key={product.id} className="relative">
          {product.status === 'launching_today' && (
            <div className="absolute -top-4 -left-4 z-10">
              <Badge variant="outline" className="bg-startupia-turquoise border-none px-3 py-1 flex items-center gap-1">
                <Rocket size={14} />
                <span>Aujourd'hui !</span>
              </Badge>
            </div>
          )}
          
          {product.status === 'upcoming' && (
            <div className="absolute -top-4 -left-4 z-10">
              <Badge variant="outline" className="bg-black/60 border-startupia-turquoise/50 px-3 py-1 flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatLaunchDate(product.launchDate)}</span>
              </Badge>
            </div>
          )}
          
          <ProductCard product={product} requireAuth={false} />
        </div>
      ))}
    </div>
  );
};

export default NewLaunches;

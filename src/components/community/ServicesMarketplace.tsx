
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceCategory, ServiceListing } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { mockServiceListings } from '@/data/mockCommunityData';
import ServiceCard from './services/ServiceCard';
import ServiceFilters from './services/ServiceFilters';
import EmptyServiceState from './services/EmptyServiceState';
import ProposeServiceModal from './services/ProposeServiceModal';
import { fetchServices } from '@/services/serviceListingService';

interface ServicesMarketplaceProps {
  requireAuth?: boolean;
}

const ServicesMarketplace: React.FC<ServicesMarketplaceProps> = ({ requireAuth = false }) => {
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories: (ServiceCategory | 'all')[] = [
    'all', 'Prompt Engineering', 'Développement', 'Design IA', 
    'Automatisation', 'Stratégie IA', 'Formation', 'Conseil', 'Autre'
  ];
  
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from Supabase first
        const serviceData = await fetchServices();
        
        if (serviceData.length > 0) {
          setServices(serviceData);
        } else {
          // Fallback to mock data if no services found
          console.log("No services found in the database, using mock data");
          setServices(mockServiceListings);
        }
      } catch (error) {
        console.error("Error loading services:", error);
        // Fallback to mock data on error
        setServices(mockServiceListings);
      } finally {
        // Use a short timeout to smooth the loading experience
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    loadServices();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredServices = services
    .filter(service => selectedCategory === 'all' || service.category === selectedCategory)
    .filter(service => 
      searchTerm === '' || 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.expertise && service.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );
    
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const handleProposeService = () => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour proposer un service");
      navigate('/auth');
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleServiceSuccess = (newService: ServiceListing) => {
    // Add the new service to our local state
    setServices([newService, ...services]);
    toast.success("Votre service a été ajouté avec succès!");
  };

  const handleServiceDeleted = (serviceId: string) => {
    // Remove the deleted service from our local state
    setServices(services.filter(service => service.id !== serviceId));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Skeleton className="h-10 w-full md:w-1/2" />
          <Skeleton className="h-10 w-full md:w-48" />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ServiceFilters 
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleProposeService={handleProposeService}
        categories={categories}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard 
              key={service.id}
              service={service}
              formatDate={formatDate}
              getInitials={getInitials}
              onDelete={handleServiceDeleted}
            />
          ))
        ) : (
          <EmptyServiceState handleProposeService={handleProposeService} />
        )}
      </div>

      <ProposeServiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleServiceSuccess}
        categories={categories.filter(c => c !== 'all') as ServiceCategory[]}
      />
    </div>
  );
};

export default ServicesMarketplace;


import React, { useState } from 'react';
import { Search, Filter, ExternalLink, Calendar, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockServiceListings } from '@/data/mockCommunityData';
import { ServiceCategory, ServiceListing } from '@/types/community';

const ServicesMarketplace = () => {
  const [services, setServices] = useState<ServiceListing[]>(mockServiceListings);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');

  const categories: (ServiceCategory | 'all')[] = [
    'all', 'Prompt Engineering', 'Développement', 'Design IA', 
    'Automatisation', 'Stratégie IA', 'Formation', 'Conseil', 'Autre'
  ];
  
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);
    
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un service..."
            className="pl-10"
          />
        </div>
        <Button className="flex items-center gap-2">
          Proposer un service
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Badge 
            key={category} 
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Tous' : category}
          </Badge>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <Card key={service.id} className="glass-card hover-scale transition-transform duration-300 flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge>{service.category}</Badge>
                  <span className="text-sm text-white/60">
                    {formatDate(service.createdAt)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-white/80 mb-4">{service.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {service.expertise.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="text-white/80 mt-auto">
                  <strong>Tarif:</strong> {service.price}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={service.providerAvatar} alt={service.providerName} />
                    <AvatarFallback>{getInitials(service.providerName)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{service.providerName}</span>
                </div>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={service.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button className="flex-1" asChild>
                    <a href={service.contactLink} target="_blank" rel="noopener noreferrer">
                      <Calendar className="h-4 w-4 mr-2" />
                      Contacter
                    </a>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 col-span-full">
            <p className="text-white/60">Aucun service trouvé pour cette catégorie.</p>
            <Button variant="outline" className="mt-4">
              Proposer un service
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesMarketplace;

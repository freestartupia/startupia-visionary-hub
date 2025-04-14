
import React from 'react';
import { Calendar, Linkedin } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ServiceListing } from '@/types/community';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ServiceCardProps {
  service: ServiceListing;
  formatDate: (dateString: string) => string;
  getInitials: (name: string) => string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  formatDate, 
  getInitials 
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Card key={service.id} className="glass-card hover-scale transition-transform duration-300 flex flex-col h-full cursor-pointer">
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
              {service.expertise && service.expertise.map((skill) => (
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
              {service.linkedinUrl && (
                <Button variant="outline" className="flex-1" asChild>
                  <a href={service.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {service.contactLink && (
                <Button className="flex-1" asChild>
                  <a href={service.contactLink} target="_blank" rel="noopener noreferrer">
                    <Calendar className="h-4 w-4 mr-2" />
                    Contacter
                  </a>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 max-h-[90vh] overflow-y-auto bg-black/90 border border-white/10 p-0">
        <Card className="glass-card border-none shadow-none">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge>{service.category}</Badge>
              <span className="text-sm text-white/60">
                {formatDate(service.createdAt)}
              </span>
            </div>
            <h3 className="text-xl font-semibold">{service.title}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 mb-4">{service.description}</p>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Compétences et expertise:</h4>
              <div className="flex flex-wrap gap-1">
                {service.expertise && service.expertise.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-white/80 mb-4">
              <h4 className="font-medium mb-2">Tarification:</h4>
              <p>{service.price}</p>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={service.providerAvatar} alt={service.providerName} />
                <AvatarFallback>{getInitials(service.providerName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{service.providerName}</p>
                <p className="text-sm text-white/60">Prestataire de service</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex gap-2 w-full">
              {service.linkedinUrl && (
                <Button variant="outline" className="flex-1" asChild>
                  <a href={service.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {service.contactLink && (
                <Button className="flex-1" asChild>
                  <a href={service.contactLink} target="_blank" rel="noopener noreferrer">
                    <Calendar className="h-4 w-4 mr-2" />
                    Contacter
                  </a>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default ServiceCard;

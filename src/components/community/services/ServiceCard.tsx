
import React from 'react';
import { Calendar, Linkedin, Mail, Instagram, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ServiceListing } from '@/types/community';
import { toast } from 'sonner';

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
  const getContactIcon = () => {
    if (!service.contactLink) return <ExternalLink className="h-4 w-4 mr-2" />;

    if (service.contactLink.includes('calendly')) {
      return <Calendar className="h-4 w-4 mr-2" />;
    } else if (service.contactLink.includes('@') || service.contactLink.includes('mail')) {
      return <Mail className="h-4 w-4 mr-2" />;
    } else if (service.contactLink.includes('instagram')) {
      return <Instagram className="h-4 w-4 mr-2" />;
    } else {
      return <ExternalLink className="h-4 w-4 mr-2" />;
    }
  };

  const getContactUrl = (link: string) => {
    if (link.includes('@') && !link.includes('mailto:') && !link.startsWith('http')) {
      return `mailto:${link}`;
    }
    
    if (link.startsWith('@') && !link.includes('.')) {
      return `https://instagram.com/${link.substring(1)}`;
    }
    
    if (!link.startsWith('http') && !link.includes('@')) {
      return `https://${link}`;
    }
    
    return link;
  };

  const getContactText = () => {
    if (!service.contactLink) return "Contacter";
    
    if (service.contactLink.includes('calendly')) {
      return "Prendre RDV";
    } else if (service.contactLink.includes('@') || service.contactLink.includes('mail')) {
      return "Envoyer un email";
    } else if (service.contactLink.includes('instagram')) {
      return "Instagram";
    } else {
      return "Contacter";
    }
  };

  const handleContactClick = () => {
    if (!service.contactLink) {
      toast.error("Aucun lien de contact disponible");
      return;
    }
    
    console.log("Contact clicked for service:", service.title);
  };

  return (
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
            <AvatarImage 
              src={service.providerAvatar} 
              alt={service.providerName || ''} 
            />
            <AvatarFallback>{service.providerName ? getInitials(service.providerName) : 'U'}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{service.providerName}</span>
        </div>
        <div className="flex gap-2 w-full">
          {service.linkedinUrl && (
            <Button variant="outline" className="flex-1" asChild>
              <a href={service.linkedinUrl} target="_blank" rel="noopener noreferrer" onClick={() => console.log("LinkedIn clicked")}>
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          )}
          {service.contactLink && (
            <Button className="flex-1" asChild>
              <a 
                href={getContactUrl(service.contactLink)} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleContactClick}
              >
                {getContactIcon()}
                {getContactText()}
              </a>
            </Button>
          )}
          {!service.contactLink && !service.linkedinUrl && (
            <Button className="flex-1" disabled>
              <ExternalLink className="h-4 w-4 mr-2" />
              Aucun contact disponible
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;

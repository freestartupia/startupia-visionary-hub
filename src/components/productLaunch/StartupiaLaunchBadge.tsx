
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Rocket } from 'lucide-react';

export interface StartupiaLaunchBadgeProps {
  productId: string;
  productName: string;
  style?: 'default' | 'minimal' | 'dark' | 'light';
}

const StartupiaLaunchBadge = ({ productId, productName, style = 'default' }: StartupiaLaunchBadgeProps) => {
  const baseUrl = window.location.origin;
  const productUrl = `${baseUrl}/product/${productId}`;
  
  const getBadgeClasses = () => {
    switch (style) {
      case 'minimal':
        return 'bg-black text-white border border-startupia-turquoise/30';
      case 'dark':
        return 'bg-gray-900 text-white border border-startupia-turquoise';
      case 'light':
        return 'bg-white text-gray-900 border border-startupia-turquoise';
      default:
        return 'bg-gradient-to-r from-startupia-turquoise to-startupia-deep-turquoise text-black';
    }
  };
  
  return (
    <a 
      href={productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block no-underline"
    >
      <Badge className={`py-1 px-3 gap-1.5 text-sm hover:scale-105 transition-transform ${getBadgeClasses()}`}>
        <Rocket size={14} />
        <span className="font-medium">
          Lancé sur Startupia
        </span>
      </Badge>
    </a>
  );
};

export default StartupiaLaunchBadge;


import React from 'react';
import { cn } from '@/lib/utils';

export interface StartupiaLaunchBadgeProps {
  customText?: string;
  isFeatured?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StartupiaLaunchBadge: React.FC<StartupiaLaunchBadgeProps> = ({
  customText,
  isFeatured = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'px-3 py-1.5'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        isFeatured ? 'bg-startupia-gold text-black' : 'bg-startupia-turquoise/80 text-white',
        sizeClasses[size]
      )}
    >
      <span className="mr-1">🚀</span>
      {customText || (isFeatured ? 'Featured' : 'Startupia Launch')}
    </div>
  );
};

export default StartupiaLaunchBadge;

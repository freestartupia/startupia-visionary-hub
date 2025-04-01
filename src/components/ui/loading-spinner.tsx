
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const LoadingSpinner = ({ size = 'md', color = 'currentColor', className = '' }: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizeClass} animate-spin rounded-full border-b-2 border-t-2 border-startupia-turquoise`} />
    </div>
  );
};

export default LoadingSpinner;


import React, { Suspense } from 'react';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({ 
  children, 
  fallback = <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-startupia-turquoise"></div></div>
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyLoadWrapper;

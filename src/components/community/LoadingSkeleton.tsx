
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'post' | 'compact';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  count = 3, 
  type = 'post' 
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="glass-card p-5 rounded-xl border border-white/10"
        >
          {type === 'post' ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-24 bg-white/10" />
                <Skeleton className="h-4 w-20 bg-white/10" />
              </div>
              <Skeleton className="h-7 w-3/4 mb-3 bg-white/10" />
              <Skeleton className="h-4 w-full mb-2 bg-white/10" />
              <Skeleton className="h-4 w-2/3 mb-6 bg-white/10" />
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded-full mr-2 bg-white/10" />
                  <Skeleton className="h-4 w-24 bg-white/10" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-12 bg-white/10" />
                  <Skeleton className="h-4 w-12 bg-white/10" />
                  <Skeleton className="h-4 w-12 bg-white/10" />
                </div>
              </div>
            </>
          ) : (
            // Version compacte pour les listes secondaires
            <>
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-5 w-20 bg-white/10" />
                <Skeleton className="h-4 w-16 bg-white/10" />
              </div>
              <Skeleton className="h-6 w-2/3 mb-2 bg-white/10" />
              <Skeleton className="h-4 w-full mb-4 bg-white/10" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20 bg-white/10" />
                <Skeleton className="h-4 w-24 bg-white/10" />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;

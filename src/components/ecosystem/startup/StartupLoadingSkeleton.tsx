
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StartupLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array(5).fill(0).map((_, i) => (
        <Card key={i} className="w-full p-4 border border-startupia-turquoise/20 bg-black/30">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
            <div className="flex-grow">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full max-w-md mb-2" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <div className="flex-shrink-0 space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StartupLoadingSkeleton;

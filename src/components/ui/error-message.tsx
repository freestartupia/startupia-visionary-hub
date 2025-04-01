
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage = ({ message, onRetry, className = '' }: ErrorMessageProps) => {
  return (
    <div className={`p-4 rounded-md bg-red-900/20 border border-red-500/40 text-white ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm">{message}</p>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-3"
            >
              Réessayer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const StartupHeader = () => {
  return (
    <div className="mb-8">
      <Link to="/startup" className="inline-flex items-center text-white/60 hover:text-startupia-turquoise">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la liste
      </Link>
    </div>
  );
};

export default StartupHeader;


import React from 'react';

interface ResultsCountProps {
  count: number;
}

const ResultsCount: React.FC<ResultsCountProps> = ({ count }) => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-white/70">
        {count} {count > 1 ? "profils trouvés" : "profil trouvé"}
      </p>
    </div>
  );
};

export default ResultsCount;

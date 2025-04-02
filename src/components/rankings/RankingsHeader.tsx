
import React from 'react';

interface RankingsHeaderProps {
  title: string;
  subtitle: string;
}

const RankingsHeader = ({ title, subtitle }: RankingsHeaderProps) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {title.split(' ').map((word, i, arr) => 
          i === arr.length - 1 ? 
            <React.Fragment key={i}><span className="text-startupia-turquoise">{word}</span></React.Fragment> : 
            <React.Fragment key={i}>{word} </React.Fragment>
        )}
      </h1>
      <p className="text-xl text-white/80 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default RankingsHeader;

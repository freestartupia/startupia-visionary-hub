
import React from "react";

interface StartupLogoProps {
  logoUrl?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

const StartupLogo = ({ logoUrl, name, size = "md" }: StartupLogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20"
  };
  
  const fontSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-4xl"
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-startupia-turquoise/10 flex items-center justify-center`}>
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={`${name} logo`} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span className={`${fontSizeClasses[size]} font-bold text-startupia-turquoise`}>
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
};

export default StartupLogo;

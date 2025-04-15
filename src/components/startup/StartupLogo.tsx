
import React from "react";

interface StartupLogoProps {
  logoUrl?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

const StartupLogo = ({ logoUrl, name, size = "md" }: StartupLogoProps) => {
  // Define sizes based on the size prop
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  const classes = `${sizeClasses[size]} rounded-md bg-black/30 flex items-center justify-center text-white overflow-hidden border border-white/10`;

  if (!logoUrl) {
    // If no logo URL is provided, show the first letter of the startup name
    return (
      <div className={classes}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      className={classes}
      onError={(e) => {
        // If the image fails to load, show the first letter of the startup name
        e.currentTarget.onerror = null;
        e.currentTarget.style.display = 'none';
        const container = e.currentTarget.parentElement;
        if (container) {
          const fallback = document.createElement('div');
          fallback.className = classes;
          fallback.textContent = name.charAt(0).toUpperCase();
          container.appendChild(fallback);
        }
      }}
    />
  );
};

export default StartupLogo;

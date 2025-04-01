
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLink {
  path: string;
  label: string;
  matches?: string[];
}

interface NavLinksProps {
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}

const navLinks: NavLink[] = [
  { 
    path: '/ecosystem', 
    label: "Hub IA Français",
    matches: ['/ecosystem', '/startups', '/radar', '/products']
  },
  { 
    path: '/cofounder', 
    label: "Trouver un cofondateur" 
  },
  { 
    path: '/community', 
    label: "Communauté" 
  },
  {
    path: '/blog',
    label: "Blog & Actualités"
  },
];

export const NavLinks: React.FC<NavLinksProps> = ({ isMobile = false, onMobileItemClick }) => {
  const location = useLocation();

  const isActive = (link: NavLink) => {
    if (link.matches) {
      return link.matches.some(path => location.pathname === path);
    }
    return location.pathname === link.path;
  };

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-4 py-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onMobileItemClick}
            className={`px-4 py-2 rounded-md hover:bg-white/5 ${
              isActive(link) ? 'text-startupia-turquoise' : 'text-white hover:text-startupia-turquoise'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <>
      {navLinks.map((link) => (
        <Link 
          key={link.path}
          to={link.path} 
          className={`transition-colors ${
            isActive(link) ? 'text-startupia-turquoise' : 'text-white/80 hover:text-white'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};

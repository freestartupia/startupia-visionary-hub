
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 gradient-text">404</h1>
          <p className="text-xl text-white/70 mb-8">La page que vous cherchez n'existe pas</p>
          <a href="/" className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-white py-2 px-6 rounded-md button-glow">
            Retourner à l'accueil
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;

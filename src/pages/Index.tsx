
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StartupIndex from '@/components/StartupIndex';
import StartupMatcher from '@/components/StartupMatcher';
import StartupCoFounder from '@/components/StartupCoFounder';
import InvestmentSection from '@/components/InvestmentSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    document.title = "Startupia.fr – L'intelligence derrière les startups IA françaises";
  }, []);

  return (
    <div className="min-h-screen bg-hero-pattern text-white relative">
      {/* Background gradient elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-purple/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-purple/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <StartupIndex />
        <StartupMatcher />
        <StartupCoFounder />
        <InvestmentSection />
        <Newsletter />
        <Footer />
      </div>
    </div>
  );
};

export default Index;


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
    <div className="min-h-screen bg-hero-pattern text-white">
      <Navbar />
      <HeroSection />
      <StartupIndex />
      <StartupMatcher />
      <StartupCoFounder />
      <InvestmentSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;

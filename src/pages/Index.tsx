
import React, { useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import HeroSection from '@/components/HeroSection';
import StartupIndex from '@/components/StartupIndex';
import StartupMatcher from '@/components/StartupMatcher';
import StartupCoFounder from '@/components/StartupCoFounder';
import InvestmentSection from '@/components/InvestmentSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import TrustSignals from '@/components/TrustSignals';
import StartupPromoBlog from '@/components/StartupPromoBlog';
import CommunitySummary from '@/components/CommunitySummary';
import SEO from '@/components/SEO';
import PromoTopbar from '@/components/PromoTopbar';

const Index = () => {
  useEffect(() => {
    // Add observers for each section to animate on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15, // Trigger when 15% of the section is visible
        rootMargin: '0px 0px -10% 0px', // Slightly earlier trigger
      }
    );

    // Get all timeline sections
    const sections = document.querySelectorAll('.timeline-section');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-hero-pattern text-white relative w-full overflow-x-hidden">
      <SEO 
        title="StartupIA.fr – Le Hub des Startups & Outils IA en France"
        description="Découvrez les meilleures startups IA françaises, les outils d'intelligence artificielle du moment, et connectez-vous à une communauté active d'innovateurs. Rejoignez le hub de l'IA en France !"
      />

      {/* Background gradient elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-64 sm:w-96 h-64 sm:h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-64 sm:w-96 h-64 sm:h-96 bg-startupia-gold/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* Promo Topbar - placed before Navbar */}
      <PromoTopbar />
      
      <Navbar />
      
      <main className="pt-24">
        <HeroSection />
        <TrustSignals />
        <StartupPromoBlog />
        <StartupIndex />
        <StartupMatcher />
        <CommunitySummary />
        <Testimonials />
        <StartupCoFounder />
        <InvestmentSection />
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

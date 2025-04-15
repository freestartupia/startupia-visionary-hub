
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Startupia - Accueil</title>
        <meta name="description" content="Bienvenue sur Startupia, la plateforme dédiée aux startups et entrepreneurs innovants." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <section className="py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-startupia-turquoise to-blue-500 bg-clip-text text-transparent">
            Bienvenue sur Startupia
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/80">
            La plateforme qui connecte entrepreneurs, cofondateurs et investisseurs pour faire grandir l'écosystème startup.
          </p>
        </section>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default Home;

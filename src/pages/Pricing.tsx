
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/Footer';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Startupia - Tarifs</title>
        <meta name="description" content="Découvrez nos différentes offres tarifaires." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <section className="py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Nos Tarifs</h1>
          <p className="text-xl mb-12 text-white/80">
            Choisissez l'offre qui correspond le mieux à vos besoins
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Offre Gratuite */}
            <div className="border border-white/10 rounded-lg p-6 bg-white/5 hover:bg-white/10 transition-colors">
              <h3 className="text-2xl font-bold mb-4">Gratuit</h3>
              <p className="text-3xl font-bold mb-6">0€</p>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>Profil entrepreneur basique</span>
                </li>
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>Accès à la communauté</span>
                </li>
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>Articles & ressources</span>
                </li>
              </ul>
            </div>
            
            {/* Offre Pro */}
            <div className="border border-startupia-turquoise rounded-lg p-6 bg-black/50 shadow-lg shadow-startupia-turquoise/20 transform scale-105">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-startupia-turquoise text-black font-bold px-4 py-1 rounded-full text-sm">
                Populaire
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-3xl font-bold mb-6">29€<span className="text-lg font-normal">/mois</span></p>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>Tout ce qui est inclus en Gratuit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>Profil cofondateur avancé</span>
                </li>
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>Référencement prioritaire</span>
                </li>
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>Notifications de matchs</span>
                </li>
              </ul>
            </div>
            
            {/* Offre Entreprise */}
            <div className="border border-white/10 rounded-lg p-6 bg-white/5 hover:bg-white/10 transition-colors">
              <h3 className="text-2xl font-bold mb-4">Entreprise</h3>
              <p className="text-3xl font-bold mb-6">Sur mesure</p>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>Tout ce qui est inclus en Pro</span>
                </li>
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>API personnalisée</span>
                </li>
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>Support dédié</span>
                </li>
                <li className="flex items-start">
                  <span className="text-startupia-turquoise mr-2">✓</span>
                  <span>Intégrations sur mesure</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default Pricing;

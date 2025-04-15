
import React from 'react';
import SEO from '@/components/SEO';
import { Container } from '@/components/ui/container';
import OptimizedPageWrapper from '@/components/OptimizedPageWrapper';
import Footer from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <OptimizedPageWrapper 
      title="Politique de Confidentialité - Startupia.fr" 
      description="Politique de confidentialité et informations sur la gestion des données personnelles sur Startupia.fr"
    >
      <SEO 
        title="Politique de Confidentialité - Startupia.fr"
        description="Politique de confidentialité et informations sur la gestion des données personnelles sur Startupia.fr"
      />
      
      <Container className="py-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Politique de Confidentialité</h1>
          <p className="text-sm text-white/60 mb-8">Dernière mise à jour : Avril 2025</p>
          
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
            <p>
              Chez Startupia, la confidentialité de nos utilisateurs est une priorité.<br />
              Notre application est gratuite, sans publicité, et nous collectons le minimum de données 
              nécessaires pour garantir le bon fonctionnement du service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Quelles données sont collectées ?</h2>
            <p>Nous collectons uniquement les informations suivantes :</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Adresse email (lors de la création de compte)</li>
              <li>Nom ou pseudonyme (si renseigné)</li>
              <li>Startups ajoutées par les utilisateurs</li>
              <li>Votes effectués par les utilisateurs</li>
            </ul>
            
            <p className="mt-4">Ces données sont utilisées uniquement pour :</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>permettre l'accès aux fonctionnalités (soumission, vote)</li>
              <li>garantir une expérience personnalisée et sécurisée</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Comment sont protégées vos données ?</h2>
            <p>
              Toutes les données sont stockées de manière sécurisée sur nos serveurs hébergés chez Netlify 
              et les bases de données associées à notre outil no-code.<br />
              Nous mettons en place des mesures de sécurité techniques et organisationnelles pour éviter 
              toute perte, vol ou accès non autorisé.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Utilisation des cookies</h2>
            <p>
              Nous n'utilisons pas de cookies publicitaires.<br />
              Uniquement des cookies techniques, si nécessaire, pour le bon fonctionnement de l'app.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Partage des données</h2>
            <p>
              Vos données ne sont jamais vendues, louées ou partagées à des tiers.<br />
              Nous respectons votre vie privée à 100 %.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Vos droits</h2>
            <p>Conformément au RGPD, vous pouvez :</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Demander la modification ou la suppression de vos informations</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>
            <p className="mt-4 font-medium">
              👉 Pour toute demande : <a href="mailto:startupia@gowithia.fr" className="text-startupia-turquoise hover:underline">startupia@gowithia.fr</a>
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Modifications</h2>
            <p>
              Cette politique peut être mise à jour à tout moment.<br />
              Nous vous informerons en cas de changement important.
            </p>
          </div>
        </div>
      </Container>
      
      <Footer />
    </OptimizedPageWrapper>
  );
};

export default PrivacyPolicy;

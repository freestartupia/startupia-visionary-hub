
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/Footer';

const Legal = () => {
  const { page } = useParams<{ page: string }>();
  
  const getTitle = () => {
    switch (page) {
      case 'terms':
        return 'Conditions d\'utilisation';
      case 'privacy':
        return 'Politique de confidentialité';
      case 'cookies':
        return 'Politique de cookies';
      default:
        return 'Informations légales';
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Startupia - {getTitle()}</title>
        <meta name="description" content={`Consultez nos ${getTitle().toLowerCase()}.`} />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <section className="py-12 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{getTitle()}</h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            {page === 'terms' && (
              <div>
                <h2>1. Acceptation des conditions</h2>
                <p>
                  En accédant et en utilisant Startupia, vous acceptez d'être lié par ces Conditions d'Utilisation, 
                  toutes les lois et réglementations applicables, et acceptez que vous êtes responsable du respect 
                  des lois locales applicables.
                </p>
                
                <h2>2. Utilisation de la plateforme</h2>
                <p>
                  Startupia est une plateforme qui vise à mettre en relation des entrepreneurs, des cofondateurs 
                  potentiels et autres acteurs de l'écosystème startup. Vous vous engagez à utiliser nos services 
                  de manière éthique et légale.
                </p>
                
                <h2>3. Comptes utilisateurs</h2>
                <p>
                  Certaines fonctionnalités de Startupia nécessitent la création d'un compte. Vous êtes responsable 
                  de maintenir la confidentialité de votre compte et mot de passe et de restreindre l'accès à votre 
                  ordinateur, et vous acceptez d'assumer la responsabilité de toutes les activités qui se produisent 
                  sous votre compte ou mot de passe.
                </p>
              </div>
            )}
            
            {page === 'privacy' && (
              <div>
                <h2>1. Collecte d'informations</h2>
                <p>
                  Nous collectons des informations personnelles lorsque vous vous inscrivez sur notre site, 
                  remplissez un formulaire ou interagissez avec d'autres utilisateurs. Ces informations peuvent 
                  inclure votre nom, adresse email, numéro de téléphone et informations professionnelles.
                </p>
                
                <h2>2. Utilisation des informations</h2>
                <p>
                  Les informations que nous collectons sont utilisées pour personnaliser votre expérience, 
                  améliorer notre site, améliorer le service client et vous envoyer des emails périodiques.
                </p>
                
                <h2>3. Protection des informations</h2>
                <p>
                  Nous mettons en œuvre diverses mesures de sécurité pour maintenir la sécurité de vos 
                  informations personnelles lorsque vous entrez, soumettez ou accédez à vos informations personnelles.
                </p>
              </div>
            )}
            
            {page === 'cookies' && (
              <div>
                <h2>1. Qu'est-ce qu'un cookie?</h2>
                <p>
                  Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile lorsque 
                  vous visitez un site web. Les cookies sont largement utilisés pour faire fonctionner les sites web 
                  ou les faire fonctionner plus efficacement, ainsi que pour fournir des informations aux propriétaires du site.
                </p>
                
                <h2>2. Comment utilisons-nous les cookies?</h2>
                <p>
                  Startupia utilise des cookies pour améliorer votre expérience sur notre site, pour se souvenir 
                  de vos préférences et pour mesurer l'efficacité de nos campagnes marketing.
                </p>
                
                <h2>3. Types de cookies que nous utilisons</h2>
                <p>
                  Nous utilisons à la fois des cookies de session et des cookies persistants. Les cookies de session 
                  sont temporaires et sont supprimés de votre appareil lorsque vous fermez votre navigateur. 
                  Les cookies persistants restent sur votre appareil jusqu'à ce qu'ils expirent ou que vous les supprimiez.
                </p>
              </div>
            )}
            
            {!['terms', 'privacy', 'cookies'].includes(page || '') && (
              <div>
                <p>
                  Veuillez sélectionner une page spécifique pour consulter nos informations légales. 
                  Vous pouvez accéder à nos conditions d'utilisation, notre politique de confidentialité 
                  ou notre politique de cookies.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default Legal;

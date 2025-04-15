
import React from 'react';
import SEO from '@/components/SEO';
import { Container } from '@/components/ui/container';
import OptimizedPageWrapper from '@/components/OptimizedPageWrapper';
import Footer from '@/components/Footer';

const LegalMentions: React.FC = () => {
  return (
    <OptimizedPageWrapper 
      title="Mentions Légales - Startupia.fr" 
      description="Mentions légales et informations juridiques concernant le site Startupia.fr"
    >
      <SEO 
        title="Mentions Légales - Startupia.fr"
        description="Mentions légales et informations juridiques concernant le site Startupia.fr"
      />
      
      <Container className="py-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Mentions Légales</h1>
          
          <div className="prose prose-invert max-w-none">
            <p>
              Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique, 
              il est précisé aux utilisateurs et visiteurs du site Startupia.fr les informations suivantes :
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Éditeur du site</h2>
            <p>
              Le site Startupia.fr est un projet édité par :<br />
              GOWITHIA<br />
              Siège social : Lyon, France<br />
              Email : startupia@gowithia.fr<br />
              Directeur de la publication : L'équipe fondatrice de Gowithia
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              Netlify, Inc.<br />
              2325 3rd Street, Suite 296, San Francisco, California 94107, États-Unis<br />
              Site : www.netlify.com
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Nature du service</h2>
            <p>
              Startupia est une application gratuite permettant aux utilisateurs de référencer et de voter pour des startups.<br />
              Aucune transaction commerciale n'est réalisée via la plateforme.<br />
              Le site est fourni à titre informatif et communautaire uniquement, sans garantie d'exactitude ni d'exhaustivité. 
              Les utilisateurs restent responsables des contenus qu'ils soumettent.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Responsabilité</h2>
            <p>
              L'éditeur ne pourra être tenu responsable :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>des propos ou contenus publiés par les utilisateurs ;</li>
              <li>des votes ou classements générés automatiquement ;</li>
              <li>de toute indisponibilité temporaire du service ou bug technique.</li>
            </ul>
            <p className="mt-4">
              Startupia se réserve le droit de modérer, supprimer ou refuser tout contenu jugé inapproprié, 
              frauduleux ou contraire aux lois en vigueur.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu du site (nom, logo, design, base de données) est la propriété exclusive de Gowithia.<br />
              Toute reproduction ou utilisation non autorisée est strictement interdite.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Données personnelles</h2>
            <p>
              Startupia ne collecte aucune donnée personnelle sensible.<br />
              Seules les informations nécessaires à la création d'un compte (email, nom) peuvent être utilisées 
              pour accéder aux fonctionnalités du site.<br />
              Aucune donnée n'est vendue ou cédée à des tiers.
            </p>
            <p className="mt-4">
              Conformément à la réglementation en vigueur, vous pouvez exercer vos droits en nous contactant 
              à l'adresse suivante : startupia@gowithia.fr
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Loi applicable</h2>
            <p>
              Les présentes mentions légales sont soumises à la législation française.<br />
              En cas de litige, les tribunaux compétents seront ceux du ressort de Lyon.
            </p>
          </div>
        </div>
      </Container>
      
      <Footer />
    </OptimizedPageWrapper>
  );
};

export default LegalMentions;

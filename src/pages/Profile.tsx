
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ProfileCoFounderProfiles from '@/components/profile/ProfileCoFounderProfiles';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Startupia - Profil</title>
        <meta name="description" content="Gérez votre profil et vos projets sur Startupia." />
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <section className="py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Bienvenue, {user?.user_metadata?.full_name || 'Entrepreneur'}
          </h1>
          
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-12 lg:col-span-4">
              <ProfileSettings />
            </div>
            
            <div className="md:col-span-12 lg:col-span-8">
              <ProfileCoFounderProfiles />
            </div>
          </div>
        </section>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default Profile;

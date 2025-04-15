
import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';

const StartupLoading = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto pt-32 pb-16 px-4 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-startupia-turquoise rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default StartupLoading;

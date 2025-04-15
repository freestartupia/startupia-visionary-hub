
import React from 'react';
import { useParams } from 'react-router-dom';
import Footer from '@/components/Footer';
import CommentsSection from '@/components/startup/CommentsSection';
import SEO from '@/components/SEO';
import NotFound from './NotFound';
import StartupHeader from '@/components/startup/StartupHeader';
import StartupDetails from '@/components/startup/StartupDetails';
import StartupCallToAction from '@/components/startup/StartupCallToAction';
import StartupLoading from '@/components/startup/StartupLoading';
import { useStartupDetails } from '@/hooks/useStartupDetails';

const StartupView = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    startup, 
    isLoading, 
    hasVoted, 
    isVoteLoading, 
    handleVote, 
    handleShare, 
    formatDate 
  } = useStartupDetails(id || '');

  if (isLoading) {
    return <StartupLoading />;
  }

  if (!startup) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title={`${startup.name} - Startup IA Française`}
        description={startup.shortDescription}
      />
      
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <StartupHeader />
        
        <StartupDetails 
          startup={startup}
          hasVoted={hasVoted}
          isVoteLoading={isVoteLoading}
          onVote={handleVote}
          onShare={handleShare}
          formatDate={formatDate}
        />
        
        <CommentsSection startupId={startup.id} />
        
        <StartupCallToAction 
          name={startup.name}
          websiteUrl={startup.websiteUrl}
          hasVoted={hasVoted}
          isVoteLoading={isVoteLoading}
          onVote={handleVote}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default StartupView;

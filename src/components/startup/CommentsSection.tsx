
import React, { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { fetchStartupComments } from '@/services/comments/commentService';
import { StartupComment } from '@/types/startup';
import { MessageSquare } from 'lucide-react';

interface CommentsSectionProps {
  startupId: string;
}

const CommentsSection = ({ startupId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<StartupComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStartupComments(startupId);
      setComments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadComments();
  }, [startupId]);
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-startupia-turquoise flex items-center">
        <MessageSquare className="mr-2" size={24} />
        Commentaires ({comments.length})
      </h2>
      
      <CommentForm 
        startupId={startupId} 
        onCommentAdded={loadComments} 
      />
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-white/70">Chargement des commentaires...</p>
        </div>
      ) : (
        <CommentList 
          comments={comments} 
          onCommentDeleted={loadComments} 
        />
      )}
    </div>
  );
};

export default CommentsSection;

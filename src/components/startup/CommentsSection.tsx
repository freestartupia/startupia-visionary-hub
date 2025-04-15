
import React, { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { fetchStartupComments } from '@/services/comments/commentService';
import { StartupComment } from '@/types/startup';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious,
  PaginationLink
} from "@/components/ui/pagination";

interface CommentsSectionProps {
  startupId: string;
}

const COMMENTS_PER_PAGE = 5;

const CommentsSection = ({ startupId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<StartupComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  
  const loadComments = async () => {
    setIsLoading(true);
    try {
      const result = await fetchStartupComments(startupId, currentPage, COMMENTS_PER_PAGE);
      setComments(result.data);
      setTotalComments(result.total);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadComments();
    
    // Configuration des abonnements en temps réel pour les commentaires
    const commentsChannel = supabase
      .channel('startup-comments-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'startup_comments',
          filter: `startup_id=eq.${startupId}`
        },
        (payload) => {
          console.log('Nouveau commentaire détecté:', payload);
          // Rafraîchir les commentaires si nous sommes sur la première page
          if (currentPage === 1) {
            loadComments();
          } else {
            // Incrémenter le compteur total
            setTotalComments(prev => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'startup_comments',
          filter: `startup_id=eq.${startupId}`
        },
        (payload) => {
          console.log('Commentaire supprimé détecté:', payload);
          // Rafraîchir les commentaires
          loadComments();
        }
      )
      .subscribe((status) => {
        console.log('Statut de l\'abonnement aux commentaires startup:', status);
      });
      
    return () => {
      supabase.removeChannel(commentsChannel);
    };
  }, [startupId, currentPage]);
  
  const totalPages = Math.ceil(totalComments / COMMENTS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-startupia-turquoise flex items-center">
        <MessageSquare className="mr-2" size={24} />
        Commentaires ({totalComments})
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
        <>
          <CommentList 
            comments={comments} 
            onCommentDeleted={loadComments} 
          />
          
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default CommentsSection;

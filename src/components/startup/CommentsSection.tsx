
import React, { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { fetchStartupComments } from '@/services/comments/commentService';
import { StartupComment } from '@/types/startup';
import { MessageSquare } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface CommentsSectionProps {
  startupId: string;
}

const CommentsSection = ({ startupId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<StartupComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const commentsPerPage = 5;
  
  const loadComments = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const { comments: data, total } = await fetchStartupComments(startupId, page, commentsPerPage);
      setComments(data);
      setTotalComments(total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadComments(currentPage);
  }, [startupId, currentPage]);
  
  const totalPages = Math.ceil(totalComments / commentsPerPage);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-startupia-turquoise flex items-center">
        <MessageSquare className="mr-2" size={24} />
        Commentaires ({totalComments})
      </h2>
      
      <CommentForm 
        startupId={startupId} 
        onCommentAdded={() => loadComments(1)} 
      />
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-white/70">Chargement des commentaires...</p>
        </div>
      ) : (
        <>
          <CommentList 
            comments={comments} 
            onCommentDeleted={() => loadComments(currentPage)} 
          />
          
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      className="cursor-pointer" 
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show current page, first, last, and pages around current
                    return (
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis
                    const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                    const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                    
                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <PaginationItem>
                            <span className="px-4 py-2 text-white/60">...</span>
                          </PaginationItem>
                        )}
                        
                        <PaginationItem>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                        
                        {showEllipsisAfter && (
                          <PaginationItem>
                            <span className="px-4 py-2 text-white/60">...</span>
                          </PaginationItem>
                        )}
                      </React.Fragment>
                    );
                  })}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      className="cursor-pointer" 
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default CommentsSection;

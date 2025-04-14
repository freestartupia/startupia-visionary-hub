
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useStartupsStore } from '@/store/startupsStore';

export const useVoting = () => {
  const { user } = useAuth();
  const { startupVotes, setStartupVotes } = useStartupsStore();

  const handleVote = async (e: React.MouseEvent, startupId: string, isUpvote: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Vous devez être connecté pour voter");
      return;
    }
    
    // Get current vote state
    const currentVoteState = startupVotes[startupId];
    const alreadyVotedSameWay = isUpvote ? currentVoteState.upvoted : currentVoteState.downvoted;
    
    try {
      // Apply optimistic update
      setStartupVotes(prev => {
        const newState = { ...prev };
        
        if (alreadyVotedSameWay) {
          // Remove vote
          newState[startupId] = {
            upvoted: false,
            downvoted: false,
            count: isUpvote ? prev[startupId].count - 1 : prev[startupId].count + 1
          };
        } else {
          // Add new vote or change vote
          const wasOppositeVote = isUpvote ? prev[startupId].downvoted : prev[startupId].upvoted;
          const countDelta = wasOppositeVote ? 2 : 1;
          
          newState[startupId] = {
            upvoted: isUpvote,
            downvoted: !isUpvote,
            count: isUpvote 
              ? prev[startupId].count + countDelta 
              : prev[startupId].count - countDelta
          };
        }
        
        return newState;
      });
      
      if (alreadyVotedSameWay) {
        // Delete the vote
        const { error } = await supabase
          .from('post_upvotes')
          .delete()
          .eq('post_id', startupId)
          .eq('user_id', user.id);
          
        if (error) throw error;
        
      } else {
        // Check if there's an existing vote to be replaced
        const { data } = await supabase
          .from('post_upvotes')
          .select('id')
          .eq('post_id', startupId)
          .eq('user_id', user.id);
          
        if (data && data.length > 0) {
          // Update the vote
          const { error } = await supabase
            .from('post_upvotes')
            .update({ is_upvote: isUpvote })
            .eq('post_id', startupId)
            .eq('user_id', user.id);
            
          if (error) throw error;
        } else {
          // Insert new vote
          const { error } = await supabase
            .from('post_upvotes')
            .insert({
              post_id: startupId,
              user_id: user.id,
              is_upvote: isUpvote
            });
            
          if (error) throw error;
        }
      }
      
      // Update the startup's upvote count in the database
      const { error } = await supabase
        .from('startups')
        .update({ upvotes_count: startupVotes[startupId].count })
        .eq('id', startupId);
        
      if (error) throw error;
      
    } catch (error) {
      console.error('Error toggling vote:', error);
      toast.error("Erreur lors du vote");
      
      // Revert optimistic update on error
      setStartupVotes(prev => ({ ...prev }));
    }
  };

  return { handleVote, startupVotes };
};

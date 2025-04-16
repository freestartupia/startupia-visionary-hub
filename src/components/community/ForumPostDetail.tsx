
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ForumPost, ForumReply } from '@/types/community';
import { useForumPost } from '@/hooks/use-forum-query';
import { toggleReplyLike } from '@/services/forum/replyLikeService';
import { togglePostUpvote } from '@/services/forumUpvoteService';
import { incrementPostViews } from '@/services/forum/postViewService';
import { getPostReplies, addReplyToPost } from '@/services/forum/replyService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PostContent from './forum/PostContent';
import ReplyForm from './forum/ReplyForm';
import ReplyList from './forum/ReplyList';
import { mapReplyFromDB } from '@/utils/forumMappers';

const ForumPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToName, setReplyingToName] = useState<string>('');
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const channelRef = useRef<any>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: postData, isLoading: isPostLoading } = useForumPost(postId || '');

  // Fetch post and replies
  useEffect(() => {
    const fetchPostAndReplies = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        
        if (postData) {
          setPost(postData);
          
          // Fetch replies separately
          const fetchedReplies = await getPostReplies(postId);
          setReplies(fetchedReplies);
          
          // Increment view count
          incrementPostViews(postId);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du post:', error);
        toast.error('Impossible de charger la discussion');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPostAndReplies();
  }, [postId, postData]);
  
  // Configure Realtime for new replies
  useEffect(() => {
    if (!postId) return;
    
    console.log('Configuration du canal Realtime pour les réponses du post:', postId);
    
    // Create a channel to listen for new replies
    const channel = supabase
      .channel(`post-${postId}-replies`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_replies',
          filter: `parent_id=eq.${postId}`
        },
        (payload) => {
          console.log('Nouvelle réponse détectée:', payload);
          
          // Map the new reply from the database format
          const newReply = mapReplyFromDB(payload.new);
          
          // Check if this is a reply to another comment or direct to the post
          if (newReply.replyParentId) {
            // This is a nested reply, add it to its parent
            setReplies(prevReplies => {
              return prevReplies.map(reply => {
                if (reply.id === newReply.replyParentId) {
                  // Add to the parent's nested replies
                  const updatedNestedReplies = [...(reply.nestedReplies || []), newReply];
                  return {
                    ...reply,
                    nestedReplies: updatedNestedReplies
                  };
                }
                return reply;
              });
            });
          } else {
            // This is a direct reply to the post
            // Check if the reply is already in the state to avoid duplicates
            setReplies(prevReplies => {
              const exists = prevReplies.some(reply => reply.id === newReply.id);
              if (exists) return prevReplies;
              return [...prevReplies, { ...newReply, nestedReplies: [] }];
            });
          }
        }
      )
      .subscribe();
    
    channelRef.current = channel;
    
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [postId]);
  
  // Configure a separate channel for reply likes updates
  useEffect(() => {
    if (!postId) return;
    
    const likesChannel = supabase
      .channel(`post-${postId}-reply-likes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_reply_likes'
        },
        async (payload) => {
          // Get the reply ID from the payload
          const replyId = payload.new?.reply_id || payload.old?.reply_id;
          
          if (replyId) {
            // Fetch the updated like count for this reply
            const { data } = await supabase
              .from('forum_replies')
              .select('id, likes')
              .eq('id', replyId)
              .single();
              
            if (data) {
              // Function to update likes in a nested structure
              const updateReplyLikes = (replyList: ForumReply[]): ForumReply[] => {
                return replyList.map(reply => {
                  if (reply.id === replyId) {
                    return {
                      ...reply,
                      likes: data.likes,
                      isLiked: payload.eventType === 'INSERT' && user?.id === payload.new?.user_id
                    };
                  }
                  
                  if (reply.nestedReplies && reply.nestedReplies.length > 0) {
                    return {
                      ...reply,
                      nestedReplies: updateReplyLikes(reply.nestedReplies)
                    };
                  }
                  
                  return reply;
                });
              };
              
              // Update the replies state with new like count
              setReplies(prevReplies => updateReplyLikes(prevReplies));
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(likesChannel);
    };
  }, [postId, user?.id]);
  
  const handleGoBack = () => {
    navigate('/community?tab=forum');
  };
  
  const handleReplyAdded = async (newReply: ForumReply) => {
    // Immediately update UI with the new reply
    if (newReply.replyParentId) {
      // This is a nested reply, add it to its parent
      setReplies(prevReplies => {
        return prevReplies.map(reply => {
          if (reply.id === newReply.replyParentId) {
            // Add to the parent's nested replies
            const updatedNestedReplies = [...(reply.nestedReplies || []), newReply];
            return {
              ...reply,
              nestedReplies: updatedNestedReplies
            };
          }
          return reply;
        });
      });
    } else {
      // This is a direct reply to the post
      setReplies(prevReplies => [...prevReplies, { ...newReply, nestedReplies: [] }]);
    }
    
    // Reset the replying state
    setReplyingTo(null);
    setReplyingToName('');
  };
  
  const handleReplyToComment = (replyId: string) => {
    // Find the reply name to display in the form
    const findReplyName = (replyList: ForumReply[]): string => {
      for (const reply of replyList) {
        if (reply.id === replyId) {
          return reply.authorName;
        }
        if (reply.nestedReplies && reply.nestedReplies.length > 0) {
          const nestedName = findReplyName(reply.nestedReplies);
          if (nestedName) return nestedName;
        }
      }
      return '';
    };
    
    const authorName = findReplyName(replies);
    setReplyingTo(replyId);
    setReplyingToName(authorName);
    
    // Scroll to reply form
    document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleUpvotePost = async () => {
    if (!user || !post) {
      toast.error('Vous devez être connecté pour upvoter');
      navigate('/auth');
      return;
    }
    
    try {
      await togglePostUpvote(post.id);
    } catch (error) {
      console.error('Erreur lors de l\'upvote:', error);
      toast.error('Impossible d\'upvoter le post');
    }
  };
  
  const handleLikeReply = async (replyId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour liker');
      navigate('/auth');
      return;
    }
    
    try {
      await toggleReplyLike(replyId);
    } catch (error) {
      console.error('Erreur lors du like de la réponse:', error);
      toast.error('Impossible de liker la réponse');
    }
  };

  if (isLoading || isPostLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Discussion introuvable</h3>
        <Button onClick={handleGoBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au forum
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="hidden md:block">
        <Button onClick={handleGoBack} variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au forum
        </Button>
      </div>
      
      <PostContent 
        post={post} 
        onUpvote={handleUpvotePost}
      />
      
      <ReplyForm 
        postId={post.id}
        user={user}
        replyingTo={replyingTo}
        replyingToName={replyingToName}
        onReplyAdded={handleReplyAdded}
        onCancelReply={() => {
          setReplyingTo(null);
          setReplyingToName('');
        }}
      />
      
      <ReplyList 
        replies={replies}
        onLikeReply={handleLikeReply}
        onReplyToComment={handleReplyToComment}
      />
    </div>
  );
};

export default ForumPostDetail;

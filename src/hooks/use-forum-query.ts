
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ForumPost, ForumReply } from '@/types/community';
import { 
  getForumPosts, 
  getForumPost,
  PostSortOption 
} from '@/services/forum/postFetchService';
import { togglePostLike } from '@/services/forum/postLikeService';
import { toggleReplyLike } from '@/services/forum/replyLikeService';
import { createForumPost } from '@/services/forum/postCreateService';
import { incrementPostViews } from '@/services/forum/postViewService';
import { addReplyToPost } from '@/services/forum/replyService';
import { toast } from 'sonner';

// Query keys for React Query
export const forumKeys = {
  all: ['forum'] as const,
  posts: () => [...forumKeys.all, 'posts'] as const,
  sortedPosts: (sortBy: PostSortOption) => [...forumKeys.posts(), sortBy] as const,
  post: (id: string) => [...forumKeys.all, 'post', id] as const,
  replies: (postId: string) => [...forumKeys.all, 'replies', postId] as const,
};

// Hook to fetch all forum posts with caching
export const useForumPosts = (sortBy: PostSortOption = 'recent') => {
  return useQuery({
    queryKey: forumKeys.sortedPosts(sortBy),
    queryFn: () => getForumPosts(sortBy),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch a specific post with caching
export const useForumPost = (postId: string) => {
  return useQuery({
    queryKey: forumKeys.post(postId),
    queryFn: () => getForumPost(postId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!postId
  });
};

// Hook for liking a post with optimistic update
export const useTogglePostLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string, userId: string }) => {
      return togglePostLike(postId);
    },
    onMutate: async ({ postId }) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: forumKeys.post(postId) });
      
      // Snapshot of previous state
      const previousPost = queryClient.getQueryData<ForumPost>(forumKeys.post(postId));
      
      // Optimistic update
      if (previousPost) {
        queryClient.setQueryData<ForumPost>(forumKeys.post(postId), {
          ...previousPost,
          isLiked: !previousPost.isLiked,
          likes: previousPost.isLiked 
            ? Math.max(0, previousPost.likes - 1) 
            : previousPost.likes + 1
        });
      }
      
      return { previousPost };
    },
    onError: (err, { postId }, context) => {
      // Restore previous state in case of error
      if (context?.previousPost) {
        queryClient.setQueryData(forumKeys.post(postId), context.previousPost);
      }
      toast.error("Impossible de mettre à jour votre appréciation");
    },
    onSettled: (_, __, { postId }) => {
      // Invalidate and refresh
      queryClient.invalidateQueries({ queryKey: forumKeys.post(postId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.posts() });
    },
  });
};

// Hook for liking a reply with optimistic update
export const useToggleReplyLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (replyId: string) => {
      return toggleReplyLike(replyId);
    },
    onError: () => {
      toast.error("Impossible de mettre à jour votre appréciation");
    },
  });
};

// Hook for creating a new post
export const useCreateForumPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postData: { 
      title: string, 
      content: string, 
      category: string, 
      authorName: string, 
      authorAvatar?: string 
    }) => {
      return createForumPost(
        postData.title,
        postData.content,
        postData.category as any,
        postData.authorName,
        postData.authorAvatar
      );
    },
    onSuccess: () => {
      toast.success("Votre discussion a été publiée");
      queryClient.invalidateQueries({ queryKey: forumKeys.posts() });
    },
    onError: () => {
      toast.error("Impossible de publier votre discussion");
    }
  });
};

// Hook for adding a reply to a post or to another reply
export const useAddReplyToPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (replyData: {
      postId: string;
      content: string;
      authorName: string;
      authorAvatar?: string;
      replyParentId?: string | null;
    }) => {
      return addReplyToPost(
        replyData.postId,
        replyData.content,
        replyData.authorName,
        replyData.authorAvatar,
        replyData.replyParentId
      );
    },
    onSuccess: (_, variables) => {
      toast.success(variables.replyParentId 
        ? "Votre réponse au commentaire a été publiée" 
        : "Votre réponse a été publiée"
      );
      queryClient.invalidateQueries({ queryKey: forumKeys.post(variables.postId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.replies(variables.postId) });
    },
    onError: () => {
      toast.error("Impossible de publier votre réponse");
    }
  });
};

// Hook for incrementing post views
export const useIncrementPostViews = () => {
  return useMutation({
    mutationFn: incrementPostViews,
    // No need for invalidation as the view count is not displayed in real-time
  });
};

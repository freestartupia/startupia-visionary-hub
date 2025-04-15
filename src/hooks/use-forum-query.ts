import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ForumPost, ForumReply } from '@/types/community';
import { 
  getForumPosts, 
  getForumPost,
  PostSortOption 
} from '@/services/forum/postFetchService';
import { togglePostLike } from '@/services/forum/postLikeService';
import { createForumPost } from '@/services/forum/postCreateService';
import { incrementPostViews } from '@/services/forum/postViewService';
import { toast } from 'sonner';

// Clés de requête pour React Query
export const forumKeys = {
  all: ['forum'] as const,
  posts: () => [...forumKeys.all, 'posts'] as const,
  sortedPosts: (sortBy: PostSortOption) => [...forumKeys.posts(), sortBy] as const,
  post: (id: string) => [...forumKeys.all, 'post', id] as const,
};

// Hook pour récupérer tous les posts du forum avec mise en cache
export const useForumPosts = (sortBy: PostSortOption = 'recent') => {
  return useQuery({
    queryKey: forumKeys.sortedPosts(sortBy),
    queryFn: () => getForumPosts(sortBy),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook pour récupérer un post spécifique avec mise en cache
export const useForumPost = (postId: string) => {
  return useQuery({
    queryKey: forumKeys.post(postId),
    queryFn: () => getForumPost(postId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!postId
  });
};

// Hook pour liker un post avec mise à jour optimiste
export const useTogglePostLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string, userId: string }) => {
      return togglePostLike(postId);
    },
    onMutate: async ({ postId }) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: forumKeys.post(postId) });
      
      // Snapshot de l'état précédent
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
      // Restaurer l'état précédent en cas d'erreur
      if (context?.previousPost) {
        queryClient.setQueryData(forumKeys.post(postId), context.previousPost);
      }
      toast.error("Impossible de mettre à jour votre appréciation");
    },
    onSettled: (_, __, { postId }) => {
      // Invalider et rafraîchir
      queryClient.invalidateQueries({ queryKey: forumKeys.post(postId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.posts() });
    },
  });
};

// Hook pour créer un nouveau post
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

// Hook pour incrémenter les vues d'un post
export const useIncrementPostViews = () => {
  return useMutation({
    mutationFn: incrementPostViews,
    // Pas besoin d'invalidation car le compte de vues n'est pas affiché en temps réel
  });
};

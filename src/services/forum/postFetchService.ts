
import { supabase } from "@/integrations/supabase/client";
import { ForumPost } from "@/types/community";
import { mapPostFromDB } from "@/utils/forumMappers";
import { toast } from "sonner";
import { getPostLikeStatus } from "./postLikeService";
import { getRepliesForPost } from "../../services/forumReplyService";
import { checkPostUpvote } from "../forumUpvoteService";

// Cache pour stocker les résultats des requêtes récentes
const postsCache = {
  data: null as ForumPost[] | null,
  timestamp: 0,
  ttl: 5 * 60 * 1000, // 5 minutes en millisecondes
};

// Fonction pour récupérer tous les posts du forum avec gestion de cache
export const getForumPosts = async (): Promise<ForumPost[]> => {
  try {
    // Vérifier si les données en cache sont toujours valides
    const now = Date.now();
    if (postsCache.data && (now - postsCache.timestamp < postsCache.ttl)) {
      console.log("Utilisation des données en cache pour les posts du forum");
      return postsCache.data;
    }
    
    // Si pas de cache valide, effectuer la requête à Supabase
    console.log("Récupération des posts depuis Supabase");
    const { data: postsData, error: postsError } = await supabase
      .from('forum_posts')
      .select('*')
      .order('upvotes_count', { ascending: false }) // Tri par upvotes d'abord
      .order('created_at', { ascending: true });    // Puis par date (plus ancien en premier en cas d'égalité)
      
    if (postsError) {
      console.error("Error fetching posts:", postsError);
      toast.error("Impossible de charger les discussions");
      throw postsError;
    }
    
    // Si aucun post n'est trouvé, retourner un tableau vide immédiatement
    if (!postsData || postsData.length === 0) {
      postsCache.data = [];
      postsCache.timestamp = now;
      return [];
    }
    
    // Récupérer l'utilisateur courant pour le statut de like et d'upvote
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    // Mapper les posts à notre interface TypeScript
    const posts = postsData.map(mapPostFromDB);
    
    // Utiliser Promise.all pour paralléliser les requêtes de likes et replies
    const postsWithReplies = await Promise.all(posts.map(async (post) => {
      // Récupérer les réponses pour ce post
      const replies = await getRepliesForPost(post.id);
      
      // Vérifier si l'utilisateur a aimé le post
      let isLiked = false;
      let isUpvoted = false;
      
      if (userId) {
        isLiked = await getPostLikeStatus(post.id, userId);
        isUpvoted = await checkPostUpvote(post.id);
      }
      
      return { ...post, replies, isLiked, isUpvoted };
    }));
    
    // Mettre à jour le cache
    postsCache.data = postsWithReplies;
    postsCache.timestamp = now;
    
    return postsWithReplies;
  } catch (error) {
    console.error("Error in getForumPosts:", error);
    toast.error("Impossible de charger les discussions");
    return [];
  }
};

// Cache pour les posts individuels
const postDetailCache = new Map<string, { data: ForumPost, timestamp: number }>();

// Fonction pour récupérer un post spécifique du forum avec ses réponses
export const getForumPost = async (postId: string): Promise<ForumPost> => {
  try {
    // Vérifier si les données en cache sont toujours valides
    const now = Date.now();
    const cachedPost = postDetailCache.get(postId);
    
    if (cachedPost && (now - cachedPost.timestamp < postsCache.ttl)) {
      console.log(`Utilisation des données en cache pour le post ${postId}`);
      return cachedPost.data;
    }
    
    console.log(`Récupération du post ${postId} depuis Supabase`);
    const { data: postData, error: postError } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('id', postId)
      .single();
      
    if (postError) {
      console.error("Error fetching post:", postError);
      toast.error("Impossible de charger la discussion");
      throw postError;
    }
    
    const post = mapPostFromDB(postData);
    
    // Récupérer l'utilisateur courant pour le statut de like
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    // Récupérer toutes les réponses pour ce post
    const replies = await getRepliesForPost(postId);
    
    // Vérifier si l'utilisateur a aimé le post
    let isLiked = false;
    let isUpvoted = false;
    
    if (userId) {
      isLiked = await getPostLikeStatus(postId, userId);
      isUpvoted = await checkPostUpvote(postId);
    }
    
    const completePost = { ...post, replies, isLiked, isUpvoted };
    
    // Mettre à jour le cache
    postDetailCache.set(postId, {
      data: completePost,
      timestamp: now
    });
    
    return completePost;
  } catch (error) {
    console.error("Error in getForumPost:", error);
    toast.error("Impossible de charger la discussion");
    throw error;
  }
};

// Fonction pour invalider le cache des posts (à appeler après ajout/modification)
export const invalidatePostsCache = () => {
  postsCache.data = null;
  postsCache.timestamp = 0;
  postDetailCache.clear();
};

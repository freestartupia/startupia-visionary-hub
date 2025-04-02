
import { supabase } from "@/integrations/supabase/client";
import { ForumPost, ForumReply, ForumCategory } from "@/types/community";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Fonction pour récupérer tous les posts du forum
export const getForumPosts = async (): Promise<ForumPost[]> => {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    toast.error("Impossible de charger les discussions");
    throw error;
  }
  
  // Récupérer les réponses pour chaque post
  const postsWithReplies = await Promise.all(data.map(async (post) => {
    const { data: replies, error: repliesError } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('parent_id', post.id)
      .order('created_at', { ascending: true });
      
    if (repliesError) {
      console.error("Erreur lors de la récupération des réponses:", repliesError);
      return { ...post, replies: [] };
    }
    
    // Vérifier si l'utilisateur actuel a liké le post
    const { data: currentUserLike, error: likeError } = await supabase
      .from('forum_post_likes')
      .select('*')
      .eq('post_id', post.id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
      .maybeSingle();
      
    return { 
      ...post, 
      replies: replies || [], 
      isLiked: !!currentUserLike
    };
  }));
  
  return postsWithReplies;
};

// Fonction pour récupérer un post spécifique avec ses réponses
export const getForumPost = async (postId: string): Promise<ForumPost> => {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('*')
    .eq('id', postId)
    .single();
    
  if (error) {
    console.error("Erreur lors de la récupération du post:", error);
    toast.error("Impossible de charger la discussion");
    throw error;
  }
  
  // Récupérer les réponses pour le post
  const { data: replies, error: repliesError } = await supabase
    .from('forum_replies')
    .select('*')
    .eq('parent_id', postId)
    .order('created_at', { ascending: true });
    
  if (repliesError) {
    console.error("Erreur lors de la récupération des réponses:", repliesError);
    return { ...data, replies: [] };
  }
  
  // Vérifier les réponses aux réponses (commentaires imbriqués)
  const repliesWithNestedReplies = await Promise.all(replies.map(async (reply) => {
    const { data: nestedReplies, error: nestedError } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('reply_parent_id', reply.id)
      .order('created_at', { ascending: true });
      
    // Vérifier si l'utilisateur actuel a liké la réponse
    const { data: currentUserLike, error: likeError } = await supabase
      .from('forum_reply_likes')
      .select('*')
      .eq('reply_id', reply.id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
      .maybeSingle();
      
    return { ...reply, nestedReplies: nestedReplies || [], isLiked: !!currentUserLike };
  }));
  
  // Vérifier si l'utilisateur actuel a liké le post
  const { data: currentUserLike, error: likeError } = await supabase
    .from('forum_post_likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
    .maybeSingle();
  
  return { ...data, replies: repliesWithNestedReplies, isLiked: !!currentUserLike };
};

// Fonction pour créer un nouveau post
export const createForumPost = async (
  title: string,
  content: string,
  category: ForumCategory,
  authorName: string,
  authorAvatar?: string
): Promise<ForumPost> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("Utilisateur non authentifié:", userError);
    toast.error("Vous devez être connecté pour créer un post");
    throw userError || new Error("Utilisateur non authentifié");
  }
  
  const newPost = {
    title,
    content,
    category,
    author_id: userData.user.id,
    author_name: authorName,
    author_avatar: authorAvatar,
    tags: [],
    created_at: new Date().toISOString(),
    likes: 0,
    views: 0,
    is_pinned: false
  };
  
  const { data, error } = await supabase
    .from('forum_posts')
    .insert(newPost)
    .select()
    .single();
    
  if (error) {
    console.error("Erreur lors de la création du post:", error);
    toast.error("Impossible de créer la discussion");
    throw error;
  }
  
  toast.success("Discussion créée avec succès");
  return { ...data, replies: [] };
};

// Fonction pour ajouter une réponse à un post
export const addReplyToPost = async (
  postId: string,
  content: string,
  authorName: string,
  authorAvatar?: string,
  parentReplyId?: string
): Promise<ForumReply> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("Utilisateur non authentifié:", userError);
    toast.error("Vous devez être connecté pour répondre");
    throw userError || new Error("Utilisateur non authentifié");
  }
  
  const newReply = {
    parent_id: postId,
    reply_parent_id: parentReplyId || null,
    content,
    author_id: userData.user.id,
    author_name: authorName,
    author_avatar: authorAvatar,
    created_at: new Date().toISOString(),
    likes: 0
  };
  
  const { data, error } = await supabase
    .from('forum_replies')
    .insert(newReply)
    .select()
    .single();
    
  if (error) {
    console.error("Erreur lors de l'ajout de la réponse:", error);
    toast.error("Impossible d'ajouter la réponse");
    throw error;
  }
  
  toast.success("Réponse ajoutée avec succès");
  return data;
};

// Fonction pour liker/unliker un post
export const togglePostLike = async (postId: string): Promise<{ liked: boolean, newCount: number }> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("Utilisateur non authentifié:", userError);
    toast.error("Vous devez être connecté pour liker un post");
    throw userError || new Error("Utilisateur non authentifié");
  }
  
  // Vérifier si l'utilisateur a déjà liké ce post
  const { data: existingLike, error: checkError } = await supabase
    .from('forum_post_likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userData.user.id)
    .maybeSingle();
    
  if (checkError) {
    console.error("Erreur lors de la vérification du like:", checkError);
    toast.error("Une erreur est survenue");
    throw checkError;
  }
  
  if (existingLike) {
    // Si l'utilisateur a déjà liké, on retire son like
    const { error: deleteError } = await supabase
      .from('forum_post_likes')
      .delete()
      .eq('id', existingLike.id);
      
    if (deleteError) {
      console.error("Erreur lors de la suppression du like:", deleteError);
      toast.error("Impossible de retirer le like");
      throw deleteError;
    }
    
    // Mettre à jour le compteur de likes dans la table forum_posts
    const { data: post, error: updateError } = await supabase
      .from('forum_posts')
      .select('likes')
      .eq('id', postId)
      .single();
      
    if (updateError) {
      console.error("Erreur lors de la mise à jour du compteur:", updateError);
    } else {
      const newCount = Math.max(0, (post.likes || 1) - 1);
      await supabase
        .from('forum_posts')
        .update({ likes: newCount })
        .eq('id', postId);
        
      return { liked: false, newCount };
    }
    
    return { liked: false, newCount: 0 };
  } else {
    // Si l'utilisateur n'a pas encore liké, on ajoute son like
    const { error: insertError } = await supabase
      .from('forum_post_likes')
      .insert({
        post_id: postId,
        user_id: userData.user.id,
        created_at: new Date().toISOString()
      });
      
    if (insertError) {
      console.error("Erreur lors de l'ajout du like:", insertError);
      toast.error("Impossible d'ajouter le like");
      throw insertError;
    }
    
    // Mettre à jour le compteur de likes dans la table forum_posts
    const { data: post, error: updateError } = await supabase
      .from('forum_posts')
      .select('likes')
      .eq('id', postId)
      .single();
      
    if (updateError) {
      console.error("Erreur lors de la mise à jour du compteur:", updateError);
    } else {
      const newCount = (post.likes || 0) + 1;
      await supabase
        .from('forum_posts')
        .update({ likes: newCount })
        .eq('id', postId);
        
      return { liked: true, newCount };
    }
    
    return { liked: true, newCount: 1 };
  }
};

// Fonction pour liker/unliker une réponse
export const toggleReplyLike = async (replyId: string): Promise<{ liked: boolean, newCount: number }> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("Utilisateur non authentifié:", userError);
    toast.error("Vous devez être connecté pour liker une réponse");
    throw userError || new Error("Utilisateur non authentifié");
  }
  
  // Vérifier si l'utilisateur a déjà liké cette réponse
  const { data: existingLike, error: checkError } = await supabase
    .from('forum_reply_likes')
    .select('*')
    .eq('reply_id', replyId)
    .eq('user_id', userData.user.id)
    .maybeSingle();
    
  if (checkError) {
    console.error("Erreur lors de la vérification du like:", checkError);
    toast.error("Une erreur est survenue");
    throw checkError;
  }
  
  if (existingLike) {
    // Si l'utilisateur a déjà liké, on retire son like
    const { error: deleteError } = await supabase
      .from('forum_reply_likes')
      .delete()
      .eq('id', existingLike.id);
      
    if (deleteError) {
      console.error("Erreur lors de la suppression du like:", deleteError);
      toast.error("Impossible de retirer le like");
      throw deleteError;
    }
    
    // Mettre à jour le compteur de likes dans la table forum_replies
    const { data: reply, error: updateError } = await supabase
      .from('forum_replies')
      .select('likes')
      .eq('id', replyId)
      .single();
      
    if (updateError) {
      console.error("Erreur lors de la mise à jour du compteur:", updateError);
    } else {
      const newCount = Math.max(0, (reply.likes || 1) - 1);
      await supabase
        .from('forum_replies')
        .update({ likes: newCount })
        .eq('id', replyId);
        
      return { liked: false, newCount };
    }
    
    return { liked: false, newCount: 0 };
  } else {
    // Si l'utilisateur n'a pas encore liké, on ajoute son like
    const { error: insertError } = await supabase
      .from('forum_reply_likes')
      .insert({
        reply_id: replyId,
        user_id: userData.user.id,
        created_at: new Date().toISOString()
      });
      
    if (insertError) {
      console.error("Erreur lors de l'ajout du like:", insertError);
      toast.error("Impossible d'ajouter le like");
      throw insertError;
    }
    
    // Mettre à jour le compteur de likes dans la table forum_replies
    const { data: reply, error: updateError } = await supabase
      .from('forum_replies')
      .select('likes')
      .eq('id', replyId)
      .single();
      
    if (updateError) {
      console.error("Erreur lors de la mise à jour du compteur:", updateError);
    } else {
      const newCount = (reply.likes || 0) + 1;
      await supabase
        .from('forum_replies')
        .update({ likes: newCount })
        .eq('id', replyId);
        
      return { liked: true, newCount };
    }
    
    return { liked: true, newCount: 1 };
  }
};

// Fonction pour incrémenter le compteur de vues d'un post
export const incrementPostViews = async (postId: string): Promise<void> => {
  const { data: post, error: getError } = await supabase
    .from('forum_posts')
    .select('views')
    .eq('id', postId)
    .single();
    
  if (getError) {
    console.error("Erreur lors de la récupération des vues:", getError);
    return;
  }
  
  const newViewCount = (post.views || 0) + 1;
  
  const { error: updateError } = await supabase
    .from('forum_posts')
    .update({ views: newViewCount })
    .eq('id', postId);
    
  if (updateError) {
    console.error("Erreur lors de la mise à jour des vues:", updateError);
  }
};

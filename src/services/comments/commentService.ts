
import { supabase } from '@/integrations/supabase/client';
import { StartupComment } from '@/types/startup';

export async function fetchStartupComments(startupId: string, page: number = 1, limit: number = 5): Promise<{comments: StartupComment[], total: number}> {
  try {
    // Get total count first
    const { count, error: countError } = await supabase
      .from('startup_comments')
      .select('*', { count: 'exact', head: true })
      .eq('startup_id', startupId)
      .eq('is_spam', false);
    
    if (countError) throw countError;
    
    // Then get paginated data
    const { data, error } = await supabase
      .from('startup_comments')
      .select('*')
      .eq('startup_id', startupId)
      .eq('is_spam', false)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    
    if (error) throw error;
    
    return {
      comments: data.map(transformCommentFromDB),
      total: count || 0
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des commentaires pour la startup ${startupId}:`, error);
    return { comments: [], total: 0 };
  }
}

export async function addComment(comment: Omit<StartupComment, 'id' | 'createdAt' | 'likes'>): Promise<StartupComment | null> {
  try {
    // Check for spam
    const isSpam = checkForSpam(comment.content);
    
    const { data, error } = await supabase
      .from('startup_comments')
      .insert([{
        startup_id: comment.startupId,
        user_id: comment.userId,
        user_name: comment.userName,
        user_avatar: comment.userAvatar,
        content: comment.content,
        is_spam: isSpam
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return transformCommentFromDB(data);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
    return null;
  }
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('startup_comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du commentaire ${commentId}:`, error);
    return false;
  }
}

function transformCommentFromDB(data: any): StartupComment {
  return {
    id: data.id,
    startupId: data.startup_id,
    userId: data.user_id,
    userName: data.user_name,
    userAvatar: data.user_avatar,
    content: data.content,
    createdAt: data.created_at,
    likes: data.likes || 0,
    isSpam: data.is_spam
  };
}

// Simple anti-spam system
function checkForSpam(content: string): boolean {
  const spamPatterns = [
    /viagra/i,
    /cialis/i,
    /\bcasino\b/i,
    /\bporn\b/i,
    /\bxxx\b/i,
    /\bbet\b/i,
    /\bgambling\b/i,
    /buy.{1,10}now/i,
    /\bmake money\b/i,
    /\bfree money\b/i,
    /\blottery\b/i,
    /\bpayday loan\b/i,
    /\bdiscount\b/i,
    /\bcheap\b.*\bpill\b/i,
    /\bwebcam\b/i,
    /https?:\/\/[^\s]{25,}/i, // Long URLs
    /\[\s?url\s?=/i, // BBCode URL
    /@gmail\.com/i, // Email in content
    /@yahoo\.com/i,
    /@hotmail\.com/i
  ];
  
  // Check for repeating characters (like "aaaaa" or "!!!!!!")
  const repeatingCharsPattern = /(.)\1{4,}/;
  
  // Check for ALL CAPS (allowing some caps, but mostly CAPS is likely spam)
  const tooManyCapsCheck = (content: string) => {
    if (content.length < 10) return false;
    const upperChars = content.replace(/[^A-Z]/g, '').length;
    const totalChars = content.replace(/[^A-Za-z]/g, '').length;
    return totalChars > 0 && upperChars / totalChars > 0.7;
  };
  
  // Check for too many links
  const tooManyLinks = (content.match(/https?:\/\//g) || []).length > 2;
  
  // Check for any spam patterns
  const hasSpamWords = spamPatterns.some(pattern => pattern.test(content));
  
  // Check for unicode obfuscation (common in spam)
  const hasUnicodeObfuscation = /[\u0250-\u02AF\u2000-\u2BFF]/.test(content);
  
  return hasSpamWords || 
         repeatingCharsPattern.test(content) || 
         tooManyCapsCheck(content) || 
         tooManyLinks || 
         hasUnicodeObfuscation;
}

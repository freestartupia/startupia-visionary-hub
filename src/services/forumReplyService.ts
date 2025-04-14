
// Re-export all reply-related services for backward compatibility
export { addReplyToPost, getPostReplies } from './forum/replyService';

// Also export a function to get replies for a post (needed by postFetchService)
export const getRepliesForPost = async (postId: string) => {
  // Import and call the getPostReplies function to avoid code duplication
  const { getPostReplies } = await import('./forum/replyService');
  return getPostReplies(postId);
};

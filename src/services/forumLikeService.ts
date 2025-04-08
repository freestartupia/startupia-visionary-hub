
// Re-export all like-related services for backward compatibility
export { LikeResponse } from './forum/likeUtils';
export { getPostLikeStatus, togglePostLike } from './forum/postLikeService';
export { getReplyLikeStatus, toggleReplyLike } from './forum/replyLikeService';

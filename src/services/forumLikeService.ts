
// Re-export all like-related services for backward compatibility
export type { LikeResponse } from '@/types/community';
export { 
  checkAuthentication, 
  safeRpcCall 
} from './forum/likeUtils';
export { getPostLikeStatus, togglePostLike } from './forum/postLikeService';
export { getReplyLikeStatus, toggleReplyLike } from './forum/replyLikeService';

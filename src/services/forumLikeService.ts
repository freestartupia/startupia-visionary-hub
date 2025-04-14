
// Re-export all like-related services for backward compatibility
export type { LikeResponse } from '@/types/community';
export { 
  checkAuthentication, 
  safeRpcCall 
} from './forum/likeUtils';
export { 
  getPostLikeStatus, 
  togglePostLike,
  getPostLikeCount,
  checkIfUserLikedPost,
  likePost,
  unlikePost
} from './forum/postLikeService';
export { 
  getReplyLikeStatus, 
  toggleReplyLike,
  getReplyLikeCount,
  checkIfUserLikedReply,
  likeReply,
  unlikeReply
} from './forum/replyLikeService';

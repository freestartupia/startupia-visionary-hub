
// This file re-exports all forum-related services for backward compatibility
export { 
  getForumPosts, 
  getForumPost, 
  incrementPostViews 
} from './forum/postFetchService';

export { 
  createForumPost 
} from './forum/postCreateService';

export { 
  getRepliesForPost, 
  addReplyToPost 
} from './forum/replyService';

// Export like-related services
export type { LikeResponse } from '@/types/community';
export { 
  checkAuthentication
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

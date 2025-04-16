
// Re-export reply like service for backward compatibility
export type { LikeResponse } from '@/types/community';
export { getReplyLikeStatus, toggleReplyLike } from './forum/replyLikeService';
